import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { IncomingMessage, ServerResponse } from 'http';
import { Usuario } from '../types/user';
import { verificarToken } from '../utils/tokenverificator';
import prisma from '../lib/prisma';
import { deriveSecretWord } from '../utils/swmannager';

export interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
  cookies: { [key: string]: string };
}

export interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (body: any) => void;
}

//Simulacion de base de datos en memoria:
const usuariosSimualdos :Usuario[] = [
    {   
        id: 1,
        name: "Mauricio",
        emailPrincipal: 'oscar@vaultcrypt.com',
        emailList: ['oscar@vaultcrypt.com'],
        password: '$2b$10$HX03FC8uOTu1K8s9Ge1dfetfLvIflGWiQ26DtZrOn/tfnQK7ibvSq', // reemplazar con hash real
        role: 'user',
        secretWord: "palabraSecreta"
    }
];
export default async function usersHandler(req: VercelRequest, res: VercelResponse){
    if(req.method === 'POST'){//LISTO!!
        const {name,emailPrincipal, password, secretWord} = req.body;
        if(!emailPrincipal || !password || !secretWord || !name){
            res.status(400).json({message: 'Faltan campos requeridos'})
            return
        }
        const hashedPassword = await bcrypt.hash(password,18);
        const hashedSecretword = await bcrypt.hash(password,18);
        const token = jwt.sign({emailPrincipal},process.env.JWT_SECRET!,{expiresIn: '1h'})
        //const usuario  = {emailPrincipal, password: hashedPassword}
        //falta la logica de verificar existencia en base  en base de datos
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
                res.status(201).json({
                message: 'Usuario registrado con exito',
                token,
                nuevoUsuario
            })
        } catch (error) {
            res.status(500).json({message: "Ha ocurrido un error en el registro: ", error})
        }
        
    }
    else if(req.method === 'GET'){
        //esta funcion es para devolver al propio usuario mediante el token
        const authHeader = req.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(401).json({message: 'Token no proporcionado'})
            return
        }
        const token = authHeader.split(' ')[1]
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {emailPrincipal: string};
            /* const usuario = usuariosSimualdos.find(u => u.emailPrincipal === decoded.email)
            //aqui va la logica de base de datos
            if(!usuario){
                res.status(404).json({message: 'Usuario no encontrado'})
                return;
            } */
            const user = await prisma.usuario.findUnique({ where: { emailPrincipal: decoded.emailPrincipal } })
            if(!user){
                res.status(404).json({message: 'Usuario no encontrado'})
                return;
            }
            res.status(200).json({
                message: 'Usuario autenticado',
                datosDEusurario: {
                    id: user.id,
                    name: user.name,
                    emailList: user.emailList,
                    secretWord: deriveSecretWord(user.secretWord, 12),
                    role: user.role,

                }
            })
        } catch (error :any){
            //Como no se recomienda usar ANY, lo ideal es poner aqui un middleware para manejar los posibles errores
            if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expirado" });
            }
            if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Token inválido" });
            }
            return res.status(500).json({ message: "Error: ",error });

        }
    }
    else if(req.method === 'PUT'){
        const authHeader = req.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(401).json({message: 'Token no proporcionado'})
            return
        }
        const token = authHeader.split(' ')[1]
        //$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        const {name, emailPrincipal, emailList, password} = req.body
        try{
            const decoded = verificarToken(req.headers['authorization']) as { emailPrincipal: string };
            if (!decoded) throw new Error('Token inválido');
            const user = await prisma.usuario.findUnique({ where: { emailPrincipal: decoded.emailPrincipal } })
            if(!user){
                res.status(404).json({message: 'Usuario no encontrado'})
                return
            }
            const {emailPrincipal: nuevoEmail, password: nuevaPassword, emailList :listaActualizada, name: nuevoName} = req.body;
            if(!nuevoEmail || !nuevaPassword || !nuevoName || !listaActualizada){

                console.log(nuevoName)
                console.log(nuevoEmail)
                console.log(nuevaPassword)
                console.log(listaActualizada)
                res.status(400).json({message: 'No se proporcionaron datos para actualizar'})
                return
            }
            //aqui va la logica para editar registros de la base de datos3

            const usuarioActualizado = await prisma.usuario.update({
                where: { id: Number(user.id) },
                data: {
                    ...user,
                    name : nuevoName,
                    emailPrincipal : nuevoEmail,
                    emailList : listaActualizada,
                    password: await bcrypt.hash(nuevaPassword, 10),
                    
                },
                });


            res.status(200).json({message: 'Usuario actualizado con exito'})

        } catch (error :any){
            //Como no se recomienda usar ANY, lo ideal es poner aqui un middleware para manejar los posibles errores
            if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expirado" });
            }
            if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Token inválido" });
            }
            return res.status(500).json({ message: "Error: ",error });
        }
    }
    else {
        res.status(405).json({message: 'Metodo no permitido'})
    }
}