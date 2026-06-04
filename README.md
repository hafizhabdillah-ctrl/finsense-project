```markdown
# 💰 FinSense - Aplikasi Pencatatan Keuangan UMKM Berbasis AI

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-19-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.19-orange)

**FinSense** adalah platform manajemen keuangan yang dirancang khusus untuk UMKM. Dilengkapi dengan kecerdasan buatan (AI) untuk **prediksi pemasukan harian**, **rekomendasi restok stok**, **deteksi produk terlaris**, serta **input transaksi via suara** (voice‑to‑produk). Dashboard interaktif membantu pemilik usaha memantau kesehatan keuangan secara real-time.

> 🚀 Proyek ini adalah Capstone Project **Coding Camp 2026** (Team ID: CC26-PSU282).

---

## ✨ Fitur Utama

| Modul | Fitur |
|-------|-------|
| 🔐 **Autentikasi** | Login, Register, Lupa password (via email) |
| 📝 **Transaksi** | Tambah manual & input suara (voice‑to‑produk) |
| 📊 **Dashboard** | Grafik pemasukan, pengeluaran, saldo, top produk |
| 🤖 **Prediksi** | Forecasting pemasukan harian dengan model time‑series |
| 🧠 **Rekomendasi** | Restok stok otomatis & produk terlaris (AI) |
| 🗣️ **AI Speech** | Konversi suara ke produk (mendukung **121 produk**) |
| 📦 **Manajemen Stok** | CRUD produk, riwayat stok, notifikasi stok menipis |
| 🛒 **POS Terminal** | Penjualan cepat dengan keranjang & voice |

> 🗣️ **Batasan Voice Recognition** – Model speech‑to‑produk hanya mengenali **121 produk** yang sudah dilatih. [Lihat daftar lengkap](./PRODUCTS_LIST.md). Di luar daftar, gunakan input manual.

---

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- TailwindCSS 4 + DaisyUI
- Axios, React Router DOM
- React Chart.js 2, SweetAlert2

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT (authentication)
- Nodemailer (reset password)
- Bcrypt, Multer, Fluent‑ffmpeg

### AI Service (Python)
- FastAPI + Uvicorn
- TensorFlow 2.19
- Librosa (audio processing)
- Pandas, NumPy, Scikit‑learn
- Holidays (fitur hari libur)

### Deployment (opsional)
- Frontend: Vercel / Netlify
- Backend: Railway / Render
- AI Service: Hugging Face Spaces / Local / VPS

---

## 📁 Struktur Proyek

```
FINSENSE-PROJECT/
├── ai-service/
│   ├── model_v10/                 # Model voice (savedmodel + artifacts.json)
│   ├── serve_model.py             # FastAPI untuk voice (produk)
│   ├── app_prediction.py          # FastAPI untuk forecasting (revenue, stock, top products)
│   ├── combined_ai.py             # Menggabungkan voice + prediction dalam satu server
│   ├── get_prediction.py          # Inference logic 3 model
│   ├── inference_wrapper_v10.py   # Wrapper voice + jumlah parsing
│   ├── requirements.txt
│   ├── Dockerfile
│   └── ... (file model .keras, .pkl)
├── backend/
│   ├── src/                       (controllers, routes, services, middleware)
│   ├── prisma/                    (schema, migrations)
│   ├── uploads/                   (temporary audio)
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── data-science/                  (notebooks, data dictionary)
├── README.md
└── PRODUCTS_LIST.md
```

---

## ⚙️ Setup Environment

### Prasyarat
- **Node.js** 18+ dan **npm**
- **Python** 3.10 – 3.12
- **PostgreSQL** (atau database lain yang didukung Prisma)
- **Git**
- **ffmpeg** (di server AI – wajib untuk decode audio dari browser)

### 1. Clone repository
```bash
git clone https://github.com/username/finsense.git
cd finsense
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env: isi DATABASE_URL, JWT_SECRET, dll
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev   # Running di http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev   # Running di http://localhost:5173
```

### 4. AI Service (Voice + Forecasting)

#### Opsi A – Jalankan voice dan prediction secara terpisah (dua terminal)
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # atau .\venv\Scripts\activate
pip install -r requirements.txt

# Terminal 1: voice model (produk)
python serve_model.py          # → http://localhost:8000

# Terminal 2: forecasting (revenue, stock, top products)
python app_prediction.py       # → http://localhost:8001
```

#### Opsi B – Jalankan combined server (satu port, kedua API)
```bash
cd ai-service
python combined_ai.py          # → http://localhost:8000
# Endpoints:
# - /voice/predict     (produk dari audio)
# - /predict/health    (forecasting)
```

> 📌 **Pastikan ffmpeg terinstal** di sistem server AI.  
> - Windows: download dari [ffmpeg.org](https://ffmpeg.org/download.html), tambahkan ke PATH.  
> - macOS: `brew install ffmpeg`  
> - Linux: `sudo apt install ffmpeg`

---

## 🤖 Tautan Model Machine Learning

Karena ukuran file model besar (>100 MB), model tidak disertakan dalam repository. Silakan unduh dari tautan berikut:

### 1. Voice Model (SLU – produk)
- **Folder:** `model_v10/` berisi:
  - `savedmodel_v10/` (TF SavedModel)
  - `artifacts.json` (vocab 121 produk & unit_price_lookup)
- **Download:** [Google Drive – Voice Model v10](https://drive.google.com/your-link) *(ganti dengan link nyata)*
- **Penempatan:** Ekstrak ke `ai-service/model_v10/`

### 2. Forecasting Models (Revenue, Stock, Top Products)
- **File:**
  - `model_prediksi.keras` (revenue)
  - `model_product.keras` (top 5 produk)
  - `model_stock.keras` (restok stok)
  - `scaler_prediksi.pkl` (scaler & metadata)
- **Download:** [Google Drive – Forecasting Models](https://drive.google.com/your-link) *(ganti dengan link nyata)*
- **Penempatan:** Letakkan di `ai-service/` (satu folder dengan `app_prediction.py`)

**Catatan:** Jika tidak menggunakan AI service, backend tetap berjalan dengan fallback manual (transaksi biasa, tanpa prediksi).

---

## 🚀 Cara Menjalankan Aplikasi (Lengkap)

1. **Database PostgreSQL** pastikan berjalan.
2. **Backend:** Terminal 1 → `cd backend && npm run dev`
3. **Frontend:** Terminal 2 → `cd frontend && npm run dev`
4. **AI Service:** Terminal 3 → `cd ai-service && python combined_ai.py`
5. Buka browser di `http://localhost:5173`

> Untuk **testing voice di mobile**, pastikan frontend diakses via **HTTPS** (gunakan ngrok atau deploy ke Vercel).  
> Server AI (FastAPI) harus dapat diakses oleh backend Express (setting `AI_SERVICE_URL` di `.env`).

---

## 📄 Konfigurasi Environment

### Backend `.env` (contoh)
```env
DATABASE_URL={{ DATABASE_URL }}
PORT={{ PORT }}
JWT_SECRET={{ JWT_SECRET }}
FRONTEND_URL={{ FRONTEND_URL }}
AI_SERVICE_URL={{ AI_SERVICE_URL }}
PREDICTION_SERVICE_URL={{ PREDICTION_SERVICE_URL }}
MAIL_HOST={{ MAIL_HOST }}
MAIL_PORT={{ MAIL_PORT }}
MAIL_USER={{ MAIL_USER }}
MAIL_PASSWORD={{ MAIL_PASSWORD }}
```

### Frontend `.env` (contoh)
```env
VITE_API_URL={{ VITE_API_URL }}
VITE_VOICE_AI_URL={{ VITE_VOICE_AI_URL }}
VITE_PRED_AI_URL={{ VITE_PRED_AI_URL }}
```

---


## 🤝 Tim Pengembang

| Nama | Role | Kontak |
|------|------|--------|
| Ibrahim Irfanul Haq | AI Engineer | [GitHub](https://github.com/) |
| Rafi Azhar Suadmaja | AI Engineer | [GitHub](https://github.com/) |
| Alifah Mu’asyaroh | Data Scientist | [GitHub](https://github.com/) |
| Alviyatur Rahmaniyah | Data Scientist | [GitHub](https://github.com/) |
| Hafizh Kusuma Abdillah | Full-Stack Web Developer | [GitHub](https://github.com/) |
| Rifki Ardiansah | Full-Stack Web Developer | [GitHub](https://github.com/) |

---

## 🙏 Ucapan Terima Kasih

- **Coding Camp 2026** oleh DBS Foundation
- Mentor dan penguji yang telah memberikan arahan berharga
- Seluruh pihak yang telah mendukung penyelesaian proyek ini

---

**FinSense – Smart Finance for UMKM**  
🌐 [https://finsense-project.vercel.app](https://finsense-project.vercel.app) (contoh)  
📧 finsense@support.com
```

---
