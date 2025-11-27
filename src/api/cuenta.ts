import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IncomingMessage, ServerResponse } from 'http';
import { Cuenta } from '../types/accounts';
import { v4 as uuidv4 } from 'uuid';
import { verificarToken } from '../utils/tokenverificator';
import prisma from '../lib/prisma';
import { decrypt, encrypt } from '../utils/encyptMannager';
import { authMiddleware } from '../utils/authMiddleware';
import {Request, Response} from 'express'

//Simulacion de base de datos en memoria:
const cuentasSimualdas :Cuenta[] = [
    {
    id: 1,
    userId: 1,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 2,
    userId: 2,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 3,
    userId: 3,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 4,
    userId: 4,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 5,
    userId: 5,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 6,
    userId: 1,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 7,
    userId: 2,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 8,
    userId: 3,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 9,
    userId: 4,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 10,
    userId: 5,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 11,
    userId: 1,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 12,
    userId: 2,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 13,
    userId: 3,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 14,
    userId: 4,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    },
    {
    id: 15,
    userId: 5,
    userName: "Maurix",
    userEmail: "mauricio7892@hotmail.com",
    serviceName: "Clarin",
    serviceUrl: "https://www.clarin.com.ar",
    servicePassword: "contraseña",
    serviceType: 'Otros',
    serviceDescription: "balblablabklalbablbalbalbalbalablbasjndasobddfsnklsfngoiafshinjdfn",
    created: "123456789101112131415"
    }
];

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
            
            const decoded = verificarToken(req.headers['authorization']) as { email: string };
            if (!decoded) throw new Error('Token inválido');

            if(!userEmail || !userName || !serviceName || !servicePassword || !serviceUrl || !serviceDescription){
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
        } catch (error: any) {
            res.status(500).json({ message: 'Error interno al crear la cuenta', error: error.message });
        }

    }
    else if(req.method === 'GET'){
        //Aqui vamos a poner el middleware authMiddleware
        await new Promise((resolve, reject) =>
            authMiddleware(req, res, (err?: any) => (err ? reject(err) : resolve(null)))
        );
        //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET!);
        } catch (error: any) {
        return res.status(401).json({ error: "Token inválido o expirado desde cuentas" });
        }

        // En Vercel el parámetro dinámico viene en query
        const { idDueño } = req.query;
        if (!idDueño) {
            return res.status(400).json({ error: "idDueño requerido" });
            }

        const cuentas = await prisma.cuenta.findMany({
            where: { userId: Number(idDueño) },
            });

        if (!cuentas || cuentas.length === 0) {
            return res.status(404).json({ error: "No se encontraron cuentas" });
        }

        const cuentasDesencriptadas = cuentas.map((c) => ({
            ...c,
            userEmail: decrypt(c.userEmail),
            servicePassword: decrypt(c.servicePassword),
            serviceDescription: decrypt(c.serviceDescription),
            }));

        return res.status(200).json(cuentasDesencriptadas);
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