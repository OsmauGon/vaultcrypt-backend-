import express from 'express';
import dotenv from 'dotenv';
import usersHandler from './api/usuario';
import loginHandler from './api/login';
import accountsHandler from './api/cuenta';

dotenv.config();
const app = express();
app.use(express.json());

app.post('/api/usuario', usersHandler);
app.get('/api/usuario',usersHandler)
app.put('/api/usuario',usersHandler)
app.post('/api/login', loginHandler);

app.post('/api/cuentas',accountsHandler)
app.get('/api/cuentas',accountsHandler)

const PORT = process.env.PORT || 3000;
/* app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
Descomentar cuando estemos probando localmente. Desplegar app.listen en vercel denerara problemas
*/