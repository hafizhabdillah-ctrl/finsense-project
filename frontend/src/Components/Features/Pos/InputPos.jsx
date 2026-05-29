import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../hooks/useCart';
import { FaMicrophone, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../../../services/api';
import RecordRTC from 'recordrtc';

function InputPos() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
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

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav', // langsung rekam sebagai WAV
        sampleRate: 16000, // sample rate yang diharapkan model
        numberOfAudioChannels: 1, // mono
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
        timeSlice: 1000, // opsional: potongan per detik (tidak wajib)
        ondataavailable: (blob) => {
          // tidak perlu, karena kita stop manual
        },
      });

      recorderRef.current = recorder;
      recorder.startRecording();
      setIsListening(true);

      // Hentikan rekaman setelah 5 detik (bisa disesuaikan)
      setTimeout(() => {
        if (recorder && recorder.state === 'recording') {
          recorder.stopRecording(() => {
            const audioBlob = recorder.getBlob();
            sendAudioToBackend(audioBlob);
            // Matikan stream
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((track) => track.stop());
              streamRef.current = null;
            }
            setIsListening(false);
          });
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

  const stopListening = () => {
    if (recorderRef.current && recorderRef.current.state === 'recording') {
      recorderRef.current.stopRecording(() => {
        const audioBlob = recorderRef.current.getBlob();
        sendAudioToBackend(audioBlob);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setIsListening(false);
      });
    } else {
      setIsListening(false);
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    if (!audioBlob || audioBlob.size === 0) {
      Swal.fire('Info', 'Tidak ada suara yang direkam', 'info');
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    // Kirim file dengan nama 'audio' seperti yang diharapkan backend
    formData.append('audio', audioBlob, 'recording.wav');
    // Kirim transcript kosong (backend tetap bisa memproses audio)
    formData.append('transcript', '');
    // Kirim jumlah default (bisa diabaikan jika backend mendeteksi dari audio)
    formData.append('jumlah', '1');

    try {
      const res = await api.post('/voice', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      const {
        produk,
        jumlah: qty,
        harga,
        produk_conf,
        matchedProduct,
      } = res.data;

      if (matchedProduct) {
        const result = await Swal.fire({
          title: 'Tambahkan ke Keranjang?',
          html: `
            <strong>Produk:</strong> ${produk}<br/>
            <strong>Jumlah:</strong> ${qty}<br/>
            <small>Akurasi: ${(produk_conf * 100).toFixed(1)}%</small>
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
            qty: qty,
          });
          await Swal.fire(
            'Berhasil!',
            'Produk ditambahkan ke keranjang',
            'success',
          );
          window.location.reload();
        }
      } else {
        let top3Text = '';
        if (res.data.produk_top3 && res.data.produk_top3.length) {
          top3Text = '<br/><br/><strong>Alternatif teratas:</strong><ul>';
          for (let [name, conf] of res.data.produk_top3) {
            top3Text += `<li>${name} (${(conf * 100).toFixed(1)}%)</li>`;
          }
          top3Text += '</ul>';
        }
        await Swal.fire({
          title: 'Hasil Deteksi Suara',
          html: `
            Produk terdeteksi: <strong>${produk}</strong><br/>
            Jumlah: ${qty}<br/>
            Perkiraan harga: Rp ${harga.toLocaleString()}${top3Text}
          `,
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
      {/* Input pencarian */}
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

      <button
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
        className={`flex p-5 border rounded-xl transition-all ${
          isProcessing
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-sky-950 text-white hover:bg-white hover:text-sky-950'
        }`}
      >
        <FaMicrophone size={28} />
      </button>

      <p className='text-sm text-gray-400'>
        {isProcessing
          ? 'Memproses suara...'
          : isListening
            ? 'Mendengarkan... (klik lagi untuk berhenti)'
            : 'Tekan mikrofon untuk perintah suara (maks 5 detik)'}
      </p>
      <p className='text-sm text-gray-400'>
        Contoh: "Jual Mie Goreng 3 bungkus"
      </p>
    </div>
  );
}

export default InputPos;
