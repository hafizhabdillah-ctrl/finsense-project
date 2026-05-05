import 'dotenv/config'; // ← WAJIB agar process.env.DATABASE_URL terbaca
import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrations: {
    seed: 'node prisma/seed.js',
  },
  datasource: {
    url: process.env.DATABASE_URL, // akan membaca dari .env
  },
  generator: {
    provider: 'prisma-client-js',
  },
});
