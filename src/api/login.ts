import { VercelRequest, VercelResponse } from "../types/vercel";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

type Usuario=  {
    email: string;
    password: string;
}
//Simulacion de base de datos en memoria:
const usuariosSimualdos :Usuario[] = [
    {
        email: 'oscar@vaultcrypt.com',
        password: '$2b$10$HX03FC8uOTu1K8s9Ge1dfetfLvIflGWiQ26DtZrOn/tfnQK7ibvSq', // reemplazar con hash real
    }
];

export default async function handlerPostLogin(req :VercelRequest, res :VercelResponse){
    if(req.method !== 'POST'){
        res.status(405).json({message: 'Metodo no permitido'})
        return
    }
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400).json({message: 'Faltan campos requeridos'})
        return
    }
    
    const usuario = usuariosSimualdos.find(u => u.email === email)
    if(!usuario){
        return res.status(401).json({message: 'Error en las credenciales'})
    }
    const isValid = await bcrypt.compare(password, usuario?.password)
    if(!isValid){
        res.status(401).json({message: "Contraseña incorrecta"})
    }
    const token = await jwt.sign({email}, process.env.JWT_SECRET!, {expiresIn : '1h'})
    res.status(200).json({
        message: 'Inicio de sesion exitoso',
        token
    })




}