import { VercelRequest, VercelResponse } from "../types/vercel";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Usuario } from "../types/user";
import prisma from "../lib/prisma";
import { deriveSecretWord } from "../utils/swmannager";


//Simulacion de base de datos en memoria:
const usuariosSimualdos :Usuario[] = [
    {
        id: 1,
        name: "mauri",
        emailList: [],
        role: 'admin',
        secretWord: "hola",
        emailPrincipal: 'oscar@vaultcrypt.com',
        password: '$2b$10$HX03FC8uOTu1K8s9Ge1dfetfLvIflGWiQ26DtZrOn/tfnQK7ibvSq', // reemplazar con hash real
    }
];

export default async function loginHandler(req :VercelRequest, res :VercelResponse){
    if(req.method !== 'POST'){
        res.status(405).json({message: 'Metodo no permitido'})
        return
    }
    const {emailPrincipal, password} = req.body;
    if(!emailPrincipal || !password){
        res.status(400).json({message: 'Faltan campos requeridos'})
        return
    }
    
    try {
    // Buscar usuario por emailPrincipal
    const usuario = await prisma.usuario.findUnique({
      where: { emailPrincipal },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: "Contraseña invalida" });
    }

    // Generar JWT
    const token = jwt.sign({emailPrincipal},process.env.JWT_SECRET!,{expiresIn: '1h'})

    // Respuesta
    res.status(200).json({
                    message: 'Usuario autenticado',
                    token,
                    datosDEusurario: {
                        id: usuario.id,
                        name: usuario.name,
                        emailList: usuario.emailList,
                        secretWord: deriveSecretWord(usuario.secretWord, 12),
                        role: usuario.role,
    
                    }
    })
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }





}