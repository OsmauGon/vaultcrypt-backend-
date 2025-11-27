// utils/authMiddleware.ts
/*
Este middleware esta para autenticar el que usuario que quiera recuperar sus registros sea el dueño legitimo
El objetivo es obtener el token, y desencriptarlo para obtener el email del usuario que hace la solicitud. Con este email obtenemos el registro completo del ussuario de la base de datos y comparamos su ID con el idDueño enviado en la query
De esta manera por mas que se tenga un token valido y se manipule el endpoin, no se podran obtener registros no pertencecientes al usuario logueado
*/
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { Request, Response } from "express";

const SECRET_KEY = process.env.JWT_SECRET || "miClaveSuperSecreta";

export async function authMiddleware(req: Request, res: Response, next: Function) {
 const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    // Verificamos y extraemos email del payload
    const decoded = jwt.verify(token, SECRET_KEY) as { emailPrincipal: string };
    // Buscamos el usuario en la base de datos por email
    const usuario = await prisma.usuario.findUnique({
      where: { emailPrincipal: decoded.emailPrincipal },
    });
    if (!usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }
    // Comparar idDueño de la query con el id del usuario
    const { idDueño } = req.query;
    if (idDueño && Number(idDueño) !== usuario.id) {
      return res.status(403).json({ error: "Acceso denegado: no puedes ver cuentas de otro usuario" });
    }
    // Guardamos el usuario en la request para usarlo en el handler
    (req as any).user = usuario;

    next();
  } catch (error: any) {
    console.log(error)
    return res.status(401).json({ error: "Token inválido o expirado desde middleware" });
  }
}