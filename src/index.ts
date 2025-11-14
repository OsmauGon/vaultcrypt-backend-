import express from 'express';
import dotenv from 'dotenv';
import usuarioHandler from './api/usuario';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/api/usuario', usuarioHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});