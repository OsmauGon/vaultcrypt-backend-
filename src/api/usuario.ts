import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IncomingMessage, ServerResponse } from 'http';

export interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
  cookies: { [key: string]: string };
}

export interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (body: any) => void;
}


export default async function handlerPost(req: VercelRequest, res: VercelResponse) {
    if(req.method !== 'POST') {
        res.status(405).json({message: 'Metodo no permitido'})
    }
    const {email, password} = req.body;
    if(!email || !password ){
        res.status(400).json({ message: 'Faltan campos requeridos' });
        return;
    }
    try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Simulación de almacenamiento (en producción usarías una DB)
    const usuario = {
      email,
      password: hashedPassword,
      creado: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      usuario
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }

}