# combined_ai.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import kedua app yang sudah ada
from serve_model import app as voice_app
from app_prediction import app as predict_app

# Buat app utama
app = FastAPI(title="FinSense AI Combined")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount kedua sub-app
app.mount("/voice", voice_app)   # endpoint: /voice/predict, /voice/health
app.mount("/predict", predict_app)     # endpoint: /predict/predict-revenue, /predict/predict-top-products, /predict/predict-stock, /predict/health

@app.get("/")
def root():
    return {"message": "FinSense AI is running", "endpoints": ["/voice", "/predict"]}