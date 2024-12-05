import { createConnection } from '../config/database';
import { generateToken } from '../utils/jwt';
import { User } from '../../types';
import bcrypt from 'bcryptjs';

export class AuthService {
  async login(username: string, password: string): Promise<string> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      const user = (rows as any[])[0];
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      const userData: User = {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions.split(','),
      };

      return generateToken(userData);
    } finally {
      await connection.end();
    }
  }

  async register(
    username: string,
    password: string,
    role: string = 'user'
  ): Promise<void> {
    const connection = await createConnection();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.execute(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hashedPassword, role]
      );
    } finally {
      await connection.end();
    }
  }

  async validateToken(token: string): Promise<User> {
    const user = await verifyToken(token);
    return user;
  }
}