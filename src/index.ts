import express from 'express';
import dotenv from 'dotenv';
import usuarioHandler from './api/usuario';
import handlerPostLogin from './api/login';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/api/usuario', usuarioHandler);
app.post('/api/login', handlerPostLogin);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});