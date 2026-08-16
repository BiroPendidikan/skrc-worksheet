'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface Props {
  yearData: Record<number, number>;
  subjectData: Record<string, number>;
}

export default function AnalyticsCharts({ yearData, subjectData }: Props) {
  // Ubah ke format array untuk Recharts
  const yearArray = Object.entries(yearData).map(([year, count]) => ({
    name: `Tahun ${year}`,
    value: count,
  }));

  const subjectArray = Object.entries(subjectData).map(([name, count]) => ({
    name,
    value: count,
  }));

  // Jika tiada data, jangan papar carta kosong
  if (yearArray.length === 0 && subjectArray.length === 0) {
    return <p className="text-gray-500">Data tidak mencukupi untuk carta.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Carta Bar Mengikut Tahun */}
      {yearArray.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 className="text-md font-semibold mb-2">Worksheet Mengikut Tahun</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={yearArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" name="Jumlah" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Carta Pai Mengikut Subjek */}
      {subjectArray.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h3 className="text-md font-semibold mb-2">Worksheet Mengikut Subjek</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={subjectArray}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
               label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {subjectArray.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}