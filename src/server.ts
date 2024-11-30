import express from "express";

import { router } from "./router";

const app = express();
app.use(express.json())
app.use(router);
const port: string = process.env.PORT || '3333';

app.listen(`${port}`, () => console.log(`Server running on port ${port} - http://localhost:${port}`));
