"use client";

import React, { useState, useEffect } from "react";
import {
  useGetHistoricalData,
  useGetModelInfo,
  usePredictNextMonths,
  useTrainModel,
} from "@/hooks/queries/useRevenuePrediction";
import { Button, LoadingOverlay, Select, Switch, Text } from "@mantine/core";
import { FaSync, FaRobot, FaChartBar } from "react-icons/fa";
import RevenueStatistics from "./RevenueStatistics";
import RevenuePredictionChart from "./RevenuePredictionChart";
import toast from "react-hot-toast";

export default function RevenuePage() {
  const [historicalMonths, setHistoricalMonths] = useState(12);
  const [predictionMonths, setPredictionMonths] = useState(6);
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("area");
  const [showPrediction, setShowPrediction] = useState(true);

  const { data: modelInfo, isLoading: modelLoading } = useGetModelInfo();
  const {
    data: historicalData,
    isLoading: histLoading,
    refetch: refetchHistorical,
  } = useGetHistoricalData(historicalMonths);
  const {
    data: predictions,
    isLoading: predLoading,
    refetch: refetchPredictions,
  } = usePredictNextMonths(predictionMonths);

  const trainModelMutation = useTrainModel();

  const isLoading = modelLoading || histLoading || predLoading;

  const handleTrainModel = async () => {
    try {
      await trainModelMutation.mutateAsync(historicalMonths);
      toast.success("Model trained successfully!");
      refetchPredictions();
    } catch (error) {
      toast.error("Failed to train model");
    }
  };

  const handleRefresh = () => {
    refetchHistorical();
    refetchPredictions();
  };

  // Prepare combined chart data
  const chartData = React.useMemo(() => {
    const data: any[] = [];

    // Add historical data
    if (historicalData) {
      historicalData.forEach((item) => {
        data.push({
          month: `${item.month}/${item.year}`,
          year: item.year,
          actualRevenue: item.revenue,
          orderCount: item.orderCount,
        });
      });
    }

    // Add prediction data
    if (predictions && showPrediction) {
      predictions.forEach((item) => {
        data.push({
          month: `${item.month}/${item.year}`,
          year: item.year,
          predictedRevenue: item.predictedRevenue,
        });
      });
    }

    return data;
  }, [historicalData, predictions, showPrediction]);

  // Calculate statistics
  const statistics = React.useMemo(() => {
    if (!historicalData || historicalData.length === 0) {
      return {
        currentMonthRevenue: 0,
        predictedNextMonthRevenue: 0,
        averageMonthlyRevenue: 0,
        growthRate: 0,
        modelAccuracy: 0,
      };
    }

    const currentMonthRevenue =
      historicalData[historicalData.length - 1]?.revenue || 0;
    const predictedNextMonthRevenue =
      predictions && predictions.length > 0
        ? predictions[0]?.predictedRevenue
        : 0;
    const averageMonthlyRevenue =
      historicalData.reduce((sum, item) => sum + item.revenue, 0) /
      historicalData.length;
    const growthRate =
      currentMonthRevenue > 0
        ? ((predictedNextMonthRevenue - currentMonthRevenue) /
            currentMonthRevenue) *
          100
        : 0;
    const modelAccuracy = modelInfo?.r2Score || 0;

    return {
      currentMonthRevenue,
      predictedNextMonthRevenue,
      averageMonthlyRevenue,
      growthRate,
      modelAccuracy,
    };
  }, [historicalData, predictions, modelInfo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-2">
              Revenue Prediction
            </h1>
            <p className="text-gray-600">
              AI-powered revenue forecasting using machine learning
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              leftSection={<FaSync />}
              onClick={handleRefresh}
              variant="light"
              color="blue"
            >
              Refresh
            </Button>
            <Button
              leftSection={<FaRobot />}
              onClick={handleTrainModel}
              loading={trainModelMutation.isPending}
              variant="gradient"
              gradient={{ from: "blue", to: "purple", deg: 90 }}
            >
              Train Model
            </Button>
          </div>
        </div>

        {/* Model Status */}
        {modelInfo && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Model Status</p>
                <p className="text-lg font-semibold">
                  {modelInfo.isTrained ? (
                    <span className="text-green-600">✓ Trained</span>
                  ) : (
                    <span className="text-orange-600">⚠ Not Trained</span>
                  )}
                </p>
              </div>
              {modelInfo.isTrained && modelInfo.r2Score && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Accuracy (R²)</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {(modelInfo.r2Score * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <RevenueStatistics {...statistics} />

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Historical Months"
            value={historicalMonths.toString()}
            onChange={(value) => setHistoricalMonths(Number(value))}
            data={[
              { value: "6", label: "6 months" },
              { value: "12", label: "12 months" },
              { value: "24", label: "24 months" },
            ]}
          />
          <Select
            label="Prediction Months"
            value={predictionMonths.toString()}
            onChange={(value) => setPredictionMonths(Number(value))}
            data={[
              { value: "3", label: "3 months" },
              { value: "6", label: "6 months" },
              { value: "12", label: "12 months" },
            ]}
          />
          <Select
            label="Chart Type"
            value={chartType}
            onChange={(value) => setChartType(value as "line" | "bar" | "area")}
            data={[
              { value: "area", label: "Area Chart" },
              { value: "line", label: "Line Chart" },
              { value: "bar", label: "Bar Chart" },
            ]}
          />
          <div className="flex items-end">
            <Switch
              label="Show Predictions"
              checked={showPrediction}
              onChange={(event) =>
                setShowPrediction(event.currentTarget.checked)
              }
              color="blue"
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        <RevenuePredictionChart
          data={chartData}
          title="Revenue Overview - Historical & Predictions"
          type={chartType}
        />

        {/* Prediction Table */}
        {predictions && showPrediction && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartBar className="text-blue-600" />
              Detailed Predictions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Predicted Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {predictions &&
                    predictions.map((pred, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pred.month}/{pred.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {pred.predictedRevenue.toLocaleString("vi-VN")} ₫
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 rounded-full font-semibold ${
                              pred.confidence >= 0.8
                                ? "bg-green-100 text-green-800"
                                : pred.confidence >= 0.6
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {(pred.confidence * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {!historicalData || historicalData.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
          <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600 mb-6">
            There is no historical revenue data to display. Please ensure orders
            exist in the system.
          </p>
          <Button
            leftSection={<FaSync />}
            onClick={handleRefresh}
            variant="gradient"
            gradient={{ from: "blue", to: "purple", deg: 90 }}
          >
            Refresh Data
          </Button>
        </div>
      ) : null}
    </div>
  );
}
