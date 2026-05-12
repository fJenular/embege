const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const methods = ['Cash / Tunai', 'Transfer Bank', 'QRIS', 'COD (Cash on Delivery)', 'E-Wallet (GoPay/OVO/Dana)', 'Kartu Kredit'];
  
  for (const m of methods) {
    const exists = await prisma.jenis_pembayarans.findFirst({
      where: { metode_pembayaran: m }
    });
    
    if (!exists) {
      await prisma.jenis_pembayarans.create({
        data: {
          metode_pembayaran: m,
          created_at: new Date()
        }
      });
      console.log(`Added: ${m}`);
    } else {
      console.log(`Exists: ${m}`);
    }
  }
  console.log('Semua metode pembayaran berhasil ditambahkan!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
