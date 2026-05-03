import React from 'react';
import { Route, Routes } from 'react-router-dom';

import MainPage from './Pages/MainPage';
import LoginPage from './Pages/Auth/LoginPage';
import RegisterPage from './Pages/Auth/RegisterPage';
import MainLayout from './Components/Layout/MainLayout';

import DashboardPage from './Pages/Features/DashboardPage';
import StockPage from './Pages/Features/StockPage';
import PosPage from './Pages/Features/PosPage';
import DebtPage from './Pages/Features/DebtPage';
import LogPage from './Pages/Features/LogPage';


function App() {

  return (
    <main>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/debt" element={<DebtPage />} />
          <Route path="/log" element={<LogPage />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;