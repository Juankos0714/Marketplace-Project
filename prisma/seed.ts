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
      password: "vendedor",
      accessId: vendedorAccess.id,
    },
  });

  const compradorUser = await prisma.user.create({
    data: {
      name: 'Comprador User',
      email: 'comprador@example.com',
      password: compradorPassword,
      accessId: compradorAccess.id,
    },
  });

  // Crear tienda
  const store = await prisma.store.create({
    data: {
      id: 1, // Asegúrate de que el ID sea 1
      name: 'Tienda Principal',
      userId: vendedorUser.id, // Asignar la tienda al usuario vendedor
    },
  });

  // Crear productos
  const product1 = await prisma.product.create({
    data: {
      name: 'Producto 1',
      description: 'Descripción del Producto 1',
      image: 'imagen1.jpg',
      category: 'Categoría 1',
      platform: 'Plataforma 1',
      price: 100.0,
      amount: 10,
      storeId: store.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Producto 2',
      description: 'Descripción del Producto 2',
      image: 'imagen2.jpg',
      category: 'Categoría 2',
      platform: 'Plataforma 2',
      price: 200.0,
      amount: 20,
      storeId: store.id,
    },
  });

  // Crear ventas
  const sale = await prisma.sale.create({
    data: {
      total_value: 300.0,
      Buyer: { connect: { id: compradorUser.id } },
      Seller: { connect: { id: vendedorUser.id } },
      SaleProduct: {
        create: [
          { Product: { connect: { id: product1.id } }, quantity: 1 },
          { Product: { connect: { id: product2.id } }, quantity: 1 },
        ],
      },
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