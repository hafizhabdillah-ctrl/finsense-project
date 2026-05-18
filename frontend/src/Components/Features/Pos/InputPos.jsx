import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../hooks/useCart';
import { FaMicrophone, FaSearch } from 'react-icons/fa';
import api from '../../../services/api';
import { convertToWav } from '../../../utils/audioUtils';
import Swal from 'sweetalert2';

function InputPos() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // tambahan loading state
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
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

  // Filter produk
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

  // Mulai rekam
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Gunakan format apa pun yang didukung (browser akan memilih yang optimal)
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        // Buat blob asli dari rekaman (format asli browser, biasanya webm)
        const originalBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });
        await sendAudioToBackend(originalBlob);
        // Hentikan track microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Izinkan akses mikrofon untuk menggunakan voice.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isProcessing) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Kirim audio ke backend dengan konversi ke WAV
  // const sendAudioToBackend = async (blob) => {
  //   setIsProcessing(true);
  //   try {
  //     // Konversi audio ke WAV murni (PCM 16kHz mono)
  //     const wavBlob = await convertToWav(blob);

  //     const formData = new FormData();
  //     formData.append('audio', wavBlob, 'recording.wav');

  //     const res = await api.post('/voice', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //       timeout: 60000, // timeout 30 detik
  //     });

  //     const { jumlah, harga, matchedProduct, jumlah_confidence } = res.data;

  //     if (matchedProduct) {
  //       const confirm = window.confirm(
  //         `AI mendeteksi: ${jumlah} item - Rp ${harga.toLocaleString()}\nProduk terdekat: ${matchedProduct.name} (Rp ${matchedProduct.price.toLocaleString()})\nTambahkan ke keranjang?`,
  //       );
  //       if (confirm) {
  //         addItem({
  //           id: matchedProduct.id,
  //           name: matchedProduct.name,
  //           price: matchedProduct.price,
  //           qty: jumlah,
  //         });
  //         // 🔄 Reload halaman setelah menambah ke keranjang
  //         window.location.reload();
  //       }
  //     } else {
  //       alert(
  //         `Hasil deteksi: ${jumlah} item, harga perkiraan Rp ${harga.toLocaleString()}. Tidak ada produk yang cocok.`,
  //       );
  //     }
  //   } catch (err) {
  //     console.error('Voice API error:', err);
  //     let errorMsg = 'Gagal memproses suara. ';
  //     if (err.response?.data?.detail) {
  //       errorMsg += `Detail: ${err.response.data.detail}`;
  //     } else if (err.message) {
  //       errorMsg += err.message;
  //     }
  //     alert(errorMsg);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };
  // Kirim audio ke backend dengan konversi ke WAV
  const sendAudioToBackend = async (blob) => {
    setIsProcessing(true);
    try {
      const wavBlob = await convertToWav(blob);
      const formData = new FormData();
      formData.append('audio', wavBlob, 'recording.wav');

      const res = await api.post('/voice', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      const { jumlah, harga, matchedProduct, jumlah_confidence } = res.data;

      if (matchedProduct) {
        // Konfirmasi dengan SweetAlert
        const result = await Swal.fire({
          title: 'Tambahkan ke Keranjang?',
          html: `AI mendeteksi: <strong>${jumlah} item</strong><br/>Perkiraan harga: <strong>Rp ${harga.toLocaleString()}</strong><br/><br/>Produk terdekat:<br/>${matchedProduct.name} (Rp ${matchedProduct.price.toLocaleString()})`,
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

          // Tampilkan notifikasi sukses lalu reload halaman
          await Swal.fire({
            title: 'Berhasil!',
            text: 'Produk ditambahkan ke keranjang. Halaman akan dimuat ulang.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });
          window.location.reload();
        }
      } else {
        // Tidak ada produk yang cocok
        await Swal.fire({
          title: 'Hasil Deteksi Suara',
          html: `Jumlah: <strong>${jumlah} item</strong><br/>Perkiraan harga: <strong>Rp ${harga.toLocaleString()}</strong><br/><br/>Tidak ada produk yang cocok.`,
          icon: 'info',
          confirmButtonText: 'OK',
        });
      }
    } catch (err) {
      console.error('Voice API error:', err);
      let errorMsg = 'Gagal memproses suara. ';
      if (err.response?.data?.detail) {
        errorMsg += `Detail: ${err.response.data.detail}`;
      } else if (err.message) {
        errorMsg += err.message;
      }
      await Swal.fire({
        title: 'Error',
        text: errorMsg,
        icon: 'error',
        confirmButtonText: 'Tutup',
      });
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
                <span>Rp {p.price.toLocaleString()}</span>
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
        <FaMicrophone size={28} />
      </button>
      <p
        className={`text-sm transition-all ${isRecording ? 'text-sky-950' : 'text-gray-400'}`}
      >
        {isProcessing
          ? 'Memproses suara...'
          : isRecording
            ? 'Merekam... (klik lagi untuk berhenti)'
            : 'Tekan mikrofon untuk perintah suara'}
      </p>
    </div>
  );
}

export default InputPos;
