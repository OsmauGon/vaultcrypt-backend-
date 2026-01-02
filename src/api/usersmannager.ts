import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma';
import { deriveSecretWord } from "../utils/swmannager";
import { Prisma } from '@prisma/client';
import { time } from 'console';

const numeroSaltos = parseInt(process.env.HASH_ROUNDS!)

export const usersGlobalGet = async (req: Request, res: Response)=>{
    
    try {
        const users = await prisma.usuario.findMany()
        if (!users){
            res.status(404).json({error: "No hay usuarios"})
            return
        }
        
        res.status(200).json({message: `Se encontraron ${users.length} usuarios registrados:`,users})
    } catch (err) {
        res.status(500).json({error: 'Ocurrio un error', err})
        console.error(err)
    }

}
export const usersIndividualGet = async (req: Request, res: Response)=>{
    
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: " falta el ID del usuario seleccionado" });
    }

    try {
        const user = await prisma.usuario.findUnique({where: {id: Number(id)}})
        if (!user){
            res.status(404).json({error: `No se encontro el usuario con el id ${id}`})
            return
        }
        res.status(200).json({user})
    } catch (err) {
        res.status(500).json({error: 'Ocurrio un error', err})
        console.error(err)
    }

}
export const usersRegisterPost = async (req: Request, res: Response)=>{
    /*Recorda que un registro creado aqui no sera util para el front-end porque no podemos recrear el primer encriptado que se hace en el front-end. A no ser que luego se edite desde el front-end */
    const timeline: Record<string, string> = {};
    timeline["start"] = new Date().toISOString();
    const {name,emailPrincipal, password, secretWord, role} = req.body;
    if(!emailPrincipal || !password || !secretWord || !name){
        res.status(400).json({message: 'Faltan campos requeridos'})
        return
    }
    timeline["verificacionDEcredenciales"] = new Date().toISOString();
    
    const hashedPassword = await bcrypt.hash(password,numeroSaltos);
    timeline["hasheoDEcontraseña"] = new Date().toISOString();
    const hashedSecretword = await bcrypt.hash(password,numeroSaltos);
    timeline["hasheoDEsecretword"] = new Date().toISOString();
    const token = jwt.sign({emailPrincipal},process.env.JWT_SECRET!,{expiresIn: '1h'})
    timeline["generacionDEtoken"] = new Date().toISOString();
    
    try {
        const nuevoUsuario = await prisma.usuario.create({
        data: {
            name,
            emailPrincipal, 
            emailList: [emailPrincipal],
            password: hashedPassword,
            role: role ? role : 'user',
            secretWord: hashedSecretword
            }
        })

        timeline["registroDBexitoso"] = new Date().toISOString();
        res.status(201).json({
                message: 'Usuario registrado con exito',
                token,
                user: {
                    id:nuevoUsuario.id,
                    name: nuevoUsuario.name,
                    emailList: nuevoUsuario.emailList,
                    role: nuevoUsuario.role,
                    secretWord: deriveSecretWord(hashedSecretword)
                },
                timeline
                })
        } catch (error) {
            timeline["fallaENalgunLugar"] = new Date().toISOString();
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002" && error?.meta?.target) {
                    res.status(400).json({meesage:`El valor del campo ${error.meta.target} ya existe en la base de datos`, timeline})
                    }
            }

            res.status(500).json({
                message: "Ha ocurrido un error en el registro: ", 
                error, 
                timeline
            })
        }
}
export const usersLoginPost = async (req: Request, res: Response)=>{
    const timeline: Record<string, string> = {};
    timeline["start"] = new Date().toISOString();
    const {emailPrincipal, password} = req.body;
    if(!emailPrincipal || !password){
        res.status(400).json({message: 'Faltan campos requeridos'})
        return
    }
    timeline["verificacionDEcredenciales"] = new Date().toISOString();
    

    try {
        const user = await prisma.usuario.findUnique({where: {emailPrincipal}})
        if(!user){
            res.status(404).json({error: "Usuario no encontrado"})
        }
        // Verificar contraseña
        const passwordValida = user ? await bcrypt.compare(password, user.password) : undefined;
        if (!passwordValida) {
            return res.status(401).json({ error: "Contraseña invalida" }); //cambiar por "credenciales invalidas"
        }
        timeline["userverificated"] = new Date().toISOString();//inicio de la funcion

        
        const token = jwt.sign({emailPrincipal},process.env.JWT_SECRET!,{expiresIn: '1h'})
        timeline["generacionDEtoken"] = new Date().toISOString();



        timeline["logueoexitoso"] = new Date().toISOString();
        res.status(201).json({
                message: 'Usuario registrado con exito',
                token,
                user,
                timeline
                })
        } catch (error) {
            timeline["fallaENalgunLugar"] = new Date().toISOString();
            res.status(500).json({
                message: "Ha ocurrido un error en el registro: ", 
                error, 
                timeline
            })
        }
}
export const usersPut = async (req: Request, res: Response)=>{
    const {name,password,emailPrincipal,emailList,role} = req.body
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: " falta el ID del usuario seleccionado" });
    }
    if (!name || !password || !emailPrincipal || !emailList) {
        return res.status(401).json({ error: " falta algun campo del usuario a modificar" });
    }
    const hashedPassword = await bcrypt.hash(password,numeroSaltos);
    try {
        const data = {
            name,
            password : hashedPassword,
            emailPrincipal,
            emailList,
            role: role ? role : "user"
        }
       const updateUser = await prisma.usuario.update({
            where: {id: Number(id)},
            data
            })
        if (updateUser) {
            res.status(200).json({message: "Usuario actualizado con exito"})
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025" ) {
                    res.status(400).json({meesage:`No existe un registro con el ID ${id}`})
                    }
            }
        res.status(500).json({message: "Ha ocurrido un error inesperado", error})
    }
}
export const usersDelete = async (req: Request, res: Response)=>{
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: " falta el ID del usuario seleccionado" });
    }
    try {
        const deletedUser = await prisma.usuario.delete({where: {id: Number(id)}})
        if(deletedUser){
            res.status(200).json({message: `Hemos borrado exitosamente el registro del usuario ${id}`})
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025" ) {
                    res.status(400).json({meesage:`No existe un registro con el ID ${id}`})
                    }
            }
        res.status(500).json({message: "Ha ocurrido un error inesperado", error})
    }
}