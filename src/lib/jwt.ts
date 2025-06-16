import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'senha-secreta-padrao';
const encoder = new TextEncoder();

export async function signJwt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(encoder.encode(secretKey));
}

export async function getJwtUser(token: string) {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secretKey));
    return payload;
  } catch (error) {
    return null;
  }
}
