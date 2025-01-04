"use client";

import { CHART_COLORS } from "@/lib/constants/charts";
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  title: string;
}

export function PieChart({ data, title }: PieChartProps) {
  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsChart>
      </ResponsiveContainer>
    </div>
  );
}
