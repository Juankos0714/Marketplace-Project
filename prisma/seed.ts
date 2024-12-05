import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Eliminar registros existentes
  await prisma.saleProduct.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.access.deleteMany({});

  // Crear accesos
  const adminAccess = await prisma.access.create({
    data: { name: 'admin' },
  });

  const vendedorAccess = await prisma.access.create({
    data: { name: 'vendedor' },
  });

  const compradorAccess = await prisma.access.create({
    data: { name: 'comprador' },
  });

  // Crear usuarios
  const adminPassword = await hash('admin123', 10);
  const vendedorPassword = await hash('vendedor123', 10);
  const compradorPassword = await hash('comprador123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      accessId: adminAccess.id,
    },
  });

  const vendedorUser = await prisma.user.create({
    data: {
      name: 'Vendedor User',
      email: 'vendedor@example.com',
      password: vendedorPassword,
      accessId: vendedorAccess.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Comprador User',
      email: 'comprador@example.com',
      password: compradorPassword,
      accessId: compradorAccess.id,
    },
  });

  // Crear tienda
  await prisma.store.create({
    data: {
      id: 1, // Asegúrate de que el ID sea 1
      name: 'Tienda Principal',
      userId: vendedorUser.id, // Asignar la tienda al usuario vendedor
    },
  });

  console.log('Datos de ejemplo insertados');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });