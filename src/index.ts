import express from 'express';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import {router} from './router';

const app = express();
app.use(express.json())
app.use(router);
app.use(express.static("public"));
const prisma = new PrismaClient();

app.use(express.json());

//************************************* Template Engine *************************************\\
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views/"));

//*********************************************************************************************\\

const productsRouter = require("./router/");
app.get('/', (_req, res) => {
  res.render('index.ejs');
});

app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: 'defaultPassword', // replace with actual password logic
    },
  });
  res.json(user);
});

// const port = process.env.PORT || 3333;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// import express from "express";
// import { router } from "./router";

const port: string = process.env.PORT || '3333';

app.listen(`${port}`, () => console.log(`Server running on port ${port} - http://localhost:${port}`));
