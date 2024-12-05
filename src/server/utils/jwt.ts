import { SignJWT, jwtVerify } from 'jose';
import { User } from '../../types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

const JWT_ISSUER = 'docker-panel';
const JWT_AUDIENCE = 'docker-panel-users';

export async function generateToken(user: User): Promise<string> {
  const token = await new SignJWT({
    id: user.id,
    username: user.username,
    role: user.role,
    permissions: user.permissions,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return payload as User;
  } catch (error) {
    throw new Error('Invalid token');
  }
}