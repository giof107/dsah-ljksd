import { useState } from 'react';
import { FolderIcon, DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listFiles, readFile, writeFile, deleteFile } from '../../../api/files';

interface FileManagerProps {
  containerId: string;
}

export default function FileManager({ containerId }: FileManagerProps) {
  const [pathHistory, setPathHistory] = useState<string[]>(['/']);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const currentPath = pathHistory[currentPathIndex];
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState('');
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useQuery(
    ['files', containerId, currentPath],
    () => listFiles(containerId, currentPath)
  );

  const { mutate: saveFile } = useMutation(
    () => writeFile(containerId, selectedFile!, fileContent),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['files', containerId, currentPath]);
      }
    }
  );

  const { mutate: removeFile } = useMutation(
    (path: string) => deleteFile(containerId, path),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['files', containerId, currentPath]);
      }
    }
  );

  const handleFileClick = async (path: string) => {
    try {
      const content = await readFile(containerId, path);
      setSelectedFile(path);
      setFileContent(content);
    } catch (error) {
      console.error('Dosya okuma hatası:', error);
      alert('Dosya okunamadı. Binary dosya olabilir veya erişim izni olmayabilir.');
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      saveFile();
    }
  };

  const handleBack = () => {
    if (currentPath === '/') return;
    
    const pathParts = currentPath.split('/').filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.length === 0 ? '/' : `/${pathParts.join('/')}/`;
    
    // Yeni path'i history'ye ekle
    setPathHistory(prev => [...prev.slice(0, currentPathIndex), newPath]);
    setCurrentPathIndex(prev => prev);
    setCurrentPath(newPath);
    
    // Seçili dosyayı ve içeriğini temizle
    setSelectedFile(null);
    setFileContent('');
  };

  const handleForward = (newPath: string) => {
    setPathHistory(prev => [...prev.slice(0, currentPathIndex + 1), newPath]);
    setCurrentPathIndex(prev => prev + 1);
    
    // Seçili dosyayı ve içeriğini temizle
    setSelectedFile(null);
    setFileContent('');
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded-lg p-4">
        <div className="mb-4 flex items-center space-x-2">
          <button 
            onClick={handleBack}
            disabled={currentPath === '/'}
            className={`px-2 py-1 rounded ${
              currentPath === '/' 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Geri
          </button>
          <div className="flex-1 px-3 py-1 bg-gray-50 rounded text-gray-600 overflow-x-auto">
            {currentPath}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-1">
            {files?.map(file => (
              <div 
                key={file.name}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => {
                  if (file.isDirectory) {
                    const newPath = `${currentPath}${file.name}/`;
                    handleForward(newPath);
                  } else {
                    handleFileClick(`${currentPath}${file.name}`);
                  }
                }}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {file.isDirectory ? (
                    <FolderIcon className="h-5 w-5 text-blue-500" />
                  ) : (
                    <DocumentIcon className="h-5 w-5 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {file.size} - {file.modifiedAt}
                    </p>
                  </div>
                </div>
                {!file.isDirectory && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
                        removeFile(`${currentPath}${file.name}`);
                      }
                    }}
                    className="ml-2 p-1 text-red-600 hover:text-red-700 rounded hover:bg-red-50"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{selectedFile}</h3>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Kaydet
            </button>
          </div>
          <textarea
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            className="w-full h-[500px] font-mono text-sm border rounded p-2"
          />
        </div>
      )}
    </div>
  );
}