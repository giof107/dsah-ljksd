import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { DatabaseInfo, DatabaseUser } from '../types';

export default function Databases() {
  const { data: databases, isLoading: databasesLoading, error: databasesError } = 
    useQuery<DatabaseInfo[]>(['databases'], fetchDatabases);
    
  const { data: users, isLoading: usersLoading, error: usersError } = 
    useQuery<DatabaseUser[]>(['database-users'], fetchDatabaseUsers);

  if (databasesLoading || usersLoading) {
    return <LoadingSpinner />;
  }

  if (databasesError || usersError) {
    return <ErrorMessage message="Veritabanı bilgileri yüklenirken hata oluştu" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Veritabanı Yönetimi</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Veritabanı Oluştur
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Veritabanları</h2>
            <div className="space-y-4">
              {databases?.map((db) => (
                <div
                  key={db.name}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{db.name}</h3>
                    <p className="text-sm text-gray-500">
                      Boyut: {formatBytes(db.size)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-700">
                      Yönet
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Kullanıcılar</h2>
            <div className="space-y-4">
              {users?.map((user) => (
                <div
                  key={`${user.username}@${user.host}`}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{user.username}</h3>
                    <p className="text-sm text-gray-500">Host: {user.host}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-indigo-600 hover:text-indigo-700">
                      İzinler
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

async function fetchDatabases(): Promise<DatabaseInfo[]> {
  const response = await fetch('/api/databases');
  if (!response.ok) {
    throw new Error('Veritabanları yüklenemedi');
  }
  return response.json();
}

async function fetchDatabaseUsers(): Promise<DatabaseUser[]> {
  const response = await fetch('/api/databases/users');
  if (!response.ok) {
    throw new Error('Veritabanı kullanıcıları yüklenemedi');
  }
  return response.json();
}
