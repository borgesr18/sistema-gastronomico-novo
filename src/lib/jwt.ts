import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'secreta123456';
const encoder = new TextEncoder();

export async function signJwt(payload: object) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encoder.encode(secretKey));
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secretKey));
    return payload;
  } catch (error) {
    console.error('Erro ao verificar JWT:', error);
    return null;
  }
}
