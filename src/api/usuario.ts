import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IncomingMessage, ServerResponse } from 'http';
import { Usuario } from '../types/user';
import { verificarToken } from '../utils/tokenverificator';

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
    if(req.method === 'POST'){
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({message: 'Faltan campos requeridos'})
            return
        }
        const hashedPassword = await bcrypt.hash(password,18);
        const token = jwt.sign({email},process.env.JWT_SECRET!,{expiresIn: '1h'})
        const usuario = {email, password: hashedPassword}
        //falta la logica de verificar existencia en base  en base de datos
        res.status(201).json({
            message: 'Usuario registrado con exito',
            token,
            usuario
        })
    }
    else if(req.method === 'GET'){
        const authHeader = req.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(401).json({message: 'Token no proporcionado'})
            return
        }
        const token = authHeader.split(' ')[1]
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {email: string};
            const usuario = usuariosSimualdos.find(u => u.emailPrincipal === decoded.email)
            //aqui va la logica de base de datos
            if(!usuario){
                res.status(404).json({message: 'Usuario no encontrado'})
                return;
            }
            res.status(200).json({
                message: 'Usuario autenticado',
                email: usuario.emailPrincipal
            })
        } catch (error){
            res.status(401).json({message: 'Token invalido o expirado'})
        }
    }
    else if(req.method === 'PUT'){
        const authHeader = req.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(401).json({message: 'Token no proporcionado'})
            return
        }
        const token = authHeader.split(' ')[1]
        try{
            const decoded = verificarToken(req.headers['authorization']) as { email: string };
            if (!decoded) throw new Error('Token inválido');
            const index = usuariosSimualdos.findIndex(u => u.emailPrincipal === decoded.email)
            if(index === -1){
                res.status(404).json({message: 'Usuario no encontrado'})
                return
            }
            const {email: nuevoEmail, password: nuevaPassword} = req.body;
            if(!nuevoEmail && !nuevaPassword){
                res.status(400).json({message: 'No se proporcionaron datos para actualizar'})
                return
            }
            //aqui va la logica para editar registros de la base de datos
            if(nuevoEmail) usuariosSimualdos[index].emailPrincipal = nuevoEmail
            if(nuevaPassword){
                const hashed = await bcrypt.hash(nuevaPassword, 18)
                usuariosSimualdos[index].password = hashed
            }
            res.status(200).json({message: 'Usuario actualizado con exito'})

        } catch {
            res.status(401).json({ message: 'Token inválido o expirado' });
        }
    }
    else {
        res.status(405).json({message: 'Metodo no permitido'})
    }
}