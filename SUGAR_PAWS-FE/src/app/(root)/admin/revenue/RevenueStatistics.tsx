"use client";

import React from "react";
import {
  FaDollarSign,
  FaChartLine,
  FaPercentage,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { formatCurrency } from "@/helper/renderNumber";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: "increase" | "decrease";
  color: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType,
  color,
  description,
}) => (
  <div
    className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 ${color} ${
      color.includes("blue")
        ? "bg-gradient-to-br from-blue-50 to-blue-100"
        : color.includes("green")
          ? "bg-gradient-to-br from-green-50 to-green-100"
          : color.includes("purple")
            ? "bg-gradient-to-br from-purple-50 to-purple-100"
            : "bg-gradient-to-br from-pink-50 to-pink-100"
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            {changeType === "increase" ? (
              <FaArrowUp className="text-green-500 text-sm mr-1" />
            ) : (
              <FaArrowDown className="text-red-500 text-sm mr-1" />
            )}
            <span
              className={`text-sm font-medium ${
                changeType === "increase" ? "text-green-500" : "text-red-500"
              }`}
            >
              {change}
            </span>
          </div>
        )}
        {description && !change && (
          <span className="text-gray-500 text-sm mt-1 block">
            {description}
          </span>
        )}
      </div>
      <div
        className={`p-4 rounded-xl bg-gradient-to-br ${
          color.includes("blue")
            ? "from-blue-400 to-blue-600"
            : color.includes("green")
              ? "from-green-400 to-green-600"
              : color.includes("purple")
                ? "from-purple-400 to-purple-600"
                : "from-pink-400 to-pink-600"
        } text-white`}
      >
        {icon}
      </div>
    </div>
  </div>
);

interface RevenueStatisticsProps {
  currentMonthRevenue: number;
  predictedNextMonthRevenue: number;
  averageMonthlyRevenue: number;
  growthRate: number;
  modelAccuracy: number;
}

const RevenueStatistics: React.FC<RevenueStatisticsProps> = ({
  currentMonthRevenue,
  predictedNextMonthRevenue,
  averageMonthlyRevenue,
  growthRate,
  modelAccuracy,
}) => {
  const stats = [
    {
      title: "Current Month Revenue",
      value: formatCurrency(currentMonthRevenue),
      icon: <FaDollarSign className="text-2xl" />,
      color: "border-blue-500",
      description: "Total revenue this month",
    },
    {
      title: "Next Month Prediction",
      value: formatCurrency(predictedNextMonthRevenue),
      icon: <FaChartLine className="text-2xl" />,
      color: "border-green-500",
      change:
        growthRate > 0
          ? `+${growthRate.toFixed(1)}%`
          : `${growthRate.toFixed(1)}%`,
      changeType: (growthRate > 0 ? "increase" : "decrease") as
        | "increase"
        | "decrease",
    },
    {
      title: "Average Monthly Revenue",
      value: formatCurrency(averageMonthlyRevenue),
      icon: <FaChartLine className="text-2xl" />,
      color: "border-purple-500",
      description: "Based on historical data",
    },
    {
      title: "Model Accuracy",
      value: `${(modelAccuracy * 100).toFixed(1)}%`,
      icon: <FaPercentage className="text-2xl" />,
      color: "border-pink-500",
      description:
        modelAccuracy >= 0.8
          ? "Excellent prediction"
          : modelAccuracy >= 0.6
            ? "Good prediction"
            : "Fair prediction",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default RevenueStatistics;
