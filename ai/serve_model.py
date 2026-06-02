"""
FinSense FastAPI — Serve produk model (v10) for the voice frontend.
====================================================================

Endpoints:
  POST /         : menerima audio + transcript (form-data) → prediksi produk dari audio
  POST /transcript : menerima JSON { transcript } → prediksi produk dari teks (tanpa audio)

Run:
  uvicorn serve_model:app --host 0.0.0.0 --port 8000
"""

import io
import json
import tempfile
import os
from pathlib import Path

import numpy as np
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import shared inference logic
from inference_wrapper_v10 import audio_to_logmel, parse_jumlah, DEFAULT_AUDIO_CONFIG, FinSenseEngine

app = FastAPI(title="FinSense Produk Model")
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

# ─── Load model + artifacts once at startup ───────────────────────
MODEL_DIR = "model_v10/savedmodel_v10"
ARTIFACTS = "model_v10/artifacts.json"

import tensorflow as tf

print("Loading audio model…")
_model = tf.saved_model.load(MODEL_DIR)
_infer = _model.signatures["serving_default"]
with open(ARTIFACTS, encoding="utf-8") as f:
    _art = json.load(f)
PRODUK_VOCAB = _art["produk_vocab"]
UNIT_PRICE = _art["unit_price_lookup"]
print(f"✓ Audio model ready ({len(PRODUK_VOCAB)} produk)")

# Inisialisasi engine transcript-only (untuk endpoint /transcript)
engine_text = FinSenseEngine(model_path=None, artifacts_path=ARTIFACTS)
print("✓ Transcript engine ready")

# ─── Helper: decode audio ke log-mel ─────────────────────────────
def _decode_audio_to_feat(audio_bytes):
    fd, path = tempfile.mkstemp(suffix=".webm")
    os.close(fd)
    try:
        with open(path, "wb") as f:
            f.write(audio_bytes)
        return audio_to_logmel(path, DEFAULT_AUDIO_CONFIG)
    finally:
        if os.path.exists(path):
            os.unlink(path)

# ─── Endpoint 1: audio + transcript (produk dari model audio) ────
@app.post("/")
async def predict(
    audio: UploadFile = File(...),
    transcript: str = Form(""),
    jumlah: int = Form(0),
):
    feat = _decode_audio_to_feat(await audio.read())
    out = _infer(log_mel=tf.constant(feat[np.newaxis, ...]))
    probs = list(out.values())[0].numpy()[0]
    idx = int(np.argmax(probs))
    produk = PRODUK_VOCAB[idx]
    top3_idx = np.argsort(probs)[-3:][::-1]

    qty = jumlah if jumlah > 0 else (parse_jumlah(transcript) or 1)
    unit_price = UNIT_PRICE.get(produk, 0)
    harga = unit_price * qty

    return {
        "intent": "jual",
        "produk": produk,
        "produk_conf": float(probs[idx]),
        "produk_top3": [[PRODUK_VOCAB[i], float(probs[i])] for i in top3_idx],
        "jumlah": qty,
        "unit_price": unit_price,
        "harga": harga,
    }

# ─── Endpoint 2: hanya transcript (produk dari fuzzy match) ──────
class TranscriptRequest(BaseModel):
    transcript: str

@app.post("/transcript")
async def transcript_endpoint(req: TranscriptRequest):
    result = engine_text.process_transcript(req.transcript)
    return {
        "produk": result["produk"],
        "produk_conf": result.get("produk_match_score", 0.5),
        "produk_top3": [],
        "jumlah": result["jumlah"],
        "unit_price": result["unit_price"],
        "harga": result["harga"],
    }

@app.get("/health")
def health():
    return {"status": "ok", "n_produk": len(PRODUK_VOCAB)}