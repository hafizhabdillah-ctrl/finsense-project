# Data Science

## Overview

Folder ini berisi seluruh proses *data science* pada project pencatatan transaksi retail berbasis suara *(voice input)*. Modul mencakup preprocessing data transaksi, exploratory data analysis (EDA), preprocessing audio, pembentukan transkrip, serta pelabelan NLP untuk mendukung sistem transaksi berbasis suara.

---

## Notebooks

| Notebook                         | Deskripsi                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `01_cleaning_transactions.ipynb` | Data preprocessing, transformation, stock simulation, dan dataset merging                      |
| `02_analysis_transactions.ipynb` | Exploratory Data Analysis (EDA) dan visualisasi transaksi                                      |
| `03_cleaning_audio.ipynb`        | Audio preprocessing (*mono conversion*, *resampling*, *normalization*, dan *silence trimming*) |
| `04_nlp_audio.ipynb`             | Pembentukan transkrip transaksi dan pelabelan NLP (*intent* dan *entity*)                      |

---

## Installation

Install dependency:

```bash
pip install -r requirements.txt
```

---

## Dataset Documentation

Detail dataset, preprocessing, definisi variabel, serta karakteristik data tersedia pada:

`data_dictionary.md`

---

## Dashboard

Dashboard Streamlit untuk visualisasi transaksi tersedia pada folder:

`dashboard/`

🔗 **Live Dashboard:** [Klik di sini untuk melihat dashboard](https://sales-dashboard-capstone.streamlit.app/)

Untuk menjalankan secara lokal, lihat dokumentasi di bagian “Run Dashboard Locally”.