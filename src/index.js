import express from "express";
import cors from "cors";
import env from "dotenv";
import { PrismaClient } from "@prisma/client";
import productController from "./product/product.controller.js";

env.config();

const app = express();
const port = process.env.PORT;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* ==== endpoint - entry point ==== */

// testing
app.get("/", async (req, res) => {
  res.send("Hello World");
});

// testing api
app.get("/api", async (req, res) => {
  res.send("response from api");
});

// const productController = require("./product/product.controller");
// Pass prisma client to the productController
app.use("/products", productController(prisma));

/* ==== endpoint - entry point ==== */

app.listen(port, () => {
  console.log("server is running on port " + port);
});
