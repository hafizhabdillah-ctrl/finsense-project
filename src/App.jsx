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
import NewPage from './Pages/NewItem/NewPage';

import NewStock from './Components/Features/Stock/NewStock';
import DetailStock from './Components/Features/Stock/DetailStock';
import EditStock from './Components/Features/Stock/EditStock';

import NewPos from './Components/Features/Pos/NewPos';
import NewDebt from './Components/Features/Debt/NewDebt';
import NewLog from './Components/Features/Log/NewLog';

import ErrorPage from './Pages/Features/ErrorPage';

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
          <Route path="/stock/:id" element={<DetailStock />} />
          <Route path="/stock/editstock/:id" element={<EditStock />} />

          <Route path="/pos" element={<PosPage />} />
          <Route path="/debt" element={<DebtPage />} />
          <Route path="/log" element={<LogPage />} />

          <Route path="/dashboard/new" element={<NewPage />} />
          <Route path="/dashboard/newstock" element={<NewStock />} />
          <Route path="/dashboard/newpos" element={<NewPos />} />
          <Route path="/dashboard/newdebt" element={<NewDebt />} />
          <Route path="/dashboard/newlog" element={<NewLog />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </main>
  );
}

export default App;