const prisma = require('../src/config/prisma');
async function main() {
  const categories = [
    { name: 'Lainnya', type: 'expense', is_default: true },
    { name: 'Makanan & Minuman', type: 'expense', is_default: false },
    { name: 'Transportasi', type: 'expense', is_default: false },
    { name: 'Bahan Baku', type: 'expense', is_default: false },
    { name: 'Sewa & Operasional', type: 'expense', is_default: false },
    { name: 'Listrik & Air', type: 'expense', is_default: false },
    { name: 'Promosi & Iklan', type: 'expense', is_default: false },
    { name: 'Gaji Karyawan', type: 'expense', is_default: false },
    { name: 'Perawatan & Perbaikan', type: 'expense', is_default: false },
    { name: 'Pemasukan Penjualan', type: 'income', is_default: true },
    { name: 'Pendapatan Lain', type: 'income', is_default: false },
  ];

  for (const cat of categories) {
    await prisma.transactionCategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log('Seed kategori selesai');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
