/* eslint-disable camelcase */

/* eslint-disable camelcase */

export let transactions = [
  { id: 1, date: '2026-01-20', category: 'Penjualan', description: 'Penjualan harian toko', amount: 500000, type: 'income', source: 'manual', is_anomaly: false },
  { id: 2, date: '2026-01-21', category: 'Restock Stok', description: 'Belanja beras dan minyak', amount: 150000, type: 'expense', source: 'ocr', is_anomaly: false },
  { id: 3, date: '2026-02-22', category: 'Gaji Karyawan', description: 'Gaji bulanan staff', amount: 1000000, type: 'expense', source: 'manual', is_anomaly: true },
  { id: 4, date: '2026-03-23', category: 'Penjualan', description: 'Penjualan sembako paket hemat', amount: 750000, type: 'income', source: 'manual', is_anomaly: false },
  { id: 5, date: '2026-04-24', category: 'Operasional', description: 'Bayar listrik dan air toko', amount: 200000, type: 'expense', source: 'manual', is_anomaly: false },
  { id: 6, date: '2026-05-25', category: 'Restock Stok', description: 'Kulakan telur 2 peti', amount: 3000000, type: 'expense', source: 'ocr', is_anomaly: true },
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