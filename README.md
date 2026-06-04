```markdown

<div align="center">
# 💰 FinSense
### *Smart Finance Assistant for UMKM*

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.19-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

[![GitHub stars](https://img.shields.io/github/stars/yourusername/finsense?style=social)](https://github.com/yourusername/finsense/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/finsense?style=social)](https://github.com/yourusername/finsense/network/members)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **Capstone Project Coding Camp 2026** – Team ID: CC26-PSU282
</div>

---

## 📌 Tentang FinSense

FinSense adalah **asisten keuangan cerdas** untuk UMKM yang menggabungkan pencatatan transaksi manual, **input suara** (voice-to-produk), serta **prediksi AI** untuk pemasukan, rekomendasi restok stok, dan deteksi produk terlaris. Dibangun dengan arsitektur modern dan siap di-deploy ke cloud.

### 🎯 Masalah yang Diselesaikan
- UMKM kesulitan mencatat transaksi secara real-time
- Stok tidak terpantau → kehabisan atau overstock
- Sulit memprediksi pemasukan di masa depan
- Input transaksi lambat (terutama saat ramai)

### 💡 Solusi FinSense
✅ Pencatatan **cepat** (manual + voice)  
✅ Dashboard **interaktif** & real-time  
✅ Prediksi **akurat** dengan model time-series  
✅ Rekomendasi **restok otomatis**  
✅ **Voice input** untuk 121 produk (tingkat akurasi tinggi)

---

## ✨ Fitur Unggulan

| 🚀 Fitur | 📝 Deskripsi |
|----------|--------------|
| 🔐 **Autentikasi** | Login, register, reset password via email (JWT) |
| 🛒 **POS + Voice** | Input transaksi dengan suara (121 produk) atau manual |
| 📊 **Dashboard** | Grafik pemasukan/pengeluaran, saldo, top 5 produk |
| 🔮 **Forecasting** | Prediksi pemasukan harian (model LSTM) |
| 📦 **Manajemen Stok** | CRUD produk, riwayat stok, notifikasi stok menipis |
| 🧠 **Rekomendasi AI** | Restok stok & produk terlaris dari model ML |

> 🗣️ **Voice Recognition** – Model mendukung **121 produk spesifik** ([lihat daftar](./PRODUCTS_LIST.md)). Di luar itu, gunakan input manual.

---

## 🖼️ Demo & Screenshot

> *Sertakan screenshot aplikasi di sini. Contoh:*

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=FinSense+Dashboard" alt="Dashboard" width="80%">
  <br>
  <i>Dashboard utama – grafik pemasukan & pengeluaran</i>
</div>

<details>
<summary>📸 Klik untuk melihat screenshot lainnya</summary>
<div align="center">
  <img src="https://via.placeholder.com/400x300?text=Voice+Input" alt="Voice Input">
  <img src="https://via.placeholder.com/400x300?text=Prediction+Result" alt="Prediction">
  <img src="https://via.placeholder.com/400x300?text=Stock+Management" alt="Stock">
</div>
</details>

---

## 🧱 Arsitektur Sistem

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Browser   │────▶│   React     │────▶│   Express.js    │
│  (User)     │◀────│   Vite      │◀────│   (Backend API)  │
└─────────────┘     └─────────────┘     └────────┬────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────┐
│                      PostgreSQL (Prisma)                 │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────┐     ┌─────────────┐
│ FastAPI     │◀────│   AI Models │
│ (Voice +    │     │ (TensorFlow)│
│ Forecasting)│     └─────────────┘
└─────────────┘
```

**Komunikasi:**  
- Frontend ↔ Backend: REST API (JSON, JWT)  
- Backend ↔ AI Service: HTTP requests (voice & prediction)  
- AI Service ↔ Model: TensorFlow Serving / direktori lokal

---

## 📂 Struktur Proyek (Detail)

```bash
FinSense/
├── .github/                 # Workflows CI/CD (opsional)
├── ai-service/              # Layanan AI (Python)
│   ├── model_v10/           # Model voice (SavedModel + artifacts)
│   ├── serve_model.py       # FastAPI untuk voice (port 8000)
│   ├── app_prediction.py    # FastAPI untuk forecasting (port 8001)
│   ├── combined_ai.py       # Gabungan kedua service (port 8000)
│   ├── requirements.txt
│   └── Dockerfile
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/     # Auth, transaksi, produk, dashboard
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Logika bisnis, AI client
│   │   └── middleware/      # Auth, upload, error handler
│   ├── prisma/              # Schema & migrations
│   ├── uploads/             # Temp audio files
│   ├── .env.example
│   └── package.json
├── frontend/                # React Vite
│   ├── src/
│   │   ├── components/      # UI reusabel
│   │   ├── pages/           # Login, Dashboard, Transaksi, Stok
│   │   ├── hooks/           # useAuth, useVoice, etc.
│   │   ├── context/         # AuthContext, ThemeContext
│   │   └── services/        # API calls
│   ├── .env.example
│   └── package.json
├── data-science/            # Notebooks & dataset info
├── PRODUCTS_LIST.md         # 121 produk yang dikenali voice
└── README.md
```

---

## ⚙️ Setup Cepat (5 Langkah)

### Prasyarat
- Node.js 18+, npm
- Python 3.10 – 3.12
- PostgreSQL
- ffmpeg (untuk voice service)

### Langkah-langkah

```bash
# 1. Clone repo
git clone https://github.com/username/finsense.git
cd finsense

# 2. Backend
cd backend
cp .env.example .env   # isi DATABASE_URL, JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run dev

# 3. Frontend (terminal baru)
cd frontend
cp .env.example .env
npm install
npm run dev

# 4. AI Service (terminal baru)
cd ai-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python combined_ai.py   # jalankan kedua AI dalam satu server

# 5. Buka browser
open http://localhost:5173
```

> **Catatan:** Pastikan PostgreSQL berjalan, dan sesuaikan `AI_SERVICE_URL` di backend `.env` menjadi `http://localhost:8000`.

---

## 🧪 Environment Variables

| File | Variabel | Contoh | Keterangan |
|------|----------|--------|-------------|
| `backend/.env` | `DATABASE_URL` | `postgresql://user:pass@localhost:5432/finsense` | Koneksi DB |
| | `JWT_SECRET` | `supersecretkey` | Secret untuk token |
| | `AI_SERVICE_URL` | `http://localhost:8000/voice/predict` | Endpoint voice |
| | `PREDICTION_SERVICE_URL` | `http://localhost:8000/predict/health` | Endpoint forecasting |
| `frontend/.env` | `VITE_API_URL` | `http://localhost:5000/api` | Backend API |
| | `VITE_VOICE_AI_URL` | `http://localhost:8000` | AI voice server |

---

## 🤖 Model AI & Link Download

Model tidak disertakan di repo (ukuran besar). Unduh dari tautan berikut:

### 1. Voice Model (Produk)
- **Folder:** `model_v10/` (TF SavedModel + artifacts.json)
- **Link:** [Google Drive - Voice Model v10](https://drive.google.com/your-link-here)
- **Penempatan:** Ekstrak ke `ai-service/model_v10/`

### 2. Forecasting Models
- **File:** `model_prediksi.keras`, `model_product.keras`, `model_stock.keras`, `scaler_prediksi.pkl`
- **Link:** [Google Drive - Forecasting Models](https://drive.google.com/your-link-here)
- **Penempatan:** Letakkan di `ai-service/`

> Jika model tidak tersedia, backend tetap berjalan tanpa fitur AI (fallback ke logika sederhana).

---

## 📬 API Endpoints (Contoh)

| Method | Endpoint | Deskripsi |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrasi user |
| POST | `/api/auth/login` | Login → JWT |
| GET | `/api/transactions` | Ambil transaksi user |
| POST | `/api/transactions` | Tambah transaksi (manual) |
| POST | `/api/voice/process` | Upload audio → voice AI |
| GET | `/api/predictions/revenue` | Dapatkan prediksi pemasukan |
| GET | `/api/stats/dashboard` | Statistik untuk dashboard |

> Dokumentasi lengkap (Swagger) tersedia di `http://localhost:5000/api-docs` saat backend running.

---

## 🧪 Testing

```bash
# Backend unit tests (Jest)
cd backend
npm test

# Frontend (Vitest)
cd frontend
npm test

# AI Service (pytest)
cd ai-service
pytest tests/
```

---

## 🗺️ Roadmap (Fitur Mendatang)

- [ ] Integrasi pembayaran digital (QRIS)
- [ ] Export laporan ke PDF dengan template kustom
- [ ] Notifikasi realtime (WebSocket) untuk stok menipis
- [ ] Aplikasi mobile (React Native)
- [ ] Multi-bisnis (satu akun bisa kelola beberapa toko)

---

## 👥 Tim Pengembang

<div align="center">
<table>
  <tr>
    <td align="center"><b>Ibrahim Irfanul Haq</b><br/>AI Engineer</td>
    <td align="center"><b>Rafi Azhar Suadmaja</b><br/>AI Engineer</td>
    <td align="center"><b>Alifah Mu’asyaroh</b><br/>Data Scientist</td>
  </tr>
  <tr>
    <td align="center"><b>Alviyatur Rahmaniyah</b><br/>Data Scientist</td>
    <td align="center"><b>Hafizh Kusuma Abdillah</b><br/>Full-Stack Developer</td>
    <td align="center"><b>Rifki Ardiansah</b><br/>Full-Stack Developer</td>
  </tr>
</table>
</div>

---

## 📄 Lisensi

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🙏 Apresiasi

- **Coding Camp 2026** oleh DBS Foundation
- Mentor dan tim penguji yang membimbing
- Semua kontributor open-source yang library-nya kami gunakan

---

<div align="center">
  <sub>Built with ☕ and 🧠 by Team CC26-PSU282</sub>
  <br/>
  <sub>🌐 <a href="https://finsense-project.vercel.app">Live Demo</a> | 📧 finsense@support.com</sub>
</div>
```
