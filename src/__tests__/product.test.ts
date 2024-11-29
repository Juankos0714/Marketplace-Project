// src/__tests__/product.test.ts
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../database/prisma';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.MY_SECRET_KEY || 'clave_secreta_para_pruebas';

describe('Product Controller', () => {
  let authToken: string;
  let storeId: string;
  let testProductId: string;

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
    // Crear acceso y usuario
    const access = await prisma.access.create({
      data: { name: "Vendedor" }
    });

    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@test.com",
        password: "password123",
        accessId: access.id
      }
    });

    // Crear tienda
    const store = await prisma.store.create({
      data: {
        name: "Test Store",
        userId: user.id
      }
    });

    storeId = store.id;
    authToken = sign({ id: user.id }, SECRET_KEY);
  });

  describe('GET /product/:productId', () => {
    beforeEach(async () => {
      // Crear producto de prueba
      const createdProduct = await prisma.product.create({
        data: {
          ...testProduct,
          storeId
        }
      });
      
      testProductId = createdProduct.id;
    });

    it('debería obtener un producto específico', async () => {
      const response = await request(app)
        .get(`/get-unique-product/${testProductId}`) // Actualizada la ruta
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testProduct.name);
    });

    afterEach(async () => {
      // Limpiar el producto después de la prueba
      await prisma.product.delete({
        where: { id: testProductId }
      });
    });
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.product.deleteMany(),
      prisma.store.deleteMany(),
      prisma.user.deleteMany(),
      prisma.access.deleteMany()
    ]);
  });
});