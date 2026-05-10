import React from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../images/logo.png';
import hero from '../../images/herosection.png';
import dashboard from '../../images/dashboard.png';
import stock from '../../images/stock.png';
import cashier from '../../images/cashier.png';
import debt from '../../images/debt.png';
import log from '../../images/log.png';
import aicashier from '../../images/aicashier.png';
import chat from '../../images/chat.png';

function MainPage() {
  const navigate = useNavigate();

  function login() {
    navigate('/login');
  }

  function register(){
    navigate('/register');
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Navbar */}
      {/* Name */}
      <div className="relative item-stretch flex text-white h-16 shadow-lg bg-sky-950 sticky top-0">
        <div className="mx-8 font-sans font-bold text-2xl flex items-center gap-2">
          <img src={logo} alt="logo" className="h-8"/>
          <h1>Fin<span className="text-orange-300">Sense</span></h1>
        </div>

        {/* Section */}
        <div className="absolute left-1/2 -translate-x-1/2 flex justify-center item-stretch absolute top-0 right-6 h-16 font-sans">
          <button
            onClick={()=> scrollToSection('produk')}
            className="mx-8 underline underline-offset-8 hover:scale-105 transition-all duration-200">
            Produk
          </button>

          <button
            onClick={()=> scrollToSection('fitur')}
            className="mx-8 underline underline-offset-8 hover:scale-105 transition-all duration-200">
            Fitur
          </button>

          <button
            onClick={()=> scrollToSection('wawasan')}
            className="mx-8 underline underline-offset-8 hover:scale-105 transition-all duration-200">Wawasan AI
          </button>
        </div>

        {/* Login Register */}
        <div className="flex items-stretch absolute top-0 right-0 h-16 font-sans font-bold">
          <button className="mx-6 mt-2 mt-4 mb-3 hover:scale-105 transition-all duration-200" onClick={login}>Masuk</button>
          <button className="mx-6 px-4 mt-4 mb-3 hover:scale-105 transition-all duration-200" onClick={register}>Daftar Sekarang</button>
        </div>
      </div>

      {/* Product */}
      <div id="produk" className="bg-gray-200 py-16 px-16 flex items-center gap-8">

        {/* Text */}
        <div className="flex-1 flex flex-col items-start gap-4">
          <div className="flex justify-center text-sky-950 font-bold text-3xl text-left">
            <h1>Cerdas untuk Pertumbuhan UMKM Anda</h1>
          </div>

          <div className="mt-2 flex justify-center font-bold text-lg text-left text-gray-800">
            <p>
              Kendalikan bisnis ritel Anda dengan wawasan berbasis AI, manajemen inventaris yang mulus, dan pelacakan keuangan otomatis dalam satu platform cerdas.
            </p>
          </div>

          <button className="bg-sky-950 text-white rounded-lg py-2 px-4 hover:scale-105 transition-all duration-200 font-sans font-bold">Start now</button>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center">
          <img className="w-3/4 max-w-lg rounded-xl shadow-2xl" src={hero} />
        </div>
      </div>

      {/* Linebreak */}
      <div className="bg-gray-200">
        <hr className="border-t border-gray-300 mx-32" />
      </div>

      {/* Features */}
      <div id="fitur" className="bg-gray-200 grid grid-cols-5 gap-6 py-16 px-16">

        {/* Main Dashboard */}
        <div className="bg-white py-8 px-6 rounded-xl shadow-lg">
          <h1 className="font-sans font-bold text-sky-950 mb-3 text-lg">Dasbor Utama</h1>
          <img src={dashboard} alt="Dashboard" className="h-40 w-full mb-4 object-contain"/>
          <hr className="border-t border-gray-300 mb-4"/>
          <p className="text-bold">
            Pantau kesehatan bisnis Anda secara instan. Monitor total penjualan, tren pendapatan, dan metrik operasional harian dalam satu layar terpusat.
          </p>
        </div>

        {/* Stock Management */}
        <div className="bg-white py-8 px-6 rounded-xl shadow-lg">
          <h1 className="font-sans font-bold text-sky-950 mb-3 text-lg">Stok Barang</h1>
          <img src={stock} alt="Dashboard" className="h-40 w-full mb-4 object-contain"/>
          <hr className="border-t border-gray-300 mb-4"/>
          <p className="text-bold">
            Jangan biarkan produk terlaris Anda habis. Pantau level inventaris secara real-time, dapatkan peringatan stok rendah, dan kelola rantai pasok dengan mudah.
          </p>
        </div>

        {/* Automated Cashier */}
        <div className="bg-white py-8 px-6 rounded-xl shadow-lg">
          <h1 className="font-sans font-bold text-sky-950 mb-3 text-lg">Kasir Otomatis</h1>
          <img src={cashier} alt="Dashboard" className="h-40 w-full mb-4 object-contain"/>
          <hr className="border-t border-gray-300 mb-4"/>
          <p className="text-bold">
            Percepat proses pembayaran dengan sistem kasir pintar. Proses transaksi dengan akurat, kurangi kesalahan manusia, dan layani pelanggan lebih cepat.
          </p>
        </div>

        {/* Debt Management */}
        <div className="bg-white py-8 px-6 rounded-xl shadow-lg">
          <h1 className="font-sans font-bold text-sky-950 mb-3 text-lg">Pantau Hutang</h1>
          <img src={debt} alt="Dashboard" className="h-40 w-full mb-4 object-contain"/>
          <hr className="border-t border-gray-300 mb-4"/>
          <p className="text-bold">
            Kendalikan arus kas Anda sepenuhnya. Lacak faktur yang belum dibayar secara otomatis dan pantau saldo piutang pelanggan dengan mudah.
          </p>
        </div>

        {/* Inventory Logs */}
        <div className="bg-white py-8 px-6 rounded-xl shadow-lg">
          <h1 className="font-sans font-bold text-sky-950 mb-3 text-lg">Log Inventaris</h1>
          <img src={log} alt="Dashboard" className="h-40 w-full mb-4 object-contain"/>
          <hr className="border-t border-gray-300 mb-4"/>
          <p className="text-bold">
            Jaga transparansi gudang Anda. Lacak setiap barang yang masuk dan keluar dengan catatan historis mendetail untuk audit yang akurat.
          </p>
        </div>

      </div>

      {/* Linebreak */}
      <div className="bg-gray-200">
        <hr className="border-t border-gray-300 mx-32" />
      </div>

      {/* AI Insights */}
      {/* 1 */}
      <div id="wawasan" className="bg-gray-200 flex item-center justify-between">

        {/* Text */}
        <div className="=1/2 py-16 px-16 mt-4">
          <h1 className="text-3xl font-bold text-sky-950">Operasional Lebih Cerdas <br></br>menggunakan Dukungan AI Suara</h1>
          <p className="text-gray-800 font-bold mt-4 text-lg">
            Percepat alur kerja Anda dengan Kasir Pengenal Suara tanpa sentuhan. Cukup bicara pada terminal Anda untuk menambah barang, cek harga, atau cetak struk seketika. Serasa memiliki asisten tambahan di meja kasir.
          </p>
        </div>

        {/* Image */}
        <div className="w-1/2 flex justify-center">
          <div className="relative">
            <img
              src={aicashier}
              alt="AI Cashier Terminal"
              className="w-full max-w-lg h-auto rounded-2xl shadow-2xl object-cover border-4 border-white mt-6 mb-6"
            />
          </div>
        </div>
      </div>

      {/* 2 */}
      <div className="bg-gray-200 flex item-center justify-between">

        {/* Image */}
        <div className="w-1/2 flex justify-center">
          <div className="relative">
            <img
              src={chat}
              alt="AI Cashier Terminal"
              className="w-full max-w-lg h-auto rounded-2xl shadow-2xl object-cover border-4 border-white mt-6 mb-6"
            />
          </div>
        </div>

        {/* Text */}
        <div className="=1/2 py-16 px-16 mt-4">
          <h1 className="text-3xl font-bold text-sky-950">Chat Dukungan AI Cerdas 24/7</h1>
          <p className="text-gray-800 font-bold mt-4 text-lg">
            Jangan pernah merasa bingung dengan data Anda lagi. Dukungan AI Live kami terintegrasi langsung ke dasbor Anda, siap menjawab pertanyaan bisnis yang kompleks, memberikan solusi masalah secara real-time, dan saran strategis kapan pun Anda butuhkan.
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="bg-sky-950 text-white py-6 px-6">
        <div className="justify-items-center font-bold">
          <h1>Coding Camp 2026 Capstone Project &copy;</h1>
        </div>
      </div>
    </div>
  );
}

export default MainPage;