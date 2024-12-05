import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { searchDockerImages } from '../../../api/containers';

interface ImageSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ImageSearch({ value, onChange }: ImageSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchImages = async () => {
      if (!searchTerm) return;
      setIsLoading(true);
      try {
        const images = await searchDockerImages(searchTerm);
        setResults(images);
      } catch (error) {
        console.error('Image arama hatası:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchImages, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Image adı"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-1 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Docker Image Ara
            </Dialog.Title>

            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Image adı ara..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4"
            />

            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-4">Yükleniyor...</div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map(image => (
                    <button
                      key={image}
                      onClick={() => {
                        onChange(image);
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                    >
                      {image}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {searchTerm ? 'Sonuç bulunamadı' : 'Image aramak için yazın'}
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
