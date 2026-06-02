import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../hooks/useCart';
import { FaMicrophone, FaSearch, FaSyncAlt } from 'react-icons/fa'; // tambah FaSyncAlt
import Swal from 'sweetalert2';
import api from '../../../services/api';
import { convertToWav } from '../../../utils/audioUtils';

const QTY = {
  satu: 1,
  dua: 2,
  tiga: 3,
  empat: 4,
  lima: 5,
  enam: 6,
  tujuh: 7,
  delapan: 8,
  sembilan: 9,
  sepuluh: 10,
};
const STRONG_UNITS = new Set([
  'bungkus',
  'botol',
  'dus',
  'pcs',
  'pack',
  'renteng',
  'slop',
  'sak',
  'biji',
  'buah',
  'lusin',
  'pak',
  'karton',
  'box',
  'kaleng',
  'sachet',
  'tray',
  'ikat',
  'lembar',
  'batang',
  'butir',
]);
const WEAK_UNITS = new Set(['kilo', 'kilogram', 'kg', 'liter', 'gram', 'gr']);

function parseJumlah(transcript) {
  if (!transcript) return null;
  const words = transcript.toLowerCase().split(/\s+/);
  // 1. qty word + strong unit
  for (let i = 0; i < words.length; i++) {
    if (QTY[words[i]] && i + 1 < words.length && STRONG_UNITS.has(words[i + 1]))
      return QTY[words[i]];
  }
  // 2. digit + strong unit
  for (let i = 0; i < words.length; i++) {
    if (
      /^\d+$/.test(words[i]) &&
      i + 1 < words.length &&
      STRONG_UNITS.has(words[i + 1])
    ) {
      const v = parseInt(words[i]);
      if (v >= 1 && v <= 10) return v;
    }
  }
  // 3. qty word at end
  if (words.length && QTY[words[words.length - 1]])
    return QTY[words[words.length - 1]];
  // 4. last qty + weak unit
  let weak = null;
  for (let i = 0; i < words.length; i++) {
    if (QTY[words[i]] && i + 1 < words.length && WEAK_UNITS.has(words[i + 1]))
      weak = QTY[words[i]];
  }
  if (weak !== null) return weak;
  // 5. last qty not part of number phrase
  const skip = new Set([
    'ratus',
    'ribu',
    'puluh',
    'belas',
    'mililiter',
    'ml',
    ...WEAK_UNITS,
  ]);
  let cand = null;
  for (let i = 0; i < words.length; i++) {
    if (QTY[words[i]] && !skip.has(words[i + 1] || '')) cand = QTY[words[i]];
  }
  return cand;
}

function InputPos() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const transcriptRef = useRef('');
  const recognitionRef = useRef(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (query.length > 1) {
      setFiltered(
        products.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase()),
        ),
      );
    } else {
      setFiltered([]);
    }
  }, [query, products]);

  const handleAddProduct = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      qty: 1,
    });
    setQuery('');
    setFiltered([]);
  };

  const startListening = () => {
    setTranscript('');
    transcriptRef.current = '';

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Swal.fire('Error', 'Browser tidak mendukung Web Speech API', 'error');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      transcriptRef.current = text;
      setTranscript(text);
      recognition.stop(); // langsung stop setelah dapat hasil
    };

    recognition.onerror = (e) => {
      console.error('SpeechRecognition error:', e.error);
      if (e.error === 'not-allowed') {
        Swal.fire(
          'Izin ditolak',
          'Aktifkan izin mikrofon di pengaturan browser',
          'warning',
        );
      } else {
        Swal.fire('Error', 'Gagal menangkap suara. Coba lagi.', 'error');
      }
      recognition.stop();
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcriptRef.current) {
        processTransaction(transcriptRef.current);
      } else {
        Swal.fire('Info', 'Tidak ada ucapan yang terekam', 'info');
      }
    };

    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processTransaction = async (spokenText) => {
    setIsProcessing(true);
    // Parsing jumlah bisa dilakukan di frontend atau backend, kita kirim raw transcript
    try {
      const res = await api.post('/voice-transcript', {
        transcript: spokenText,
      });
      const {
        produk,
        jumlah,
        harga,
        produk_conf,
        matchedProduct,
        produk_top3,
      } = res.data;

      if (matchedProduct) {
        const result = await Swal.fire({
          title: 'Tambahkan ke Keranjang?',
          html: `<strong>Produk:</strong> ${produk}<br/><strong>Jumlah:</strong> ${jumlah}<br/><small>Akurasi: ${(produk_conf * 100).toFixed(1)}%</small>`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Ya, Tambahkan',
          cancelButtonText: 'Batal',
        });
        if (result.isConfirmed) {
          addItem({
            id: matchedProduct.id,
            name: matchedProduct.name,
            price: matchedProduct.price,
            qty: jumlah,
          });
          await Swal.fire(
            'Berhasil!',
            'Produk ditambahkan ke keranjang',
            'success',
          );
          window.location.reload();
        }
      } else {
        let top3Html = '';
        if (produk_top3 && produk_top3.length) {
          top3Html = '<br/><br/><strong>Alternatif teratas:</strong><ul>';
          for (let [name, conf] of produk_top3) {
            top3Html += `<li>${name} (${(conf * 100).toFixed(1)}%)</li>`;
          }
          top3Html += '</ul>';
        }
        await Swal.fire({
          title: 'Hasil Deteksi Suara',
          html: `Produk terdeteksi: <strong>${produk}</strong><br/>Jumlah: ${jumlah}<br/>Perkiraan harga: Rp ${harga.toLocaleString()}${top3Html}`,
          icon: 'info',
          confirmButtonText: 'OK',
        });
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Gagal memproses suara. Coba lagi.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='flex flex-col items-center py-4 gap-4'>
      {/* Input pencarian (sama seperti semula) */}
      <div className='relative w-full max-w-md'>
        <input
          type='text'
          placeholder='Cari produk...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-full p-3 border border-gray-300 rounded-lg'
        />
        <FaSearch className='absolute right-3 top-4 text-gray-400' />
        {filtered.length > 0 && (
          <ul className='absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto'>
            {filtered.map((p) => (
              <li
                key={p.id}
                onClick={() => handleAddProduct(p)}
                className='p-2 hover:bg-gray-100 cursor-pointer flex justify-between'
              >
                <span>{p.name}</span>
                <span>Rp {p.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tombol mikrofon */}
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
        className={`flex p-5 border rounded-xl transition-all ${
          isProcessing
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : isListening
              ? 'bg-white text-red-500 border-red-500'
              : 'bg-sky-950 text-white hover:bg-white hover:text-sky-950'
        }`}
      >
        {isProcessing ? (
          <FaSyncAlt className='animate-spin' size={28} />
        ) : (
          <FaMicrophone size={28} />
        )}
      </button>

      <p className='text-sm text-gray-400'>
        {isProcessing
          ? 'Memproses suara...'
          : isListening
            ? 'Mendengarkan... (klik lagi untuk berhenti)'
            : 'Tekan mikrofon untuk perintah suara'}
      </p>
      <p className='text-sm text-gray-400'>
        Contoh: "Jual Mie Goreng 3 bungkus"
      </p>
    </div>
  );
}

export default InputPos;
