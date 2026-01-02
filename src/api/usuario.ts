import bcrypt from 'bcrypt'
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { verificarToken } from '../utils/tokenverificator';
import prisma from '../lib/prisma';
import { deriveSecretWord } from '../utils/swmannager';
import { verifyAndGetUser } from '../utils/authMiddleware';


    const numeroSaltos = parseInt(process.env.HASH_ROUNDS!)
export default async function usersHandler(req: Request, res: Response){
    // Array para guardar tiempos
    const timeline: Record<string, string> = {};
    timeline["start"] = new Date().toISOString();//inicio de la funcion
    if(req.method === 'POST'){//LISTO!!
        const {name,emailPrincipal, password, secretWord} = req.body;
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
                    role: 'user',
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
            res.status(500).json({message: "Ha ocurrido un error en el registro: ", error, timeline})
        }
               
    }
    else if(req.method === 'GET'){//LISTO!!
        //esta funcion es para devolver al propio usuario mediante el token
       
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
              return res.status(401).json({ error: "Token no enviado" });
            }
        
            const token = authHeader.split(" ")[1];
            const { id, role } = await verifyAndGetUser(token);
            
            const user = await prisma.usuario.findUnique({where: {id}})
            if(!user) {
                res.status(404).json({message: "Usuario no encontrado"})
                return
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
          } catch (error) {
            res.status(500).json({message: "Ocurrio un error inesperado: ", error });
          }
        
    }
    else if(req.method === 'PUT'){//LISTO!
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
              return res.status(401).json({ error: "Token no enviado" });
            }
        
            const token = authHeader.split(" ")[1];
            const { id, role } = await verifyAndGetUser(token);
            const user = await prisma.usuario.findUnique({ where: { id } })
            if(!user){
                res.status(404).json({message: 'Usuario no encontrado'})
                return
            }
            const {
                    emailPrincipal: nuevoEmail, 
                    password: nuevaPassword, 
                    emailList :listaActualizada, 
                    name: nuevoName,
                    claveActual
                    
                } = req.body;
            if(!nuevoEmail || !nuevaPassword || !nuevoName || !listaActualizada || claveActual){
                
                res.status(400).json({message: 'Faltan datos para actualizar'})
                return
            }
            //aqui va la logica para editar registros de la base de datos3
            const verificadorAntiguaClave: boolean = await bcrypt.compare(claveActual, user.password);
            if (!verificadorAntiguaClave){
                res.status(401).json({message: "La contraseña actual registrada no coincide con la enviada "})
            }
            const usuarioActualizado = await prisma.usuario.update({
                where: { id: Number(user.id) },
                data: {
                    ...user,
                    name : nuevoName,
                    emailPrincipal : nuevoEmail === 'elmismo' ? user.emailPrincipal : nuevoEmail,
                    emailList : listaActualizada,
                    password: nuevaPassword === "lamisma" ? user.password : await bcrypt.hash(nuevaPassword, numeroSaltos),
                    
                },
                });


            res.status(200).json({message: 'Usuario actualizado con exito'})

          } catch (error) {
            res.status(500).json({ message: "Ocurrio un error inesperado al actualizar usuario: ",error});
          }
    }
    
    else {
        res.status(405).json({message: 'Metodo no permitido'})
    }
}




