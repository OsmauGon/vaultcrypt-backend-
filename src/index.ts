import express from 'express';
import dotenv from 'dotenv';
import usersHandler from './api/usuario';
import loginHandler from './api/login';
import accountsHandler from './api/cuenta';
import cors from 'cors'
import { VercelRequest, VercelResponse } from '@vercel/node';

dotenv.config();
const app = express();
app.use(express.json());

//configuracion de CORS
app.use(cors({
  origin:[//dominios permitidos
    "http://localhost:3000",
    "https://vaultcrypt.vercel.app",//dominio generico de un despliegue en vercel
    "https://vaultcrypt.netlify.app",//dominio generico de un despliegue en netlify
    "https://vaultcrypt.netlify.app",//aqui desplegue el front-end
      ],//dominios permitidos
  methods:["GET","POST","PUT","DELETE"],
  credentials: true //si usas cookies o auth headers
}))

app.post('/api/usuario', usersHandler);
app.get('/api/usuario',usersHandler)
app.put('/api/usuario',usersHandler)
app.post('/api/login', loginHandler);

app.post('/api/cuentas',accountsHandler)
app.get('/api/cuentas',accountsHandler)


/*
const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
//Descomentar cuando estemos probando localmente. Desplegar app.listen en vercel denerara problemas
*/
// 🚀 Exportar como handler para Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
