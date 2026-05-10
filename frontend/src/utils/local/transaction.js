/* eslint-disable camelcase */

/* eslint-disable camelcase */

export let transactions = [
  { id: 1, date: '2026-01-20', category: 'Penjualan', description: 'Penjualan harian toko', amount: 500000, type: 'income', source: 'manual', is_anomaly: false },
  { id: 2, date: '2026-01-21', category: 'Restock Stok', description: 'Belanja beras dan minyak', amount: 150000, type: 'expense', source: 'ocr', is_anomaly: false },
  { id: 3, date: '2026-02-22', category: 'Gaji Karyawan', description: 'Gaji bulanan staff', amount: 1000000, type: 'expense', source: 'manual', is_anomaly: true },
  { id: 4, date: '2026-03-23', category: 'Penjualan', description: 'Penjualan sembako paket hemat', amount: 750000, type: 'income', source: 'manual', is_anomaly: false },
  { id: 5, date: '2026-04-24', category: 'Operasional', description: 'Bayar listrik dan air toko', amount: 200000, type: 'expense', source: 'manual', is_anomaly: false },
  { id: 6, date: '2026-05-25', category: 'Restock Stok', description: 'Kulakan telur 2 peti', amount: 3000000, type: 'expense', source: 'ocr', is_anomaly: true },
  { id: 7, date: '2026-05-26', category: 'Penjualan', description: 'Laba penjualan beras premium', amount: 1200000, type: 'income', source: 'manual', is_anomaly: false },
  { id: 8, date: '2026-05-27', category: 'Lain-lain', description: 'Penjualan kardus dan botol bekas', amount: 45000, type: 'income', source: 'manual', is_anomaly: false },
  { id: 9, date: '2026-05-28', category: 'Restock Stok', description: 'Kulakan Mie Instan 10 dus', amount: 1100000, type: 'expense', source: 'ocr', is_anomaly: false },
  { id: 10, date: '2026-05-29', category: 'Penjualan', description: 'Penjualan eceran sore', amount: 320000, type: 'income', source: 'manual', is_anomaly: false },
  { id: 11, date: '2026-05-30', category: 'Operasional', description: 'Beli ATK dan nota toko', amount: 85000, type: 'expense', source: 'manual', is_anomaly: false },
  { id: 12, date: '2026-05-31', category: 'Penjualan', description: 'Pesanan sembako hajatan', amount: 4500000, type: 'income', source: 'manual', is_anomaly: true },
  { id: 13, date: '2026-06-01', category: 'Restock Stok', description: 'Beli Galon Aqua 20 unit', amount: 380000, type: 'expense', source: 'ocr', is_anomaly: false },
  { id: 14, date: '2026-06-02', category: 'Penjualan', description: 'Penjualan harian rutin', amount: 600000, type: 'income', source: 'manual', is_anomaly: false },
  { id: 15, date: '2026-06-03', category: 'Gaji Karyawan', description: 'Bonus lembur staff', amount: 250000, type: 'expense', source: 'manual', is_anomaly: false },
  { id: 16, date: '2026-06-04', category: 'Restock Stok', description: 'Kulakan Gula Pasir 50kg', amount: 750000, type: 'expense', source: 'ocr', is_anomaly: false },
  { id: 17, date: '2026-06-05', category: 'Penjualan', description: 'Laba penjualan terigu ecer', amount: 210000, type: 'income', source: 'manual', is_anomaly: false },
  { id: 18, date: '2026-06-06', category: 'Operasional', description: 'Service timbangan digital', amount: 150000, type: 'expense', source: 'manual', is_anomaly: false },
  { id: 19, date: '2026-06-07', category: 'Penjualan', description: 'Penjualan paket sembako Jumat Berkah', amount: 1550000, type: 'income', source: 'manual', is_anomaly: false },
  { id: 20, date: '2026-06-08', category: 'Lain-lain', description: 'Parkir langganan bulanan', amount: 50000, type: 'expense', source: 'manual', is_anomaly: false },
];

export function addTransaction({ date, category, type, amount, description }) {
  transactions = [...transactions, {
    id: transactions.length + 1,
    date: date,
    category: category,
    description: description,
    amount: amount,
    type: type,
    source: 'manual',
    is_anomaly: false
  }];
}

export function getTransactionById(id) {
  const transactionfound = transactions.find((transaction) => transaction.id == id);
  return transactionfound;
}

export function updateTransaction({ id, date, category, description, amount, type, source }) {
  transactions = transactions.map((transaction) => {
    if (transaction.id == id) {
      return {
        ...transaction,
        date: date,
        category: category,
        description: description,
        amount: amount,
        type: type,
        source: source,
      };
    }
    return transaction;
  });
}

export function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id != id);
}