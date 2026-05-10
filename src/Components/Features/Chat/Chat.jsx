import React, { useState, useRef, useEffect } from 'react';
import { initialMessages } from '../../../utils/local/chat';

import { IoMdSend } from 'react-icons/io';
import { IoClose, IoChatboxEllipsesOutline  } from 'react-icons/io5';

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');

  // Referensi untuk auto-scroll ke pesan terbaru
  const messagesEndRef = useRef(null);

  // Fungsi untuk membuka/menutup chat
  const toggleChat = () => setIsOpen(!isOpen);

  // Efek untuk scroll otomatis ke bawah setiap kali array 'messages' berubah
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Fungsi saat tombol kirim ditekan
  const onSendEventHandler = () => {
    if (inputValue.trim() === '') return;

    // Tambahkan pesan user ke state
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue(''); // Kosongkan input form

    // Simulasi balasan otomatis AI (jeda 1 detik)
    setTimeout(() => {
      const mockAiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Fiturnya belum jadi woy',
      };
      setMessages((prev) => [...prev, mockAiResponse]);
    }, 1000);
  };

  // Fungsi mendeteksi tombol "Enter" di keyboard
  const onEnterButtonHandler = (e) => {
    if (e.key === 'Enter') {
      onSendEventHandler();
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-80 border border-gray-300 rounded-lg flex flex-col overflow-hidden font-sans transition-all duration-300">

          {/* Header */}
          <div className="bg-sky-950 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide">🤖 FinSense AI Support</span>
            </div>

            {/* Button tutup chat */}
            <button
              onClick={toggleChat}
              className="text-gray-300 hover:text-white transition-colors focus:outline-none"
            >
              <IoClose size={26} />
            </button>
          </div>

          {/* Area Pesan */}
          <div className="h-72 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4 text-sm">
            {messages.map((n) => (
              <div
                key={n.id}
                className={`p-3 max-w-[85%] shadow-sm ${
                  n.sender === 'user'
                    ? 'self-end bg-sky-950 text-white rounded-tl-xl rounded-bl-xl rounded-br-xl'
                    : 'self-start bg-gray-200 text-sky-950 rounded-tr-xl rounded-br-xl rounded-bl-xl'
                }`}
              >
                {/* Menggunakan dangerouslySetInnerHTML jika balasan mengandung tag HTML seperti <strong> */}
                <span dangerouslySetInnerHTML={{ __html: n.text }}></span>
              </div>
            ))}
          </div>

          {/* Area Input Box */}
          <div className="p-3 bg-white border-t border-gray-400 flex gap-2 items-center">
            {/* input prompt */}
            <input
              type="text"
              value={inputValue}
              onChange={(n) => setInputValue(n.target.value)}
              onKeyDown={onEnterButtonHandler}
              placeholder="Ketik pesan..."
              className="flex-1 px-3 py-2 bg-gray-100 border-transparent rounded-md focus:outline-none focus:ring-1 focus:ring-sky-950 focus:bg-white text-sm transition-all"
            />

            {/* send button */}
            <button
              onClick={onSendEventHandler}
              className="bg-sky-950 text-white p-3 rounded-md hover:bg-sky-800 transition-colors focus:outline-none"
            >
              <IoMdSend />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-xl transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90 scale-90' : 'text-white bg-sky-950 hover:bg-sky-800 hover:-translate-y-1'
        }`}
      >
        {isOpen ? <IoClose size={22} /> : <IoChatboxEllipsesOutline size={22} />}
      </button>
    </div>
  );
}

export default Chat;