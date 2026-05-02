'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AllocationChartProps {
  data: { category: string; value: number; color: string }[];
}

export function AllocationChart({ data }: AllocationChartProps) {
  // Datos de ejemplo si no hay datos reales
  const chartData = data.length > 0 ? data : [
    { category: 'Comida', value: 35, color: '#4F46E5' },
    { category: 'Transporte (SUBE)', value: 15, color: '#22c55e' },
    { category: 'Servicios', value: 20, color: '#f59e0b' },
    { category: 'Entretenimiento', value: 15, color: '#ec4899' },
    { category: 'Otros', value: 15, color: '#6b7280' },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="category"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString('es-AR')}`, 'Gastado']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => (
              <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
