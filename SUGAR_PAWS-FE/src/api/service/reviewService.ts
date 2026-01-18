import { useRequest, Params } from "../Request";
import API from "../api";

export interface ReviewResponse {
  id: number;
  orderItemId: number;
  rating: number;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  productName?: string;
  productId?: number;
  orderDate?: string;
  orderId?: number;
}

export interface ReviewStatsResponse {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

export interface OrderReviewStatusResponse {
  canReview: boolean;
  completedItems: number;
  reviewedItems: number;
  pendingReviewItems: {
    orderItemId: number;
    productName: string;
    productId: number;
  }[];
}

export interface CreateReviewRequest extends Params {
  orderItemId: number;
  rating: number;
  comment?: string;
}

export function useReviewService() {
  const { Request } = useRequest();

  const getReviewsByProductId = async (
    productId: string,
  ): Promise<ReviewResponse[]> => {
    try {
      const { data } = await Request.get<ReviewResponse[]>(
        `/${API.REVIEWS}/product/${productId}`,
      );
      return data || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch reviews:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch reviews.",
      );
    }
  };

  const getReviewStatsByProductId = async (
    productId: string,
  ): Promise<ReviewStatsResponse> => {
    try {
      const { data } = await Request.get<ReviewStatsResponse>(
        `/${API.REVIEWS}/product/${productId}/stats`,
      );
      return (
        data || { totalReviews: 0, averageRating: 0, ratingDistribution: {} }
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch review stats:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch review stats.",
      );
    }
  };

  const checkOrderReviewStatus = async (
    orderId: number,
  ): Promise<OrderReviewStatusResponse> => {
    try {
      const { data } = await Request.get<OrderReviewStatusResponse>(
        `/${API.REVIEWS}/order/${orderId}/status`,
      );
      return (
        data || {
          canReview: false,
          completedItems: 0,
          reviewedItems: 0,
          pendingReviewItems: [],
        }
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to check order review status:", error);
      throw new Error(
        error.response?.data?.message || "Failed to check order review status.",
      );
    }
  };

  const createReview = async (
    reviewData: CreateReviewRequest,
  ): Promise<ReviewResponse> => {
    try {
      const { data } = await Request.post<ReviewResponse>(
        `/${API.REVIEWS}`,
        reviewData,
      );
      if (!data) {
        throw new Error("No data returned from create review request");
      }
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to create review:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create review.",
      );
    }
  };

  const getReviewsByOrderId = async (
    orderId: number,
  ): Promise<ReviewResponse[]> => {
    try {
      const { data } = await Request.get<ReviewResponse[]>(
        `/${API.REVIEWS}/order/${orderId}`,
      );
      return data || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to fetch order reviews:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch order reviews.",
      );
    }
  };

  return {
    getReviewsByProductId,
    getReviewStatsByProductId,
    checkOrderReviewStatus,
    createReview,
    getReviewsByOrderId,
  };
}
