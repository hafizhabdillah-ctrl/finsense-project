import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../hooks/useCart';
import { FaMicrophone, FaStop, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import { convertToWav } from '../../../utils/audioUtils';

function InputPos() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const { addItem } = useCart();

  // Fetch produk
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

  // Filter untuk autocomplete
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

  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (audioChunksRef.current.length === 0) {
          Swal.fire('Info', 'Tidak ada suara yang direkam', 'info');
          setIsRecording(false);
          return;
        }
        const originalBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        const wavBlob = await convertToWav(originalBlob);
        await sendAudioToBackend(wavBlob);
        setIsRecording(false);
      };
      mediaRecorder.start();
      setIsRecording(true);
      // Auto-stop after 5 detik
      setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === 'recording'
        ) {
          mediaRecorderRef.current.stop();
        }
      }, 5000);
    } catch (err) {
      console.error(err);
      Swal.fire(
        'Error',
        'Tidak dapat mengakses mikrofon. Pastikan izin diberikan.',
        'error',
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const sendAudioToBackend = async (blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio', blob, 'recording.wav');
    try {
      const response = await api.post('/voice', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });
      const { jumlah, harga, matchedProduct, produk_conf, produk } =
        response.data;
      if (matchedProduct) {
        const result = await Swal.fire({
          title: 'Tambahkan ke Keranjang?',
          html: `
            <strong>Produk:</strong> ${matchedProduct.name}<br/>
            <strong>Jumlah:</strong> ${jumlah}<br/>
            <strong>Harga perkiraan:</strong> Rp ${harga.toLocaleString()}<br/>
            <small>Akurasi: ${((produk_conf || 0) * 100).toFixed(1)}%</small>
          `,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
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
          Swal.fire('Berhasil!', 'Produk ditambahkan ke keranjang', 'success');
        }
      } else {
        Swal.fire({
          title: 'Hasil Deteksi Suara',
          html: `Produk terdeteksi: <strong>${produk || 'Tidak diketahui'}</strong><br/>Jumlah: ${jumlah}<br/>Perkiraan harga: Rp ${harga.toLocaleString()}`,
          icon: 'info',
          confirmButtonText: 'OK',
        });
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
                <span>Rp {p.price?.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`flex p-5 border rounded-xl transition-all ${
          isProcessing
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-sky-950 text-white hover:bg-white hover:text-sky-950'
        }`}
      >
        {isProcessing ? (
          <svg
            className='animate-spin h-8 w-8 text-white'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            ></circle>
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            ></path>
          </svg>
        ) : isRecording ? (
          <FaStop size={28} />
        ) : (
          <FaMicrophone size={28} />
        )}
      </button>
      <p className='text-sm text-gray-400'>
        {isProcessing
          ? 'Memproses...'
          : isRecording
            ? 'Merekam... (klik lagi untuk berhenti)'
            : 'Tekan mikrofon untuk perintah suara'}
      </p>
    </div>
  );
}

export default InputPos;
