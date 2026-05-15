import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../../../services/productService';
import { useCart } from '../../../hooks/useCart';
import { FaMicrophone, FaSearch } from 'react-icons/fa';

function InputPos() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const { addItem } = useCart();

  // Pake useRef agar instance recognition tidak hilang saat render ulang
  const recognitionRef = useRef(null);
  const isStartingRef = useRef(false);

  // Inisialisasi Speech Recognition SEKALI saja saat component mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        isStartingRef.current = false;
      };

      recognition.onresult = (event) => {
        if (event.results && event.results[0]) {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          handleVoiceAction(transcript.toLowerCase());
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isStartingRef.current = false;
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        isStartingRef.current = false;
      };

      recognitionRef.current = recognition;
    }

    // Cleanup: stop recognition saat component unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Browser tidak mendukung speech recognition.');
      return;
    }

    // Cegah multiple start calls (debounce)
    if (isStartingRef.current) {
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      isStartingRef.current = false;
    } else {
      try {
        isStartingRef.current = true;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        isStartingRef.current = false;
        setIsListening(false);
      }
    }
  };

  const handleVoiceAction = (text) => {
    // Fix: tambahkan return statement di callback
    const foundProduct = products.find((p) =>
      text.includes(p.name.toLowerCase())
    );

    if (foundProduct) {
      addItem({
        id: foundProduct.id,
        name: foundProduct.name,
        price: foundProduct.price || 0,
        qty: 1,
      });
      setQuery('');
    }
  };

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

  const handleAdd = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      qty: 1,
    });
    setQuery('');
    setFiltered([]);
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

        {/* Search bar */}
        <FaSearch className='absolute right-3 top-4 text-gray-400' />

        {filtered.length > 0 && (
          <ul className='absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto'>
            {filtered.map((p) => (
              <li
                key={p.id}
                onClick={() => handleAdd(p)}
                className='p-2 hover:bg-gray-100 cursor-pointer flex justify-between'
              >
                <span>{p.name}</span>
                <span>Rp {p.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Button mikrofon */}
      <button
        onClick={toggleListening}
        className={`flex p-5 border rounded-xl transition-all ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-sky-950 text-white hover:bg-white hover:text-sky-950'
        }`}
      >
        <FaMicrophone size={28} />
      </button>

      <p className={`text-sm transition-all ${isListening ? 'text-sky-950' : 'text-gray-400'}`}>
        {isListening ? 'Mendengarkan...' : 'Tekan mikrofon untuk perintah suara'}
      </p>
    </div>
  );
}

export default InputPos;
