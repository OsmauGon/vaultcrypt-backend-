import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { verifyAndGetUser } from "../utils/authMiddleware";
import { verificarToken } from "../utils/tokenverificator";


// Endpoint POST para crear un usuario

export const prismatest = async (req :Request, res :Response) => {
  //res.json({ok: true}) 
  if(req.method === "POST"){
    try {
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
    }
  }
  else if (req.method === "GET"){
    try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "Token no enviado" });
    }

    const token = authHeader.split(" ")[1];
    const { id, role } = await verifyAndGetUser(token);

    res.json({ message: "Acceso concedido", id, role });
  } catch (error: any) {
    res.status(error.status || 500).json({ error: error.message });
  }

  }
}
