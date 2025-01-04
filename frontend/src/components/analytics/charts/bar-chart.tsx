"use client";

import {
  BarChart as RechartsChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarChartProps {
  data: Array<{ name: string; count: number }>;
  title: string;
}

export function BarChart({ data, title }: BarChartProps) {
  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="hsl(var(--primary))" />
        </RechartsChart>
      </ResponsiveContainer>
    </div>
  );
}
