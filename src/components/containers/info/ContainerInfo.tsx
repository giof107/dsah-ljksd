import { formatDate } from '../../../utils/format';

interface ContainerInfoProps {
  name: string;
  image: string;
  created: string;
  ports: Record<string, string[]>;
}

export default function ContainerInfo({ name, image, created, ports }: ContainerInfoProps) {
  return (
    <div>
      <h4 className="text-lg font-medium text-gray-900">{name}</h4>
      <p className="text-sm text-gray-500">{image}</p>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Ports:</span>
          <div className="mt-1">
            {Object.entries(ports).map(([internal, external]) => (
              <div key={internal}>
                {internal} → {external.join(', ')}
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="text-gray-500">Created:</span>
          <div className="mt-1">{formatDate(created)}</div>
        </div>
      </div>
    </div>
  );
}