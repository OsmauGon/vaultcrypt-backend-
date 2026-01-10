
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Usuario } from "../types/user";
import prisma from "../lib/prisma";
import { deriveSecretWord } from "../utils/swmannager";


export default async function loginHandler(req :Request, res :Response){
    const timeline: Record<string, string> = {};
    //timeline["start"] = new Date().toISOString();//inicio de la funcion
    if(req.method !== 'POST'){
        res.status(400).json({message: 'Metodo no permitido'})
        return
    }
    const {emailPrincipal, password} = req.body;
    if(!emailPrincipal || !password){
        res.status(401).json({message: 'Faltan campos requeridos'})
        return
    }
    
    try {
    // Buscar usuario por emailPrincipal
    const usuario = await prisma.usuario.findUnique({
      where: { emailPrincipal },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    //timeline["userfinded"] = new Date().toISOString();//inicio de la funcion


    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: "Contraseña invalida" }); //cambiar por "credenciales invalidas"
    }
    //timeline["userverificated"] = new Date().toISOString();//inicio de la funcion

    // Generar JWT
    const token = jwt.sign({emailPrincipal},process.env.JWT_SECRET!,{expiresIn: '1h'})
    //timeline["tokengenerated"] = new Date().toISOString();//inicio de la funcion
    // Respuesta
    res.status(200).json({
                    message: 'Usuario autenticado',
                    token,
                    user: {
                        id: usuario.id,
                        name: usuario.name,
                        emailList: usuario.emailList,
                        secretWord: deriveSecretWord(usuario.secretWord, 12),
                        role: usuario.role,
    
                    },
                    timeline
    })
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }





}