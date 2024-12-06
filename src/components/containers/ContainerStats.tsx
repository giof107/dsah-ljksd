import { Container } from '../../types';
import { useContainerStatsContext } from '../../context/ContainerStatsContext';
import { formatBytes, formatPercentage } from '../../utils/format';
import LoadingSpinner from "../shared/LoadingSpinner.tsx";

interface ContainerStatsProps {
  containers: Container[];
}

function getArrowDirection(current: number, previous?: number) {
  if (previous === undefined) return '';
  return current > previous ? '↑' : '↓';
}

export default function ContainerStats({ containers }: ContainerStatsProps) {
  const { stats } = useContainerStatsContext();

  if (Object.keys(stats).length === 0) {
    return (
      <LoadingSpinner />
    );
  }

  const latestStats = containers.map(container => stats[container.id][stats[container.id].length - 1]);
  const previousStats = containers.map(container => stats[container.id][stats[container.id].length - 2]);

  const totalStats = Object.values(latestStats).reduce((acc, curr) => ({
    cpu_usage: acc.cpu_usage + curr.cpu_usage,
    memory_usage: acc.memory_usage + curr.memory_usage,
    network_rx: acc.network_rx + curr.network_rx,
    network_tx: acc.network_tx + curr.network_tx,
    block_read: acc.block_read + curr.block_read,
    block_write: acc.block_write + curr.block_write
  }), {
    cpu_usage: 0,
    memory_usage: 0,
    network_rx: 0,
    network_tx: 0,
    block_read: 0,
    block_write: 0
  });

  const totalPreviousStats = Object.values(previousStats).reduce((acc, curr) => ({
    cpu_usage: acc.cpu_usage + (curr?.cpu_usage || 0),
    memory_usage: acc.memory_usage + (curr?.memory_usage || 0),
    network_rx: acc.network_rx + (curr?.network_rx || 0),
    network_tx: acc.network_tx + (curr?.network_tx || 0),
    block_read: acc.block_read + (curr?.block_read || 0),
    block_write: acc.block_write + (curr?.block_write || 0)
  }), {
    cpu_usage: 0,
    memory_usage: 0,
    network_rx: 0,
    network_tx: 0,
    block_read: 0,
    block_write: 0
  });

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Toplam Kaynak Kullanımı</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">CPU:</span>
            <div className="mt-1">{formatPercentage(totalStats.cpu_usage)}</div>
          </div>
          <div>
            <span className="text-gray-500">Memory:</span>
            <div className="mt-1">{formatBytes(totalStats.memory_usage)}</div>
          </div>
          <div>
            <span className="text-gray-500">Network I/O:</span>
            <div className="mt-1">
              {getArrowDirection(totalStats.network_rx, totalPreviousStats.network_rx)} {formatBytes(totalStats.network_rx)}/s
              <br/>
              {getArrowDirection(totalStats.network_tx, totalPreviousStats.network_tx)} {formatBytes(totalStats.network_tx)}/s
            </div>
          </div>
          <div>
            <span className="text-gray-500">Disk I/O:</span>
            <div className="mt-1">
              {getArrowDirection(totalStats.block_read, totalPreviousStats.block_read)} {formatBytes(totalStats.block_read)}/s
              <br/>
              {getArrowDirection(totalStats.block_write, totalPreviousStats.block_write)} {formatBytes(totalStats.block_write)}/s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}