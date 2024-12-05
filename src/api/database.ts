import axios from 'axios';
import { DatabaseInfo, DatabaseUser, CreateDatabasePayload, CreateUserPayload, GrantPrivilegesPayload } from '../types/database';

const api = axios.create({
    baseURL: '/api/databases',
});

export async function listDatabases(): Promise<DatabaseInfo[]> {
    const response = await api.get('/');
    return response.data;
}

export async function createDatabase(payload: CreateDatabasePayload): Promise<void> {
    await api.post('/', payload);
}

export async function deleteDatabase(name: string): Promise<void> {
    await api.delete(`/${name}`);
}

export async function listUsers(): Promise<DatabaseUser[]> {
    const response = await api.get('/users');
    return response.data;
}

export async function createUser(payload: CreateUserPayload): Promise<void> {
    await api.post('/users', payload);
}

export async function deleteUser(username: string, host: string = '%'): Promise<void> {
    await api.delete(`/users/${username}/${encodeURIComponent(host)}`);
}

export async function grantPrivileges(payload: GrantPrivilegesPayload): Promise<void> {
    const { username, database, privileges, host = '%' } = payload;
    await api.post(`/users/${username}/databases/${database}/grant/${encodeURIComponent(host)}`, { privileges });
}

export async function revokePrivileges(username: string, database: string, host: string = '%'): Promise<void> {
    await api.post(`/users/${username}/databases/${database}/revoke/${encodeURIComponent(host)}`);
}