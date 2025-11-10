import jwt, { type SignOptions, type Secret } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as Secret;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as Secret;

export function signAccess(payload: object, expiresIn: string | number = "15m"): string {
  const options: SignOptions = { expiresIn: expiresIn as number };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function signRefresh(payload: object, expiresIn: string | number = "7d"): string {
  const options: SignOptions = { expiresIn: expiresIn as number };
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
}

export function verifyAccess(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefresh(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}
