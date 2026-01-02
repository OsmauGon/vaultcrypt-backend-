
import jwt from 'jsonwebtoken'
import { Cuenta } from '../types/accounts';
import { verificarToken } from '../utils/tokenverificator';
import prisma from '../lib/prisma';
import { decrypt, encrypt } from '../utils/encyptMannager';
import { authMiddleware, verifyAndGetUser } from '../utils/authMiddleware';
import {Request, Response} from 'express'



export default async function accountsHandler(req: Request, res: Response){
    if(req.method === 'POST'){//listo
        try{
            const { 
                userId,
                userName,
                userEmail,
                serviceName,
                serviceUrl,
                servicePassword,
                serviceType,
                serviceDescription,
            } = req.body;
            
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
              return res.status(401).json({ error: "Token no enviado" });
            }
            const token = authHeader.split(" ")[1];
            const { id, role } = await verifyAndGetUser(token);
            if(id !== userId) {
                res.status(403).json({message: "Recurso prohibido: Error en los IDs"})
            }
            if(!serviceName || !serviceDescription || serviceType){
            res.status(400).json({message: 'Faltan campos requeridos'})
            return
            }

           const nuevaCuenta = await prisma.cuenta.create({
            data: {
                userId,
                userName,
                userEmail: encrypt(userEmail),
                serviceName,
                serviceUrl,
                servicePassword: encrypt(servicePassword),
                serviceType,
                serviceDescription: encrypt(serviceDescription),
                            
            }
           })
            
            
            
            
            res.status(200).json({message: 'Cuenta creada con exito', cuenta: nuevaCuenta.id})
        } catch (error) {
            res.status(500).json({ message: 'Error interno al crear la cuenta', error});
        }

    }
    else if(req.method === 'GET'){//listo
        const { idDueño } = req.query;
        if (!idDueño) {
            return res.status(400).json({ error: "idDueño requerido" });
            }
        try {
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
              return res.status(401).json({ error: "Token no enviado" });
            }
            const token = authHeader.split(" ")[1];
            const { id, role } = await verifyAndGetUser(token);
            if(id !== Number(idDueño)) {
                res.status(403).json({message: "Recurso prohibido: Error en los IDs"})
            }




            
            const cuentas = await prisma.cuenta.findMany({where: { userId: Number(idDueño) }});
            if (!cuentas || cuentas.length === 0) {
                return res.status(404).json({ error: "No se encontraron cuentas" });
            }
            const cuentasDesencriptadas = cuentas.map((c: Cuenta) => ({
                ...c,
                userEmail: decrypt(c.userEmail),
                servicePassword: decrypt(c.servicePassword),
                serviceDescription: decrypt(c.serviceDescription),
                }));
            return res.status(200).json(cuentasDesencriptadas);
            }
            catch(error){
                res.status(500).json({message: "Ocurrio un error durante la obtencion de cuentas"})
            }
        }
    /* else if(req.method === 'PUT'){
        const authHeader = req.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(401).json({message: 'Token no proporcionado'})
            return
        }
        const token = authHeader.split(' ')[1]
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
            const index = usuariosSimualdos.findIndex(u => u.email === decoded.email)
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
            if(nuevoEmail) usuariosSimualdos[index].email = nuevoEmail
            if(nuevaPassword){
                const hashed = await bcrypt.hash(nuevaPassword, 18)
                usuariosSimualdos[index].password = hashed
            }
            res.status(200).json({message: 'Usuario actualizado con exito'})

        } catch {
            res.status(401).json({ message: 'Token inválido o expirado' });
        }
    } */
    else {
        res.status(405).json({message: 'Metodo no permitido'})
    }
}