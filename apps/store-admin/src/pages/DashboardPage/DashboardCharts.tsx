import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const baseOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index' as const, intersect: false },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#667085' } },
    y: { grid: { color: '#EEF2F6' }, ticks: { color: '#667085' } },
  },
};

export function RevenueLineChart({ labels, values }: { labels: string[]; values: number[] }) {
  return (
    <div style={{ height: 220 }}>
      <Line
        options={baseOptions}
        data={{
          labels,
          datasets: [
            {
              label: 'Revenue',
              data: values,
              borderColor: '#1096b5',
              backgroundColor: 'rgba(16,150,181,0.12)',
              fill: true,
              tension: 0.35,
              pointRadius: 2,
            },
          ],
        }}
      />
    </div>
  );
}

export function FunnelBarChart({ labels, values }: { labels: string[]; values: number[] }) {
  return (
    <div style={{ height: 220 }}>
      <Bar
        options={baseOptions}
        data={{
          labels,
          datasets: [
            {
              label: 'Rate',
              data: values,
              backgroundColor: 'rgba(16,150,181,0.18)',
              borderColor: '#1096b5',
              borderWidth: 1,
              borderRadius: 8,
            },
          ],
        }}
      />
    </div>
  );
}
