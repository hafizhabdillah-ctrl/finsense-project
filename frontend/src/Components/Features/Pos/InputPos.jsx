import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../hooks/useCart';
import { FaMicrophone, FaSearch, FaSyncAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const { addItem } = useCart();

  // Hook Speech Recognition
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

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
      setFiltered(products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())));
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

  const startListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      Swal.fire('Error', 'Browser tidak mendukung Speech Recognition', 'error');
      return;
    }

    // Reset
    resetTranscript();
    setAudioChunks([]);
    
    // Minta akses mic untuk MediaRecorder (rekam audio untuk model)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };
      
      mediaRecorder.start(1000); // rekam setiap 1 detik
      
      // Mulai Speech Recognition (transkrip)
      await SpeechRecognition.startListening({ language: 'id', continuous: false });
      
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Tidak dapat mengakses mikrofon', 'error');
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    // Ketika listening berhenti (baik selesai atau di-stop)
    if (!listening && transcript && !isProcessing) {
      processTransaction(transcript);
    } else if (!listening && !transcript && !isProcessing && audioChunks.length > 0) {
      // Fallback jika tidak ada transkrip
      Swal.fire('Info', 'Tidak ada ucapan yang terekam', 'info');
    }
  }, [listening, transcript]);

  const processTransaction = async (spokenText) => {
    setIsProcessing(true);
    const jumlah = parseJumlah(spokenText) || 1;
    
    // Gabungkan audio chunks menjadi blob
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    const extension = mimeType.includes('webm') ? 'webm' : 'mp4';
    
    const formData = new FormData();
    formData.append('audio', audioBlob, `recording.${extension}`);
    formData.append('transcript', spokenText);
    formData.append('jumlah', String(jumlah));
    
    try {
      const res = await api.post('/voice', formData, { timeout: 30000 });
      const { produk, jumlah: qty, harga, produk_conf, matchedProduct } = res.data;
      
      if (matchedProduct) {
        const result = await Swal.fire({
          title: 'Tambahkan ke Keranjang?',
          html: `<strong>Produk:</strong> ${produk}<br/><strong>Jumlah:</strong> ${qty}<br/><small>Akurasi: ${(produk_conf * 100).toFixed(1)}%</small>`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Ya, Tambahkan',
          cancelButtonText: 'Batal',
        });
        if (result.isConfirmed) {
          addItem({ id: matchedProduct.id, name: matchedProduct.name, price: matchedProduct.price, qty });
          await Swal.fire('Berhasil!', 'Produk ditambahkan ke keranjang', 'success');
          window.location.reload();
        }
      } else {
        let top3Text = '';
        if (res.data.produk_top3?.length) {
          top3Text = '<br/><br/><strong>Alternatif teratas:</strong><ul>';
          for (let [name, conf] of res.data.produk_top3) {
            top3Text += `<li>${name} (${(conf * 100).toFixed(1)}%)</li>`;
          }
          top3Text += '</ul>';
        }
        await Swal.fire({
          title: 'Hasil Deteksi Suara',
          html: `Produk terdeteksi: <strong>${produk}</strong><br/>Jumlah: ${qty}<br/>Perkiraan harga: Rp ${harga.toLocaleString()}${top3Text}`,
          icon: 'info',
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

  if (!browserSupportsSpeechRecognition) {
    return <div className="p-4 text-red-500">Browser tidak mendukung voice input. Silakan ketik produk.</div>;
  }

  return (
    <div className='flex flex-col items-center py-4 gap-4'>
      {/* Input pencarian (sama seperti sebelumnya) */}
      <div className='relative w-full max-w-md'>
        <input type='text' placeholder='Cari produk...' value={query} onChange={(e) => setQuery(e.target.value)} className='w-full p-3 border border-gray-300 rounded-lg' />
        <FaSearch className='absolute right-3 top-4 text-gray-400' />
        {filtered.length > 0 && (
          <ul className='absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto'>
            {filtered.map((p) => (
              <li key={p.id} onClick={() => handleAddProduct(p)} className='p-2 hover:bg-gray-100 cursor-pointer flex justify-between'>
                <span>{p.name}</span>
                <span>Rp {p.price.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={listening ? stopListening : startListening}
        disabled={isProcessing}
        className={`flex p-5 border rounded-xl transition-all ${
          isProcessing ? 'bg-gray-400 text-white cursor-not-allowed' :
          listening ? 'bg-white text-red-500 border-red-500' : 'bg-sky-950 text-white hover:bg-white hover:text-sky-950'
        }`}
      >
        {isProcessing ? <FaSyncAlt className='animate-spin' size={28} /> : <FaMicrophone size={28} />}
      </button>

      <p className='text-sm text-gray-400'>
        {isProcessing ? 'Memproses suara...' : listening ? 'Mendengarkan... (klik lagi untuk berhenti)' : 'Tekan mikrofon untuk perintah suara'}
      </p>
      <p className='text-sm text-gray-400'>Contoh: "Jual Mie Goreng 3 bungkus"</p>
    </div>
  );
}

export default InputPos;

export default InputPos;
