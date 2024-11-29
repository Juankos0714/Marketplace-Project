import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../database/prisma';
import { sign } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

jest.setTimeout(30000); // Aumentar timeout global

describe('Access Controller', () => {
  let authToken: string;
  let adminId: string;

  beforeAll(async () => {
    const adminAccess = await prisma.access.create({
      data: { name: "adm" }
    });

    const admin = await prisma.user.create({
      data: {
        name: "Admin Test",
        email: "admin@test.com",
        password: "password123",
        accessId: adminAccess.id
      }
    });

    adminId = admin.id;
    authToken = sign({ id: admin.id }, process.env.MY_SECRET_KEY || 'clave_secreta_para_pruebas');
  });

  beforeEach(async () => {
    // Limpiar accesos excepto el admin
    await prisma.access.deleteMany({
      where: {
        name: {
          not: 'adm'
        }
      }
    });
  });

  describe('POST /access', () => {
    it('debería crear un nuevo acceso', async () => {
      const accessData = { name: "Vendedor" };

      const response = await request(app)
        .post('/access')
        .set('Authorization', `Bearer ${authToken}`)
        .send(accessData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(accessData.name);
    });

    it('debería fallar al crear un acceso duplicado', async () => {
      const accessData = { name: "Vendedor" };

      // Crear el primer acceso
      await request(app)
        .post('/access')
        .set('Authorization', `Bearer ${authToken}`)
        .send(accessData);

      // Intentar crear el duplicado
      const response = await request(app)
        .post('/access')
        .set('Authorization', `Bearer ${authToken}`)
        .send(accessData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.access.deleteMany()
    ]);

    // Esperar a que se completen las operaciones asíncronas
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});