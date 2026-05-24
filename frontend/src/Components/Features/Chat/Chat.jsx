import React, { useState, useRef, useEffect } from 'react';
import api from '../../../services/api'; // sesuaikan path ke file api.js
import { IoMdSend } from 'react-icons/io';
import { IoClose, IoChatboxEllipsesOutline } from 'react-icons/io5';

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [quickReplies, setQuickReplies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createNewSession = async () => {
    try {
      const response = await api.post('/chat/sessions', { session_title: 'Chat baru' });
      setSessionId(response.data.id);
      // Kirim pesan sapaan awal (opsional: bisa langsung tampilkan greeting)
      setMessages([
        {
          id: Date.now(),
          sender: 'ai',
          text: 'Halo! Saya asisten FinSense. Pilih topik yang ingin kamu tanyakan:',
        },
      ]);
      // Set quick replies untuk menu utama
      setQuickReplies([
        { id: 'tips', label: '💡 Tips Keuangan' },
        { id: 'laporan', label: '📊 Laporan' },
        { id: 'rekomendasi_usaha', label: '🚀 Rekomendasi Usaha' },
        { id: 'pajak_umkm', label: '📑 Pajak UMKM' }
      ]);
    } catch (error) {
      console.error('Gagal membuat session chat:', error);
    }
  };

  useEffect(() => {
    if (isOpen && !sessionId) {
      createNewSession();
    }
  }, [isOpen, sessionId]);

  const sendMessageToBackend = async (message) => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      const response = await api.post(`/chat/sessions/${sessionId}/messages`, { message });
      const assistantMsg = response.data.assistantMessage;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsg.id,
          sender: 'ai',
          text: assistantMsg.content,
        },
      ]);
      setQuickReplies(response.data.quickReplies || []);
    } catch (error) {
      console.error('Gagal mengirim pesan:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 999,
          sender: 'ai',
          text: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSendEventHandler = async () => {
    if (inputValue.trim() === '' || isLoading) return;
    const userMessageText = inputValue.trim();
    // Tambahkan pesan user ke UI
    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: userMessageText,
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setQuickReplies([]); // reset sementara
    await sendMessageToBackend(userMessageText);
  };

  const onEnterButtonHandler = (e) => {
    if (e.key === 'Enter') onSendEventHandler();
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div>
      {isOpen && (
        <div className="fixed bottom-24 right-8 w-80 border border-gray-300 rounded-lg flex flex-col overflow-hidden font-sans">
          {/* Header */}
          <div className="bg-sky-950 p-4 flex justify-between items-center text-white">
            <span className="font-bold text-sm tracking-wide">🤖 FinSense AI Support</span>
            <button onClick={toggleChat} className="text-gray-300 hover:text-white">
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
                <span dangerouslySetInnerHTML={{ __html: n.text }}></span>
              </div>
            ))}
            {isLoading && (
              <div className="self-start bg-gray-200 text-sky-950 p-3 rounded-xl">Mengetik...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {quickReplies.length > 0 && (
            <div className="px-3 pb-2 bg-white border-t border-gray-200 flex flex-wrap gap-2">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(reply.label);
                    onSendEventHandler();
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-sky-950 text-xs py-1.5 px-3 rounded-full"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-400 flex gap-2 items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={onEnterButtonHandler}
              placeholder="Ketik pesan..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-950"
            />
            <button
              onClick={onSendEventHandler}
              disabled={isLoading}
              className="bg-sky-950 text-white p-3 rounded-md hover:bg-sky-800"
            >
              <IoMdSend />
            </button>
          </div>
        </div>
      )}

      {/* Tombol floating */}
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