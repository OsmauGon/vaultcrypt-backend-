import { Request, Response } from "express";
import prisma from "../lib/prisma";


// Endpoint POST para crear un usuario

export const prismatest = async (req :Request, res :Response) => {
  res.json({ok: true})
  /* try {
    const { name, email } = req.body;
    const nuevoUsuario = await prisma.test.create({
        data: {
            name
        }
    })

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear usuario" });
  } */
}
