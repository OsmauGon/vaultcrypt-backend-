/*
Este sera un middleware que estara en los endpoints de las rutas utilizadas por el administra que tenga acceso completo a todos lo CRUDs posibles
*/
import express, { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

// Middleware de verificación
export const verificacionDEsolicitante = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "No autorizado: falta token" });
  }

  let solicitante = undefined
  // Aquí podrías validar el token con JWT, o cualquier lógica de verificación
  if (token.startsWith("Bearer admintoken") && token.endsWith(":requestsaccess")) {
    solicitante = await prisma.usuario.findUnique({where: {id: Number(token.split(":")[1])}})
    
  } else {
    return res.status(403).json({ error: "Token inválido", token });
  }

  if(solicitante && solicitante.role && solicitante.role === "admin") next()
  else{
    return res.status(401).json({ error: "No autorizado: el visitante no es un admin" });
  }

}