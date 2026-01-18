import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReviewService,
  ReviewResponse,
  ReviewStatsResponse,
  OrderReviewStatusResponse,
  CreateReviewRequest,
} from "@/api/service/reviewService";

export const useGetProductReviews = (productId: string) => {
  const { getReviewsByProductId } = useReviewService();

  return useQuery<ReviewResponse[]>({
    queryKey: ["reviews", "product", productId],
    queryFn: () => getReviewsByProductId(productId),
    enabled: !!productId,
  });
};

export const useGetProductReviewStats = (productId: string) => {
  const { getReviewStatsByProductId } = useReviewService();

  return useQuery<ReviewStatsResponse>({
    queryKey: ["reviewStats", "product", productId],
    queryFn: () => getReviewStatsByProductId(productId),
    enabled: !!productId,
  });
};

export const useCheckOrderReviewStatus = (orderId: number | undefined) => {
  const { checkOrderReviewStatus } = useReviewService();

  return useQuery<OrderReviewStatusResponse>({
    queryKey: ["orderReviewStatus", orderId],
    queryFn: () => checkOrderReviewStatus(orderId!),
    enabled: !!orderId,
  });
};

export const useCreateReview = (orderId?: number, productId?: string) => {
  const { createReview } = useReviewService();
  const queryClient = useQueryClient();

  return useMutation<ReviewResponse, Error, CreateReviewRequest>({
    mutationFn: createReview,
    onSuccess: () => {
      // Invalidate all reviews queries to be safe
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });

      // Invalidate all review stats queries
      queryClient.invalidateQueries({
        queryKey: ["reviewStats"],
      });

      // If orderId is provided, specifically invalidate order-related queries
      if (orderId) {
        queryClient.invalidateQueries({
          queryKey: ["reviews", "order", orderId],
        });

        queryClient.invalidateQueries({
          queryKey: ["orderReviewStatus", orderId],
        });
      }

      // If productId is provided, specifically invalidate product-related queries
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["reviews", "product", productId],
        });

        queryClient.invalidateQueries({
          queryKey: ["reviewStats", "product", productId],
        });
      }
    },
  });
};

export const useGetOrderReviews = (orderId: number | undefined) => {
  const { getReviewsByOrderId } = useReviewService();

  return useQuery<ReviewResponse[]>({
    queryKey: ["reviews", "order", orderId],
    queryFn: () => getReviewsByOrderId(orderId!),
    enabled: !!orderId,
  });
};
