import React from 'react';
import { Route, Routes } from 'react-router-dom';

import MainPage from './Pages/MainPage';
import LoginPage from './Pages/Auth/LoginPage';
import RegisterPage from './Pages/Auth/RegisterPage';
import MainLayout from './Components/Layout/MainLayout';

import DashboardPage from './Pages/Features/DashboardPage';
import StockPage from './Pages/Features/StockPage';
import PosPage from './Pages/Features/PosPage';
import TransactionPage from './Pages/Features/TransactionPage';
import DebtPage from './Pages/Features/DebtPage';
import LogPage from './Pages/Features/LogPage';
import NewPage from './Pages/NewItem/NewPage';

import NewStock from './Components/Features/Stock/NewStock';
import NewTransaction from './Components/Features/Transaction/NewTransaction';
import NewPos from './Components/Features/Pos/NewPos';
import NewDebt from './Components/Features/Debt/NewDebt';
import NewLog from './Components/Features/Log/NewLog';

import DetailStock from './Components/Features/Stock/DetailStock';
import DetailTransaction from './Components/Features/Transaction/DetailTransaction';
import DetailDebt from './Components/Features/Debt/DetailDebt';
import DetailLog from './Components/Features/Log/DetailLog';

import EditStock from './Components/Features/Stock/EditStock';
import EditTransaction from './Components/Features/Transaction/EditTransaction';
import EditDebt from './Components/Features/Debt/EditDebt';
import EditLog from './Components/Features/Log/EditLog';

import ErrorPage from './Pages/Features/ErrorPage';

function App() {

  return (
    <main>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>

          {/* Halaman utama */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* tambah item baru */}
          <Route path="/new" element={<NewPage />} />

          {/* Transaction */}
          <Route path="/transaction" element={<TransactionPage />}/>
          <Route path="/new/newtransaction/" element={<NewTransaction />}/>
          <Route path="/transaction/:id" element={<DetailTransaction />}/>
          <Route path="/transaction/edittransaction/:id" element={<EditTransaction />}/>

          {/* Stock */}
          <Route path="/stock" element={<StockPage />} />
          <Route path="/new/newstock" element={<NewStock />} />
          <Route path="/stock/:id" element={<DetailStock />} />
          <Route path="/stock/editstock/:id" element={<EditStock />} />

          {/* POS */}
          <Route path="/pos" element={<PosPage />} />
          <Route path="/new/newpos" element={<NewPos />} />

          {/* Debt */}
          <Route path="/debt" element={<DebtPage />} />
          <Route path="/new/newdebt" element={<NewDebt />} />
          <Route path="debt/:id" element={<DetailDebt />} />
          <Route path="/debt/editdebt/:id" element={<EditDebt />} />

          {/* Log */}
          <Route path="/log" element={<LogPage />} />
          <Route path="/new/newlog" element={<NewLog />} />
          <Route path="/log/:id" element={<DetailLog />} />
          <Route path="/log/editlog/:id" element={<EditLog />} />
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </main>
  );
}

export default App;