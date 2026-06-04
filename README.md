# 💰 FinSense - Aplikasi Pencatatan Keuangan UMKM Berbasis AI

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)

**FinSense** adalah platform manajemen keuangan yang dirancang khusus untuk UMKM. Dilengkapi dengan kecerdasan buatan (AI) untuk **prediksi pemasukan harian**, **rekomendasi restok stok**, **deteksi produk terlaris**, serta **input transaksi via suara**. Dashboard interaktif membantu pemilik usaha memantau kesehatan keuangan secara real-time.

> 🚀 Proyek ini adalah Capstone Project untuk Coding Camp 2026.

---

## ✨ Fitur Utama

| Modul | Fitur |
|-------|-------|
| 🔐 **Autentikasi** | Login, Register, Lupa password (via email) |
| 📝 **Transaksi** | Tambah manual & input suara (voice-to-intent) |
| 📊 **Dashboard** | Grafik pemasukan, pengeluaran, saldo, top produk |
| 🤖 **Prediksi** | Forecasting pemasukan harian dengan model time-series |
| 🧠 **Rekomendasi** | Restok stok otomatis & produk terlaris |
| 🗣️ **AI Speech** | Konversi suara ke transaksi (*mendukung [121 produk](./PRODUCTS_LIST.md), [lihat daftar](./PRODUCTS_LIST.md)*) |

> ℹ️ **Batasan Voice Recognition:** Model speech-to-intent hanya mengenali **121 produk** yang sudah dilatih. Produk di luar daftar tidak akan terdeteksi. Silakan gunakan input manual untuk produk lain.

---

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TailwindCSS + DaisyUI
- Axios, React Router DOM
- Recharts (grafik)

### Backend
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT (authentication)
- Nodemailer (reset password)
- Bcrypt

### AI Service (Python)
- FastAPI + Uvicorn
- TensorFlow 2.19
- Librosa (audio processing)
- Pandas, NumPy, Scikit-learn
- Holidays (fitur hari libur)

### Deployment (opsional)
- Frontend: Vercel / Netlify
- Backend: Railway / Render
- AI Service: Hugging Face Spaces / Local

---

## 🗣️ Batasan Voice Recognition

Model AI speech-to-intent pada FinSense saat ini **hanya mendukung 121 produk** yang sudah dilatih. Produk di luar daftar **tidak akan terdeteksi** oleh sistem suara.

📋 **Daftar lengkap 121 produk** dapat dilihat di [PRODUCTS_LIST.md](./PRODUCTS_LIST.md).

> 📌 **Catatan:** Untuk produk yang tidak ada dalam daftar, silakan gunakan **input manual** atau **pencarian teks** pada halaman POS Terminal. Tim pengembang akan terus menambah dataset produk pada versi berikutnya.

## 📦 Struktur Proyek

```
FinSense/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── prisma/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── context/
│   ├── public/
│   ├── .env.example
│   └── package.json
├── ai-service/
│   ├── app.py               # FastAPI untuk voice
│   ├── app_prediction.py    # FastAPI untuk forecasting
│   ├── get_prediction.py    # Inference script
│   ├── requirements.txt
│   └── Dockerfile (opsional)
├── README.md
└── .gitignore
```

---

## ⚙️ Setup Environment

### Prasyarat
- **Node.js** 18+ dan **npm**
- **Python** 3.10 – 3.12
- **PostgreSQL** (atau database lain yang didukung Prisma)
- **Git**

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

### 4. AI Service (Voice & Forecasting)
```bash
cd ai-service
# Buat virtual environment (disarankan)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau .\venv\Scripts\activate (Windows)

pip install -r requirements.txt
# Download model dari tautan di bawah (lihat bagian Model ML)
# Jalankan voice service
python app.py                # → http://localhost:8000
# Jalankan forecasting service (terminal terpisah)
python app_prediction.py     # → http://localhost:8001
```

---

## 🤖 Tautan Model Machine Learning

Karena ukuran file model besar (>100 MB), model tidak disertakan dalam repository. Silakan unduh dari tautan berikut:

### 1. FinSense SLU (Speech-to-Intent)
- **File:** `finsense_slu.keras` (~2 MB)
- **Download:** [Google Drive / Hugging Face – SLU Model](https://drive.google.com/your-link) *(ganti dengan link Anda)*
- **Penempatan:** Letakkan di folder `ai-service/`

### 2. FinSense Forecasting (Revenue, Stock, Top Products)
- **File:**
  - `model_prediksi.keras` (revenue)
  - `model_product.keras` (top products)
  - `model_stock.keras` (stock restock)
  - `scaler_prediksi.pkl` (scaler & metadata)
- **Download:** [Google Drive / Hugging Face – Forecasting Models](https://drive.google.com/your-link) *(ganti dengan link Anda)*
- **Penempatan:** Letakkan di folder `ai-service/`

**Catatan:** Jika tidak menggunakan AI service, backend tetap berjalan dengan fallback manual (transaksi biasa, tanpa prediksi).

---

## 🚀 Cara Menjalankan Aplikasi (Lengkap)

1. **Database PostgreSQL** pastikan berjalan.
2. **Backend:** Terminal 1 → `cd backend && npm run dev`
3. **Frontend:** Terminal 2 → `cd frontend && npm run dev`
4. **AI Voice:** Terminal 3 → `cd ai-service && python app.py`
5. **AI Forecasting:** Terminal 4 → `cd ai-service && python app_prediction.py`
6. Buka browser di `http://localhost:5173`

> Untuk **testing voice di mobile**, pastikan frontend diakses via **HTTPS** (gunakan ngrok atau deploy ke Vercel).  
> Server AI (FastAPI) harus dapat diakses oleh backend Express (pastikan `AI_SERVICE_URL` benar).

---

## 📄 Konfigurasi Environment

### Backend `.env` (contoh)
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/finsense"
JWT_SECRET="your_super_secret_key"
AI_SERVICE_URL=http://localhost:8000/predict
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` (contoh)
```env
VITE_API_URL=http://localhost:5000/api
```
## 📄 Referensi

- [Daftar 121 Produk yang Didukung Voice](./PRODUCTS_LIST.md)

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
🌐 [https://finsense-project.vercel.app](https://finsense-project.vercel.app)

