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

export interface JwtPayload {
  id: string;
  emailPrincipal: string;
  role: string;
}

interface UserAuthData {
  id: number;
  role: string;
}

export async function verifyAndGetUser(token: string): Promise<UserAuthData> {
  /*
  Esta funcion esta para verificar la autenticidad del usaurio al momento de solicitar
  el GET y PUT de usuario, y el POST y GET de cuentas
  Verifica si esta el token, si es correcto y luego obtiene el usuario del token enviado

  */
  try {
    // 1. Validar variables de entorno
    if (!process.env.JWT_SECRET) {
      throw { status: 500, message: "JWT_SECRET no configurado" };
    }
    if (!process.env.DATABASE_URL) {
      throw { status: 500, message: "DATABASE_URL no configurado" };
    }

    // 2. Verificar y decodificar token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as {emailPrincipal :string};
    } catch (err :any) {
      if (err.name === "TokenExpiredError") {
        throw { status: 401, message: "Token expirado" };
        }
        if (err.name === "JsonWebTokenError") {
          throw { status: 401, message: "Token inválido" };
        }

      throw { status: 401, message: "Error al verificar token" };
    }

    // 3. Buscar usuario por email
    try {
      const user = await prisma.usuario.findUnique({
        where: { emailPrincipal: decoded.emailPrincipal },
        select: { id: true, role: true },
      });

      if (!user) {
        throw { status: 404, message: "Usuario no encontrado" };
      }

      // ✅ Devuelve solo id y role
      return { id: Number(user.id), role: user.role };
    } catch (dbError) {
      throw { status: 503, message: "Error de conexión con la base de datos" };
    }
  } catch (error) {
    throw error;
  }
}