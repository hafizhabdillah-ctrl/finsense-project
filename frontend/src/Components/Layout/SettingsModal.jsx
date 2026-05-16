import React, { useState, useContext } from 'react';
import { IoClose } from 'react-icons/io5';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

/* eslint-disable camelcase */

function SettingsModal({ isOpen, onClose }) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // User Profile Form State
  const [userForm, setUserForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });

  // UMKM Profile Form State
  const [umkmForm, setUmkmForm] = useState({
    business_name: user?.umkm_profile?.business_name || '',
    business_type: user?.umkm_profile?.business_type || '',
    province: user?.umkm_profile?.province || '',
    city: user?.umkm_profile?.city || '',
    monthly_revenue_est: user?.umkm_profile?.monthly_revenue_est || '',
  });

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUmkmFormChange = (e) => {
    const { name, value } = e.target;
    setUmkmForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
  };

  const handleUmkmSubmit = async (e) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'profile'
                ? 'text-sky-950'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Profil User
          </button>
          <button
            onClick={() => setActiveTab('umkm')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'umkm'
                ? 'text-sky-950'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Profil UMKM
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Profile User Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUserSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={userForm.full_name}
                    onChange={handleUserFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userForm.email}
                    onChange={handleUserFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                    placeholder="Masukkan email"
                    required
                  />
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-sky-950 text-white rounded-lg hover:bg-sky-900 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Profile UMKM Tab */}
          {activeTab === 'umkm' && (
            <form onSubmit={handleUmkmSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Bisnis
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={umkmForm.business_name}
                    onChange={handleUmkmFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                    placeholder="Masukkan nama bisnis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Bisnis
                  </label>
                  <input
                    type="text"
                    name="business_type"
                    value={umkmForm.business_type}
                    onChange={handleUmkmFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                    placeholder="Masukan jenis"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provinsi
                    </label>
                    <input
                      type="text"
                      name="province"
                      value={umkmForm.province}
                      onChange={handleUmkmFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                      placeholder="Masukkan provinsi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kota
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={umkmForm.city}
                      onChange={handleUmkmFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                      placeholder="Masukkan kota"
                    />
                  </div>
                </div>

                <div className="gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimasi Pendapatan Bulanan
                    </label>
                    <input
                      type="number"
                      name="monthly_revenue_est"
                      value={umkmForm.monthly_revenue_est}
                      onChange={handleUmkmFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none transition"
                      placeholder="Masukkan jumlah"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-sky-950 text-white rounded-lg hover:bg-sky-900 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
