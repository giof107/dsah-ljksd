export interface DatabaseInfo {
  name: string;
  size: number;
  tables: number;
  charset: string;
  collation: string;
}

export interface DatabaseUser {
  username: string;
  host: string;
  privileges: string[];
}

export interface CreateDatabasePayload {
  name: string;
  charset?: string;
  collation?: string;
  user?: {
    username: string;
    password: string;
    host?: string;
  };
}

export interface CreateUserPayload {
  username: string;
  password: string;
  host?: string;
}

export interface GrantPrivilegesPayload {
  username: string;
  database: string;
  privileges: string[];
  host?: string;
}