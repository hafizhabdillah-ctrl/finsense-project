"""
FinSense SLU — FastAPI serving wrapper
=======================================

Wraps the trained Keras model into HTTP REST API that frontend/backend
(Express.js) can call.

Endpoint:
  POST /predict       — upload audio file, return {jumlah, harga, confidence}
  GET  /health        — check if service is alive
  GET  /              — info page

Run:
  uvicorn app:app --host 0.0.0.0 --port 8000

Test:
  curl -X POST http://localhost:8000/predict -F "audio=@sample.wav"
"""
import os
import io
import json
import tempfile
import warnings

warnings.filterwarnings('ignore')
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

import numpy as np
import librosa
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ════════════════════════════════════════════════════════════════════
# 1. CUSTOM COMPONENTS — must match training notebook exactly
# ════════════════════════════════════════════════════════════════════

class SpecAugment(layers.Layer):
    def __init__(self, freq_mask_param=12, time_mask_param=30,
                 n_freq_masks=2, n_time_masks=2, **kwargs):
        super().__init__(**kwargs)
        self.freq_mask_param = freq_mask_param
        self.time_mask_param = time_mask_param
        self.n_freq_masks = n_freq_masks
        self.n_time_masks = n_time_masks

    def call(self, inputs, training=None):
        # In production we never apply masking
        return inputs

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'freq_mask_param': self.freq_mask_param,
                    'time_mask_param': self.time_mask_param,
                    'n_freq_masks': self.n_freq_masks,
                    'n_time_masks': self.n_time_masks})
        return cfg


class AttentionPooling(layers.Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def build(self, input_shape):
        feat_dim = input_shape[-1]
        self.W = self.add_weight(name='attn_weights', shape=(feat_dim, 1),
                                  initializer='glorot_uniform', trainable=True)
        self.b = self.add_weight(name='attn_bias', shape=(1,),
                                  initializer='zeros', trainable=True)
        super().build(input_shape)

    def call(self, x):
        scores = tf.matmul(x, self.W) + self.b
        weights = tf.nn.softmax(scores, axis=1)
        return tf.reduce_sum(x * weights, axis=1)

    def get_config(self):
        return super().get_config()

# ════════════════════════════════════════════════════════════════════
# ADDITIONAL CUSTOM COMPONENT: AudioAugment (required by saved model)
# ════════════════════════════════════════════════════════════════════

class AudioAugment(layers.Layer):
    """Dummy layer for inference. Training augmentation is disabled."""
    def __init__(self, max_shift_frames=20, noise_snr_db=20.0,
                 scale_range=0.1, apply_prob=0.7, **kwargs):
        super().__init__(**kwargs)
        self.max_shift_frames = max_shift_frames
        self.noise_snr_db = noise_snr_db
        self.scale_range = scale_range
        self.apply_prob = apply_prob

    def call(self, inputs, training=None):
        # No augmentation during inference
        return inputs

    def get_config(self):
        config = super().get_config()
        config.update({
            'max_shift_frames': self.max_shift_frames,
            'noise_snr_db': self.noise_snr_db,
            'scale_range': self.scale_range,
            'apply_prob': self.apply_prob,
        })
        return config

# ════════════════════════════════════════════════════════════════════
# 2. LOAD MODEL & CONFIG
# ════════════════════════════════════════════════════════════════════

MODEL_PATH = os.environ.get('MODEL_PATH', './finsense_slu.keras')
ARTIFACTS_PATH = os.environ.get('ARTIFACTS_PATH', './artifacts.json')

print(f"Loading artifacts from {ARTIFACTS_PATH}...")
with open(ARTIFACTS_PATH) as f:
    ARTIFACTS = json.load(f)

NORM = ARTIFACTS['norm_params']
AUDIO_CFG = ARTIFACTS['audio_config']
HARGA_LOG_MIN = NORM['harga_log_min']
HARGA_LOG_MAX = NORM['harga_log_max']

print(f"Loading model from {MODEL_PATH}...")
model = keras.models.load_model(
    MODEL_PATH,
    custom_objects={
        'SpecAugment': SpecAugment,
        'AttentionPooling': AttentionPooling,
        'AudioAugment': AudioAugment,
    },
    compile=False,
)
print(f"✅ Model loaded — params: {model.count_params():,}")


# ════════════════════════════════════════════════════════════════════
# 3. AUDIO PREPROCESSING (same as training)
# ════════════════════════════════════════════════════════════════════

def audio_to_logmel(audio_bytes: bytes) -> np.ndarray:
    """Convert audio bytes → log-Mel spectrogram (max_frames, n_mels)."""
    # librosa needs a file path or BytesIO
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        tmp.write(audio_bytes)
        tmp_path = tmp.name

    try:
        y, sr = librosa.load(tmp_path, sr=AUDIO_CFG['sample_rate'])
    finally:
        os.unlink(tmp_path)

    S = librosa.feature.melspectrogram(
        y=y, sr=sr,
        n_mels=AUDIO_CFG['n_mels'],
        n_fft=AUDIO_CFG['n_fft'],
        hop_length=AUDIO_CFG['hop_length'],
        win_length=AUDIO_CFG['win_length'],
    )
    S_db = librosa.power_to_db(S, ref=np.max).T
    S_db = (S_db - S_db.mean()) / (S_db.std() + 1e-8)

    max_frames = AUDIO_CFG['max_frames']
    n_mels = AUDIO_CFG['n_mels']
    if S_db.shape[0] < max_frames:
        pad = np.zeros((max_frames - S_db.shape[0], n_mels), dtype=np.float32)
        S_db = np.vstack([S_db, pad])
    else:
        S_db = S_db[:max_frames]
    return S_db.astype(np.float32)


def denorm_harga(y_norm: float) -> int:
    log_val = y_norm * (HARGA_LOG_MAX - HARGA_LOG_MIN) + HARGA_LOG_MIN
    return int(np.expm1(log_val))


# ════════════════════════════════════════════════════════════════════
# 4. FASTAPI APP
# ════════════════════════════════════════════════════════════════════

app = FastAPI(
    title="FinSense SLU API",
    description="Speech-to-Intent untuk POS minimarket voice-first",
    version="1.0",
)

# Allow CORS so Express.js / browser can call
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ⚠️ Production: ganti dengan domain frontend Anda
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictResponse(BaseModel):
    jumlah: int
    jumlah_confidence: float
    harga: int
    harga_normalized: float
    success: bool = True


@app.get("/")
def root():
    return {
        "service": "FinSense SLU API",
        "model_params": model.count_params(),
        "audio_config": AUDIO_CFG,
        "endpoints": {"predict": "POST /predict", "health": "GET /health"},
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
async def predict(audio: UploadFile = File(...)):
    """
    Upload audio WAV file → return predicted {jumlah, harga} + confidence.

    Frontend (Express.js) usage:
      const form = new FormData();
      form.append('audio', audioBlob, 'recording.wav');
      const res = await axios.post('http://localhost:8000/predict', form);
      // res.data = { jumlah: 3, harga: 36000, ... }
    """
    if not audio.filename.lower().endswith(('.wav', '.webm', '.ogg', '.mp3')):
        raise HTTPException(400, "Unsupported audio format. Use WAV/WEBM/OGG/MP3.")

    try:
        audio_bytes = await audio.read()
        feat = audio_to_logmel(audio_bytes)
        feat_batch = np.expand_dims(feat, 0)

        out = model(feat_batch, training=False)
        jumlah_probs = out[0].numpy()[0]
        harga_norm = float(out[1].numpy()[0][0])

        jumlah_idx = int(np.argmax(jumlah_probs))
        return PredictResponse(
            jumlah=jumlah_idx + 1,
            jumlah_confidence=float(jumlah_probs[jumlah_idx]),
            harga=denorm_harga(harga_norm),
            harga_normalized=harga_norm,
        )
    except Exception as e:
        raise HTTPException(500, f"Prediction failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
