import { createConnection } from '../config/database';
import { DatabaseInfo, CreateDatabasePayload, DatabaseUser } from '../../types/database';

export class DatabaseService {
  async listDatabases(): Promise<DatabaseInfo[]> {
    const connection = await createConnection();
    try {
      // Get databases
      const [databases] = await connection.query('SHOW DATABASES');
      const databaseList = (databases as any[]).map(row => row.Database);

      // Get detailed info for each database
      const databaseInfo: DatabaseInfo[] = [];
      for (const dbName of databaseList) {
        if (['information_schema', 'mysql', 'performance_schema', 'sys'].includes(dbName)) {
          continue;
        }

        const [collationResult] = await connection.query(
            'SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?',
            [dbName]
        );
        const collationInfo = (collationResult as any[])[0];

        const [tablesResult] = await connection.query(
            'SELECT COUNT(*) as count FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?',
            [dbName]
        );
        const tableCount = (tablesResult as any[])[0].count;

        const [sizeResult] = await connection.query(
            'SELECT SUM(data_length + index_length) as size FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?',
            [dbName]
        );
        const size = (sizeResult as any[])[0].size || 0;

        databaseInfo.push({
          name: dbName,
          size,
          tables: tableCount,
          charset: collationInfo.DEFAULT_CHARACTER_SET_NAME,
          collation: collationInfo.DEFAULT_COLLATION_NAME,
        });
      }

      return databaseInfo;
    } finally {
      await connection.end();
    }
  }

  async createDatabase(payload: CreateDatabasePayload): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.beginTransaction();

      // Create database with specified charset and collation
      const createDbQuery = `CREATE DATABASE \`${payload.name}\`
        ${payload.charset ? `CHARACTER SET ${payload.charset}` : ''}
        ${payload.collation ? `COLLATE ${payload.collation}` : ''}`;
      await connection.query(createDbQuery);

      // Create user if specified
      if (payload.user) {
        const { username, password, host = '%' } = payload.user;
        await connection.query(
            'CREATE USER ?@? IDENTIFIED BY ?',
            [username, host, password]
        );

        // Grant privileges to the new user
        await connection.query(
            'GRANT ALL PRIVILEGES ON ??.* TO ?@?',
            [payload.name, username, host]
        );

        await connection.query('FLUSH PRIVILEGES');
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }
  }

  async deleteDatabase(name: string): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.query('DROP DATABASE ??', [name]);
    } finally {
      await connection.end();
    }
  }

  async listUsers(): Promise<DatabaseUser[]> {
    const connection = await createConnection();
    try {
      const [rows] = await connection.query(`
        SELECT user, host, GROUP_CONCAT(DISTINCT privilege_type) as privileges
        FROM information_schema.user_privileges
        WHERE grantee NOT LIKE 'root%'
        GROUP BY user, host
      `);

      return (rows as any[]).map(row => ({
        username: row.user,
        host: row.host,
        privileges: row.privileges.split(','),
      }));
    } catch {
      return [];
    } finally {
      await connection.end();
    }
  }

  async createUser(username: string, password: string, host: string = '%'): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.query(
          'CREATE USER ?@? IDENTIFIED BY ?',
          [username, host, password]
      );
    } finally {
      await connection.end();
    }
  }

  async deleteUser(username: string, host: string = '%'): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.query('DROP USER ?@?', [username, host]);
    } finally {
      await connection.end();
    }
  }

  async grantPrivileges(
      username: string,
      database: string,
      privileges: string[],
      host: string = '%'
  ): Promise<void> {
    const connection = await createConnection();
    try {
      const privilegeStr = privileges.join(', ');
      await connection.query(
          `GRANT ${privilegeStr} ON ??.* TO ?@?`,
          [database, username, host]
      );
      await connection.query('FLUSH PRIVILEGES');
    } finally {
      await connection.end();
    }
  }

  async revokePrivileges(
      username: string,
      database: string,
      host: string = '%'
  ): Promise<void> {
    const connection = await createConnection();
    try {
      await connection.query(
          'REVOKE ALL PRIVILEGES ON ??.* FROM ?@?',
          [database, username, host]
      );
      await connection.query('FLUSH PRIVILEGES');
    } finally {
      await connection.end();
    }
  }
}