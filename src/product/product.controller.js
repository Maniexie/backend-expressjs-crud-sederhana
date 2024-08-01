import express from "express";

const createProductController = (prisma) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    const products = await prisma.product.findMany();
    res.send(products);
  });

  router.get("/:id", async (req, res) => {
    try {
      const productID = parseInt(req.params.id);
      const product = await prisma.product.findUnique({
        where: { id: productID },
      });

      if (!product) {
        return res.status(404).send({ error: "product not found" });
      }

      res.status(200).send(product);
    } catch (error) {
      return res.status(500).send("product not found" + error.message);
    }
  });

  router.post("/", async (req, res) => {
    try {
      const createProduct = req.body;
      const product = await prisma.product.create({
        data: {
          name: createProduct.name,
          price: parseFloat(createProduct.price),
          description: createProduct.description,
          image: createProduct.image,
        },
      });
      res.status(201).send({
        data: product,
        message: "product created successfully",
      });
    } catch (error) {
      res.status(500).send({
        error: "product not created , wajib isi semua field - " + error.message,
      });
    }
  });

  router.patch("/:id", async (req, res) => {
    try {
      const productID = req.params.id;
      const productBody = req.body;

      const product = await prisma.product.update({
        where: { id: parseInt(productID) },
        data: {
          description: productBody.description,
          image: productBody.image,
          name: productBody.name,
          price: parseFloat(productBody.price),
        },
      });

      res
        .status(200)
        .send("berhasil merubah semua value dari ID: " + product.id);
    } catch (error) {
      res.status(400).send({
        error: "Product not found - " + error.message,
      });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const productID = req.params.id;
      const productBody = req.body;

      if (
        !(
          productBody.name &&
          productBody.price &&
          productBody.description &&
          productBody.image
        )
      ) {
        return res.status(400).send({
          error: "harap isi semua field",
        });
      }

      const product = await prisma.product.update({
        where: { id: parseInt(productID) },
        data: {
          description: productBody.description,
          image: productBody.image,
          name: productBody.name,
          price: parseFloat(productBody.price),
        },
      });

      res
        .status(200)
        .send("berhasil merubah semua value dari ID: " + product.id);
    } catch (error) {
      if (error.code === "P2025") {
        // Prisma error code for "Record to update not found."
        return res.status(404).send({
          error: "Product with the specified ID not found",
        });
      }

      res.status(500).send({
        error: "Terjadi kesalahan: " + error.message,
      });
      res.status(500).send({ error: error.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const productID = req.params.id;
      await prisma.product.delete({
        where: { id: parseInt(productID) },
      });

      res.status(200).send(" successfully deleted");
    } catch (error) {
      res.status(500).send({ error: "product not found" + error.message });
    }
  });

  return router;
};

export default createProductController;
