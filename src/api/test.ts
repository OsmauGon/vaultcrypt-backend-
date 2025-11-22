import express, { Request, Response } from "express";
import prisma from "../lib/prisma";

const app = express();

app.use(express.json());

// Endpoint POST para crear un usuario

export const prismatest = async (req :Request, res :Response) => {
  try {
    const { name, email } = req.body;

    /* const nuevoUsuario = await prisma.usuario.create({
      data: {
        name,
        email,
      },
    }); */
    const nuevoUsuario = await prisma.test.create({
        data: {
            name
        }
    })

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});