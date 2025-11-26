import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  email: string;
}

export function verificarToken(authorizationHeader?: string): TokenPayload | {emailPrincipal: string} {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new Error('Token no proporcionado');
  }

  const token = authorizationHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload | {emailPrincipal: string};

  /* if (!decoded?.id) {
    throw new Error('Token inválido: falta ID');
  } */

  return decoded;
}