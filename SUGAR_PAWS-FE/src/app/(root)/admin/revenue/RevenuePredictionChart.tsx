"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatCurrency } from "@/helper/renderNumber";

interface ChartData {
  month: string;
  year: number;
  actualRevenue?: number;
  predictedRevenue?: number;
  orderCount?: number;
}

interface RevenuePredictionChartProps {
  data: ChartData[];
  title: string;
  type?: "line" | "bar" | "area";
}

const RevenuePredictionChart: React.FC<RevenuePredictionChartProps> = ({
  data,
  title,
  type = "area",
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              <span className="font-semibold">
                {entry.name.includes("Revenue")
                  ? formatCurrency(entry.value)
                  : entry.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const chartContent = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="month" stroke="#666" style={{ fontSize: "12px" }} />
        <YAxis
          stroke="#666"
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "14px", paddingTop: "10px" }} />
      </>
    );

    if (type === "area") {
      return (
        <AreaChart {...commonProps}>
          {chartContent}
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          {data[0]?.actualRevenue !== undefined && (
            <Area
              type="monotone"
              dataKey="actualRevenue"
              stroke="#8884d8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorActual)"
              name="Actual Revenue"
            />
          )}
          {data[0]?.predictedRevenue !== undefined && (
            <Area
              type="monotone"
              dataKey="predictedRevenue"
              stroke="#82ca9d"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPredicted)"
              name="Predicted Revenue"
            />
          )}
        </AreaChart>
      );
    }

    if (type === "bar") {
      return (
        <BarChart {...commonProps}>
          {chartContent}
          {data[0]?.actualRevenue !== undefined && (
            <Bar
              dataKey="actualRevenue"
              fill="#8884d8"
              name="Actual Revenue"
              radius={[8, 8, 0, 0]}
            />
          )}
          {data[0]?.predictedRevenue !== undefined && (
            <Bar
              dataKey="predictedRevenue"
              fill="#82ca9d"
              name="Predicted Revenue"
              radius={[8, 8, 0, 0]}
            />
          )}
        </BarChart>
      );
    }

    return (
      <LineChart {...commonProps}>
        {chartContent}
        {data[0]?.actualRevenue !== undefined && (
          <Line
            type="monotone"
            dataKey="actualRevenue"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Actual Revenue"
          />
        )}
        {data[0]?.predictedRevenue !== undefined && (
          <Line
            type="monotone"
            dataKey="predictedRevenue"
            stroke="#82ca9d"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Predicted Revenue"
          />
        )}
      </LineChart>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default RevenuePredictionChart;
