import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from 'bcrypt'
import { verifyAndGetUser } from "../utils/authMiddleware";
import { verificarToken } from "../utils/tokenverificator";


// Endpoint POST para crear un usuario

const numeroSaltos = parseInt(process.env.HASH_ROUNDS!)
export const adminorder = async (req :Request, res :Response) => {
  console.clear()
  console.time()
  const authHeader = req.headers["authorization"];
            if (!authHeader) {
              return res.status(401).json({ error: "Token no enviado" });
            }
        
  const token = authHeader.split(" ")[1];
  if(!token || token !== 'absoluteadmin'){
    res.status(401).json({message: "falta el token de administrador absoluto"})
    return
  }
  //res.json({ok: true}) 
  console.timeLog()
  if(req.method === "POST"){//crear un nuevo usuario
    try {
      const { name, emailPrincipal, password, secretWord, role } = req.body;
      const nuevoUsuario = await prisma.usuario.create({
          data: { name, emailPrincipal, password, secretWord, role }
      })

      res.status(201).json(nuevoUsuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear usuario" });
    }
  }
  else if (req.method === "GET"){//get individual
    const { user } = req.query;
    try {
    let searchresults;
    if (user){
        searchresults = await prisma.usuario.findUnique({where: {id:Number(user)}})
    }
    else{
        searchresults = await prisma.usuario.findMany()
    }
    res.status(200).json(searchresults)
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message });
    }
  }
  else if (req.method === "DELETE"){//borrar usuario
    const { borrar } = req.query;
        if (!borrar) {
            return res.status(400).json({ error: "idDueño requerido" });
            }
    try {
    await prisma.usuario.delete({where: {id:Number(borrar)}})
    res.status(200).json({message: "Usuario eliminado"})
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message });
    }
  }
  else if(req.method === 'PUT'){//editar usuario. PRECAUSION
        //aunque edites al usuario todos los registro que hizo se encriptaron con su palabra secreta. Ya no podra ver sus credenciales anteriores
        try {
            const { userNum } = req.query;
            if (!userNum) {
                return res.status(400).json({ error: "idDueño usuario" });
            }
            const {
                    role: nuevoRol,
                    emailPrincipal: nuevoEmail, 
                    password: nuevaPassword, 
                    emailList :listaActualizada, 
                    name: nuevoName,
                    secretWord: nuevaSecretWord
                } = req.body;
            if(!nuevaSecretWord || !nuevoRol || !nuevaPassword || !nuevaPassword || !nuevoName || !listaActualizada){
                
                res.status(400).json({message: 'Faltan datos para actualizar'})
                return
            }
            //aqui va la logica para editar registros de la base de datos3
            const user = await prisma.usuario.findUnique({where: {id:Number(userNum)}})
            const usuarioActualizado = await prisma.usuario.update({
                where: { id: Number(user) },
                data: {
                    ...user,
                    name : nuevoName,
                    emailPrincipal : nuevoEmail,
                    emailList : listaActualizada,
                    password: await bcrypt.hash(nuevaPassword, numeroSaltos),
                    secretWord: await bcrypt.hash(nuevaSecretWord, numeroSaltos)
                },
                });


            res.status(200).json({message: 'Usuario actualizado con exito'})

          } catch (error) {
            res.status(500).json({ message: "Ocurrio un error inesperado al actualizar usuario: ",error});
          }
    }
  
  console.timeEnd()
}
