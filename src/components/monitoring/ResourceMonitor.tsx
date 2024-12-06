import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { ContainerStats } from '../../types';
import { formatBytes, formatPercentage } from '../../utils/format';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface ResourceMonitorProps {
    containerId: string;
    stats: ContainerStats[];
}

export default function ResourceMonitor({ containerId, stats }: ResourceMonitorProps) {
    const [timeLabels, setTimeLabels] = useState<string[]>([]);
    const [cpuData, setCpuData] = useState<number[]>([]);
    const [memoryData, setMemoryData] = useState<number[]>([]);

    useEffect(() => {
        const maxDataPoints = 20;
        const currentTime = new Date();

        setTimeLabels(prev => {
            const newLabels = [...prev, currentTime.toLocaleTimeString()];
            return newLabels.slice(-maxDataPoints);
        });

        setCpuData(prev => {
            const newData = [...prev, stats[stats.length - 1]?.cpu_usage || 0];
            return newData.slice(-maxDataPoints);
        });

        setMemoryData(prev => {
            const newData = [...prev, stats[stats.length - 1]?.memory_usage || 0];
            return newData.slice(-maxDataPoints);
        });
    }, [stats]);

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        animation: {
            duration: 0,
        },
    };

    const cpuChartData = {
        labels: timeLabels,
        datasets: [
            {
                label: 'CPU Usage',
                data: cpuData,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const memoryChartData = {
        labels: timeLabels,
        datasets: [
            {
                label: 'Memory Usage',
                data: memoryData,
                borderColor: 'rgb(153, 102, 255)',
                tension: 0.1,
            },
        ],
    };

    const latestStats = stats[stats.length - 1];

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Usage</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-sm text-gray-500">Current CPU Usage</p>
                    <p className="text-2xl font-semibold">
                        {formatPercentage(latestStats?.cpu_usage || 0)}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Current Memory Usage</p>
                    <p className="text-2xl font-semibold">
                        {formatBytes(latestStats?.memory_usage || 0)}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">CPU History</h4>
                    <Line options={chartOptions} data={cpuChartData} />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Memory History</h4>
                    <Line options={chartOptions} data={memoryChartData} />
                </div>
            </div>
        </div>
    );
}