import express from 'express';
import dotenv from 'dotenv';
import usersHandler from './api/usuario';
import loginHandler from './api/login';
import accountsHandler from './api/cuenta';
import cors from 'cors'
import { VercelRequest, VercelResponse } from '@vercel/node';
import { usersDelete, usersGlobalGet, usersIndividualGet, usersLoginPost, usersPut, usersRegisterPost } from './api/usersmannager';
import { accountsDelete, accountsGlobalGet, accountsIndividualGet } from './api/accountsmannager';
import { verificacionDEsolicitante } from './utils/mannagerVerificator';

dotenv.config();
const app = express();
app.use(express.json());

//configuracion de CORS
app.use(cors({
  origin:[//dominios permitidos
    "http://localhost:3000",
    "http://localhost:5173", //dominio generico del Vite
    "https://vaultcrypt.vercel.app",//dominio generico de un despliegue en vercel
    "https://vaultcrypt.netlify.app",//dominio generico de un despliegue en netlify
    "https://vaultcrypt.netlify.app",//aqui desplegue el front-end
      ],//dominios permitidos
  methods:["GET","POST","PUT","DELETE"],
  credentials: true //si usas cookies o auth headers
}))

//app.post('/api/usuario', userRegister);
app.post('/api/usuario', usersHandler);
app.get('/api/usuario',usersHandler)
app.put('/api/usuario',usersHandler)
app.post('/api/login', loginHandler);

app.post('/api/cuentas',accountsHandler)
app.get('/api/cuentas',accountsHandler)

//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&6
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&6
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&6
app.get('/api/usersmannager',usersGlobalGet)
app.get('/api/usersmannager/:id',verificacionDEsolicitante,usersIndividualGet)
app.post('/api/usersmannager',verificacionDEsolicitante,usersRegisterPost)
app.post('/api/usersmannager/login',verificacionDEsolicitante,usersLoginPost)
app.put('/api/usersmannager/:id',usersPut)
//app.put('/api/usersmannager/:id',verificacionDEsolicitante,usersPut)
app.delete('/api/usersmannager/:id',verificacionDEsolicitante,usersDelete)
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&6
app.get('/api/accountsmannager',verificacionDEsolicitante,accountsGlobalGet)
app.get('/api/accountsmannager/:id',verificacionDEsolicitante,accountsIndividualGet)
app.delete('/api/accountsmannager/:id',verificacionDEsolicitante,accountsDelete)
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&6
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&6
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&6



const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
//Descomentar cuando estemos probando localmente. Desplegar app.listen en vercel denerara problemas

// 🚀 Exportar como handler para Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
