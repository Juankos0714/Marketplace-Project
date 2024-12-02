import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../database/prisma';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.MY_SECRET_KEY || 'clave_secreta_para_pruebas';

describe('Sale Controller', () => {
  let buyerToken: string;
  let sellerToken: string;
  let adminToken: string;
  let storeId: string;
  let productId: string;
  let sellerId: string;

  const testProduct = {
    name: "The Last of Us Part II",
    description: "Juego de aventura y acción",
    image: "https://example.com/tlou2.jpg",
    category: "Acción",
    platform: "PS4",
    price: 59.99,
    amount: 10
  };

  beforeAll(async () => {
    // Limpiar la base de datos antes de las pruebas
    await prisma.$transaction([
      prisma.saleProduct.deleteMany(),
      prisma.sale.deleteMany(),
      prisma.product.deleteMany(),
      prisma.store.deleteMany(),
      prisma.user.deleteMany(),
      prisma.access.deleteMany()
    ]);

    // Crear los roles primero y guardar los IDs
    let adminAccessId: string;
    let sellerAccessId: string;
    let buyerAccessId: string;

    try {
      const adminAccess = await prisma.access.create({ 
        data: { name: "admin_sale_test" } 
      });
      const sellerAccess = await prisma.access.create({ 
        data: { name: "seller_sale_test" } 
      });
      const buyerAccess = await prisma.access.create({ 
        data: { name: "buyer_sale_test" } 
      });

      adminAccessId = adminAccess.id;
      sellerAccessId = sellerAccess.id;
      buyerAccessId = buyerAccess.id;

      // Ahora crear los usuarios con los IDs válidos
      const admin = await prisma.user.create({
        data: {
          name: "Admin Test",
          email: "admin_sale@test.com",
          password: "password123",
          accessId: adminAccessId
        }
      });

      const seller = await prisma.user.create({
        data: {
          name: "Seller",
          email: "seller@test.com",
          password: "password123",
          accessId: sellerAccessId // Remover .id
        }
      });

      const buyer = await prisma.user.create({
        data: {
          name: "Buyer",
          email: "buyer@test.com",
          password: "password123",
          accessId: buyerAccessId // Remover .id
        }
      });

      // Crear tienda
      const store = await prisma.store.create({
        data: {
          name: "Game Store",
          userId: seller.id
        }
      });

      // Crear producto
      const product = await prisma.product.create({
        data: {
          ...testProduct,
          storeId: store.id
        }
      });

      // Guardar IDs y generar tokens
      storeId = store.id;
      productId = product.id;
      sellerId = seller.id;
      adminToken = sign({ id: admin.id }, SECRET_KEY);
      sellerToken = sign({ id: seller.id }, SECRET_KEY);
      buyerToken = sign({ id: buyer.id }, SECRET_KEY);
    } catch (error) {
      console.error('Error en la configuración:', error);
      throw error;
    }
  });

  describe('POST /create-sale', () => {
    it('debería crear una nueva venta como comprador', async () => {
      const saleData = {
        products: [{ id: productId, quantity: 1 }],
        userSellerId: sellerId
      };

      const response = await request(app)
        .post('/create-sale')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(saleData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.total_value).toBe(testProduct.price);
    });

    it('debería fallar si el producto no existe', async () => {
      const saleData = {
        products: [{ id: 'invalid-id', quantity: 1 }],
        userSellerId: sellerId
      };

      const response = await request(app)
        .post('/create-sale')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(saleData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('debería fallar si la cantidad solicitada excede el stock', async () => {
      const saleData = {
        products: [{ id: productId, quantity: 20 }], // Más que el stock disponible (10)
        userSellerId: sellerId
      };

      const response = await request(app)
        .post('/create-sale')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(saleData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('debería fallar sin token de autorización', async () => {
      const saleData = {
        products: [{ id: productId, quantity: 1 }],
        userSellerId: sellerId
      };

      const response = await request(app)
        .post('/create-sale')
        .send(saleData);

      expect(response.status).toBe(401);
    });

    it('debería calcular correctamente el total para múltiples productos', async () => {
      const saleData = {
        products: [
          { id: productId, quantity: 2 }
        ],
        userSellerId: sellerId
      };

      const response = await request(app)
        .post('/create-sale')
        .set('Authorization', `Bearer ${buyerToken}`)
        .send(saleData);

      expect(response.status).toBe(201);
      expect(response.body.total_value).toBe(testProduct.price * 2);
    });
  });

  describe('GET /get-all-sales', () => {
    it('debería obtener todas las ventas como admin', async () => {
      const response = await request(app)
        .get('/get-all-sales')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /get-all-sales-by-buyer', () => {
    it('debería obtener las ventas del comprador', async () => {
      const response = await request(app)
        .get('/get-all-sales-by-buyer')
        .set('Authorization', `Bearer ${buyerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /get-all-sales-by-seller', () => {
    it('debería obtener las ventas del vendedor', async () => {
      const response = await request(app)
        .get('/get-all-sales-by-seller')
        .set('Authorization', `Bearer ${sellerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Modificar el orden de limpieza en afterAll para respetar las restricciones de clave foránea
  afterAll(async () => {
    await prisma.$transaction([
      prisma.saleProduct.deleteMany(),
      prisma.sale.deleteMany(),
      prisma.product.deleteMany(),
      prisma.store.deleteMany(),
      prisma.user.deleteMany(),
      prisma.access.deleteMany()
    ]);
  });
});