import { useRevenuePredictionService } from "@/api/service/revenuePredictionService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTrainModel() {
  const { trainModel } = useRevenuePredictionService();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (monthsToTrain: number = 12) => {
      return await trainModel(monthsToTrain);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["model-info"] });
      queryClient.invalidateQueries({ queryKey: ["revenue-predictions"] });
    },
  });
}

export function useGetHistoricalData(months: number = 12) {
  const { getHistoricalData } = useRevenuePredictionService();

  return useQuery({
    queryKey: ["historical-revenue", months],
    queryFn: () => getHistoricalData(months),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useGetModelInfo() {
  const { getModelInfo } = useRevenuePredictionService();

  return useQuery({
    queryKey: ["model-info"],
    queryFn: () => getModelInfo(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePredictNextMonths(monthsToPredict: number = 6) {
  const { predictNextMonths } = useRevenuePredictionService();

  return useQuery({
    queryKey: ["revenue-predictions", monthsToPredict],
    queryFn: () => predictNextMonths(monthsToPredict),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: monthsToPredict > 0,
  });
}
