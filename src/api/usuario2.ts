import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { verificarToken } from '../utils/tokenverificator';
import prisma from '../lib/prisma';
import { deriveSecretWord } from '../utils/swmannager';
import { verifyAndGetUser } from '../utils/authMiddleware';

const numeroSaltos = parseInt(process.env.HASH_ROUNDS!)

export const userRegister = async (req: Request, res: Response) =>{
    console.clear()
    console.time()
    
    
        const {name,emailPrincipal, password, secretWord} = req.body;
        if(!emailPrincipal || !password || !secretWord || !name){
            res.status(400).json({message: 'Faltan campos requeridos'})
            return
        }
        console.log("tenemos todos los campos")
        console.timeLog()
        res.status(200).json({message: "Todos los datos se recibieton correctamente"})
        const hashedPassword = await bcrypt.hash(password,numeroSaltos);
        
        console.log("tenemos la contraseña hasheada")
        console.timeLog()
        const hashedSecretword = await bcrypt.hash(password,numeroSaltos);
        
        console.log("tenemos la palabra hasheada")
        console.timeLog()
        const token = jwt.sign({emailPrincipal},process.env.JWT_SECRET!,{expiresIn: '1h'})
        try {
                const nuevoUsuario = await prisma.usuario.create({
                data: {
                    name,
                    emailPrincipal, 
                    emailList: [emailPrincipal],
                    password: hashedPassword,
                    role: 'user',
                    secretWord: hashedSecretword
                }
            })
                /* res.status(201).json({
                message: 'Usuario registrado con exito',
                token,
                user: {
                    id:nuevoUsuario.id,
                    name: nuevoUsuario.name,
                    emailList: nuevoUsuario.emailList,
                    role: nuevoUsuario.role,
                    secretWord: deriveSecretWord(hashedSecretword)

                }
            }) */
        } catch (error) {
            console.error("salto un error")
            console.error(error)
            
            //res.status(500).json({message: "Ha ocurrido un error en el registro: ", error})
            //solo puede haber 1 res.status
        }
        console.log("todo termino")
    console.timeEnd()
}