import { JwtPayload } from '../utils/authMiddleware'; // o donde tengas tu tipo

/*
En la funcion ultimateAuthMiddleware del archivo authMiddleware.ts en un momento req.user = {***}. Como user no forma parte de lo que el tipado obtenido de express le da a res :Response, typescript se queja. Para resolverlo, en este archivo extendimos el tipado de req. Esto le dice a TypeScript: “cada Request puede tener un campo user con id, role y opcionalmente email”.
s
*/


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
        email?: string;
      };
    }
  }
}