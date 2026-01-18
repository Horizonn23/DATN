import { useRequest } from "@/api/Request";

export interface HistoricalRevenueData {
  month: number;
  year: number;
  revenue: number;
  orderCount: number;
}

export interface TrainingResult {
  success: boolean;
  message: string;
  dataPoints: number;
  slope: number;
  intercept: number;
  r2Score: number;
}

export interface PredictionResult {
  month: number;
  year: number;
  predictedRevenue: number;
  confidence: number;
}

export interface MonthlyPredictionResult {
  predictions: Array<{
    month: number;
    year: number;
    predictedRevenue: number;
    confidence: number;
  }>;
}

export interface ModelInfo {
  isTrained: boolean;
  message?: string;
  lastTrainedAt?: string;
  dataPoints?: number;
  r2Score?: number;
}

export function useRevenuePredictionService() {
  const { Request } = useRequest();

  const trainModel = async (
    monthsToTrain: number = 12,
  ): Promise<TrainingResult> => {
    try {
      const response = await Request.post<TrainingResult>(
        "/revenue-prediction/train",
        { monthsToTrain },
      );
      // Backend trả về trực tiếp object, không wrap trong { data: ... }
      // Vì vậy response chính là data
      const result = (response as any).data || response;
      if (!result) {
        throw new Error("No data returned from server");
      }
      return result as TrainingResult;
    } catch (error: any) {
      console.error("Error training model:", error);
      throw new Error(error?.message || "Failed to train model");
    }
  };

  const getHistoricalData = async (
    months: number = 12,
  ): Promise<HistoricalRevenueData[]> => {
    try {
      const response = await Request.get<HistoricalRevenueData[]>(
        `/revenue-prediction/historical-data`,
        { months },
      );
      const result = (response as any).data || response;
      return Array.isArray(result) ? result : [];
    } catch (error: any) {
      console.error("Error fetching historical data:", error);
      return [];
    }
  };

  const predictRevenue = async (
    month: number,
    year: number,
  ): Promise<PredictionResult> => {
    try {
      const response = await Request.get<PredictionResult>(
        `/revenue-prediction/predict`,
        { month, year },
      );
      const result = (response as any).data || response;
      if (!result) {
        throw new Error("No data returned from server");
      }
      return result as PredictionResult;
    } catch (error: any) {
      console.error("Error predicting revenue:", error);
      throw new Error(error?.message || "Failed to predict revenue");
    }
  };

  const predictNextMonths = async (
    monthsToPredict: number = 6,
  ): Promise<PredictionResult[]> => {
    try {
      const response = await Request.get<PredictionResult[]>(
        `/revenue-prediction/predict-next-months`,
        { months: monthsToPredict },
      );
      const result = (response as any).data || response;
      return Array.isArray(result) ? result : [];
    } catch (error: any) {
      console.error("Error predicting next months:", error);
      return [];
    }
  };

  const getModelInfo = async (): Promise<ModelInfo> => {
    try {
      const response = await Request.get<ModelInfo>(
        "/revenue-prediction/model-info",
      );
      const result = (response as any).data || response;
      return (
        result || { isTrained: false, message: "Model info not available" }
      );
    } catch (error: any) {
      console.error("Error fetching model info:", error);
      return { isTrained: false, message: "Failed to fetch model info" };
    }
  };

  return {
    trainModel,
    getHistoricalData,
    predictRevenue,
    predictNextMonths,
    getModelInfo,
  };
}
