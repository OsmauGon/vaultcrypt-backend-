import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IncomingMessage, ServerResponse } from 'http';
import { Cuenta } from '../types/accounts';
import { v4 as uuidv4 } from 'uuid';
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

export default async function accountsHandler(req: VercelRequest, res: VercelResponse){
    if(req.method === 'POST'){
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


            //aqui va la logica para editar registros de la base de datos
            const nuevaCuenta = {
                            id: uuidv4(), // genera un ID único//borrar cuando la logica DB este
                            userId: userId,
                            userName: userName,
                            userEmail: await bcrypt.hash(userEmail, 18),
                            serviceName: serviceName,
                            serviceUrl: serviceUrl,
                            servicePassword: await bcrypt.hash(servicePassword, 18),
                            serviceType: serviceType,
                            serviceDescription: serviceDescription,
                            created: new Date().toISOString()//borrar cuando la logica DB este
                        }
            cuentasSimualdas.push(nuevaCuenta)//reemplazar por await prisma.create()
            res.status(200).json({message: 'Cuenta creada con exito', cuenta: nuevaCuenta})
        } catch (error: any) {
            res.status(500).json({ message: 'Error interno al crear la cuenta', error: error.message });
        }

    }
     else if(req.method === 'GET'){
        
        try {
            const decoded = verificarToken(req.headers['authorization']) as { email: string };
            if (!decoded) {
                console.log("errorcito")
                throw new Error('Token inválido');
            }


            const { idDueño } = req.query;
            console.log(idDueño)
            if (!idDueño || typeof idDueño !== 'string') {
                res.status(400).json({ message: 'Falta el parámetro idDueño' });
                return;
            }

            const cuentasDelUsuario = cuentasSimualdas.filter(cuenta => cuenta.userId === Number(idDueño));
            //use Number(idDueño) porque el numero obtenido de la url es un string y causa conflicto con los
            //registros simulados, asumo que habra problema con el id UUID pero veremos mas adelante
            if (cuentasDelUsuario.length === 0) {
            res.status(200).json({ cuentas: [], message: `No se encontraron cuentas para este usuario${typeof idDueño}` });
            return;
            }

            res.status(200).json({ cuentas: cuentasDelUsuario });
            

        } catch (error){
            res.status(401).json({message: 'Token invalido o expirado', error})
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