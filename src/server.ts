import express from "express";
import path from "path";
import { router } from "./router";

const app = express();
app.use(express.json());
app.use(router);

//************************************* Template Engine *************************************\\
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views/"));

const port: string = process.env.PORT || '3333';

app.listen(port, () => console.log(`Server running on port ${port} - http://localhost:${port}`));