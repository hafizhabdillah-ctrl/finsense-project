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
| 🗣️ **AI Speech** | Konversi suara ke transaksi (*mendukung 121 produk*) |

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

```markdown
## 🗣️ Batasan Voice Recognition

Model AI speech-to-intent pada FinSense saat ini **hanya mendukung 121 produk** yang sudah dilatih. Produk di luar daftar **tidak akan terdeteksi** oleh sistem suara.

📋 **Daftar produk yang dikenali (121 item):**  
*Klik untuk melihat selengkapnya* (atau tampilkan cuplikan):

<details>
<summary>Lihat 10 contoh produk</summary>

- abc kecap asin 620ml
- abc kecap manis 620ml
- acnes obat jerawat
- aqua 600ml
- beras maknyuss 5kg
- bimoli minyak goreng 2L
- coca cola 1L
- indomie goreng
- make over lipmatte
- milo 1kg
- ... dan 111 produk lainnya (total 121)
</details>

> 📌 **Catatan:** Untuk produk yang tidak ada dalam daftar, silakan gunakan **input manual** atau **pencarian teks** pada halaman POS Terminal. Tim pengembang akan terus menambah dataset produk pada versi berikutnya.
```

Atau Anda bisa menambahkan langsung sebagai bullet point di fitur AI Speech:

```markdown
- 🗣️ **AI Speech** – Konversi suara ke transaksi (hanya mendukung **121 produk** yang sudah dilatih, lihat daftar lengkap di [tautan ini] atau di bagian bawah README).
```

Jika ingin lebih rapi, buat file terpisah `PRODUCTS_LIST.md` lalu tautkan. Tapi karena README harus mandiri, gunakan collapsible section seperti di atas.

---

## ✅ UPDATE README LENGKAP (dengan bagian batasan)

Anda bisa mengganti bagian **Fitur Utama** atau menambahkan setelah **AI Speech**. Saya tulis ulang cuplikan README yang relevan:

```markdown
## ✨ Fitur Utama

| Modul | Fitur |
|-------|-------|
| 🔐 **Autentikasi** | Login, Register, Lupa password (via email) |
| 📝 **Transaksi** | Tambah manual & input suara (voice-to-intent) |
| 📊 **Dashboard** | Grafik pemasukan, pengeluaran, saldo, top produk |
| 🤖 **Prediksi** | Forecasting pemasukan harian dengan model time-series |
| 🧠 **Rekomendasi** | Restok stok otomatis & produk terlaris |
| 🗣️ **AI Speech** | Konversi suara ke transaksi (*mendukung 121 produk*) |

> ℹ️ **Batasan Voice Recognition:** Model speech-to-intent hanya mengenali **121 produk** yang sudah dilatih. Produk di luar daftar tidak akan terdeteksi. Silakan gunakan input manual untuk produk lain.
```

Kemudian di bagian bawah README (sebelum Lisensi atau sesudah Kontak), tambahkan:

```markdown
## 📋 Daftar Produk yang Didukung Voice (121 item)

<details>
<summary>Klik untuk melihat daftar lengkap</summary>

```
abc kecap asin enam ratus dua puluh mililiter
abc kecap manis enam ratus dua puluh mililiter
abc sari kacang hijau dua ratus lima puluh mililiter
acnes obat jerawat
antimo obat anti mabuk
aqua enam ratus mililiter
bango kecap manis seratus delapan puluh sembilan gram
baygon obat nyamuk bakar
beras maknyuss lima kilogram
beras ramos super lima kilogram
beras rojolele lima kilogram
beras sania lima kilogram
betadine obat luka lima gram
bimoli minyak goreng dua liter
buavita dua ratus lima puluh mililiter
clas mild
coca cola satu liter
cotton bud
dettol body wash dua ratus mililiter
diapet
downy pewangi lima ratus lima puluh mililiter
dua kelinci kacang
enervon c vitamin
esse change
evangeline parfume seratus mililiter
fanta satu liter
floridina tiga ratus lima puluh mililiter
formula sikat gigi
forvita margarin dua ratus lima puluh gram
frisian flag susu kental manis
gaga seratus habanero
gaga seratus jalapeno
gaga seratus lada hitam
gajah kopi tubruk
garam dapur
glad two glow moisturizer
gula pasir tiga kilogram
hadalabo face wash lima puluh gram
hanasui masker wajah
hatari malkist dua ratus enam puluh gram
hit magic obat nyamuk bakar
hs rokok filter
implora moisturizer
indofood saus tomat tiga ratus tiga puluh lima mililiter
indomie goreng
indomie rendang
indomie soto
indomilk uht cokelat satu liter
indomilk uht full cream satu liter
kaki tiga larutan lima ratus mililiter
kanzler singles sosis
kecap asin enam ratus dua puluh mililiter
kiranti pegel linu
kobe tepung roti dua ratus gram
koko crunch
konidin obh
kool fever
la ice
le minerale enam ratus mililiter
lifebuoy body wash
make over lipmatte
mama lemon sabun cuci piring
marlboro gold
masako
milo satu kilogram
monde butter cookies
nabati kaleng dua ratus delapan puluh tujuh gram
nabati wafer
neo coffee sachet pack
nescafe kitkat dua ratus dua puluh mililiter
omg lipcream
oreo sandwich roll seratus sembilan belas gram
pantene conditioner seratus lima puluh mililiter
pantene shampoo satu liter
pepsodent toothpaste
pocari sweat lima ratus mililiter
poci teh celup
pop mie tujuh puluh lima gram
prenagen tiga ratus enam puluh gram
prochiz slices keju cheddar
quacker oatmeal instan delapan ratus gram
rexona deodorant
roma kelapa tiga ratus gram
roma sari gandum seratus empat puluh sembilan gram
sampoerna mild enam belas
saori saus tiram dua ratus tujuh puluh mililiter
sari kue cheesecake
sari kue lapis surabaya
sari roti klasik kasur seratus delapan puluh lima gram
sari roti sisir seratus enam puluh lima gram
sari roti sobek tujuh puluh dua gram
sari roti tawar
sasa micin
sedaap ayam bawang
sedaap goreng
sedaap kari spesial
sedaap kecap manis lima ratus lima puluh mililiter
sedaap selection
sedaap singapore laksa
sedaap soto
segitiga biru tepung terigu satu kilogram
sgm soya vanila empat ratus gram
silverqueen milk chocolate
sleek detergen cair empat ratus lima puluh mililiter
so klin liquid tujuh ratus dua puluh mililiter
sprite satu liter
stella spray empat ratus mililiter
sweety silver pants
taro tiga puluh dua gram
teh kotak dua ratus mililiter
teh pucuk harum tiga ratus lima puluh mililiter
tejahe permen
telor ayam satu kilogram
tolak angin
tolak linu
top coffee sachet pack
tropicana slim
wafello wafer
wardah cushion
wipol tujuh ratus lima puluh mililiter
you c thousand seratus empat puluh mililiter
```
</details>

> 💡 **Harga produk** sudah tersedia dalam sistem sehingga saat voice dikenali, harga akan otomatis mengikuti harga jual yang tersimpan di database.
```


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

