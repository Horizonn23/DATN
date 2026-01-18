"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  useCreateReview,
  useGetOrderReviews,
} from "@/hooks/queries/useReviews";
import { useGetOrderById } from "@/hooks/queries/useOrder";
import { OrderItem } from "@/types/order";
import OrderHeader from "@/components/order/OrderHeader";
import OrderStatusWarning from "@/components/order/OrderStatusWarning";
import OrderItemCard from "@/components/order/OrderItemCard";
import ReviewModal from "@/components/order/ReviewModal";
import LoadingState from "@/components/order/LoadingState";
import NotFoundState from "@/components/order/NotFoundState";

const ReviewOrderPage = () => {
  const { id: orderId } = useParams();
  const orderIdNumber = orderId ? parseInt(orderId as string) : undefined;

  const { data: order, isLoading: orderLoading } = useGetOrderById(
    orderIdNumber || 0,
  );
  const { data: existingReviews, isLoading: reviewsLoading } =
    useGetOrderReviews(orderIdNumber);
  const createReviewMutation = useCreateReview();

  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
  });

  // Create a map of existing reviews by orderItemId
  const existingReviewsMap = React.useMemo(() => {
    const map = new Map();
    existingReviews?.forEach((review) => {
      map.set(review.orderItemId, review);
    });
    return map;
  }, [existingReviews]);

  const handleWriteReview = (orderItem: OrderItem) => {
    setSelectedItem(orderItem);
    setReviewData({ rating: 0, comment: "" });
    setShowReviewModal(true);
  };

  const handleCloseModal = () => {
    setShowReviewModal(false);
    setSelectedItem(null);
    setReviewData({ rating: 0, comment: "" });
  };

  const handleSubmitReview = async () => {
    if (!selectedItem || reviewData.rating === 0) return;

    try {
      await createReviewMutation.mutateAsync({
        orderItemId: selectedItem.id,
        rating: reviewData.rating,
        comment: reviewData.comment || undefined,
      });

      handleCloseModal();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const canReviewOrder = order?.status === "COMPLETED";

  if (orderLoading || reviewsLoading) {
    return <LoadingState />;
  }

  if (!order) {
    return <NotFoundState />;
  }

  return (
    <main className="min-h-screen bg-[#fff4dd] py-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <OrderHeader orderId={order.id} />

        {/* Order Status Warning */}
        {!canReviewOrder && <OrderStatusWarning />}

        {/* Products Card */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
          <div className="font-semibold text-custom-purple text-lg mb-2">
            Products in this order
          </div>

          <div className="divide-y">
            {order.orderItems?.map((item) => {
              const hasReview = existingReviewsMap.has(item.id);
              const existingReview = existingReviewsMap.get(item.id);

              return (
                <OrderItemCard
                  key={item.id}
                  item={item}
                  hasReview={hasReview}
                  existingReview={existingReview}
                  canReviewOrder={canReviewOrder}
                  onWriteReview={handleWriteReview}
                />
              );
            })}
          </div>
        </div>

        {/* Review Modal */}
        <ReviewModal
          isOpen={showReviewModal}
          selectedItem={selectedItem}
          reviewData={reviewData}
          isSubmitting={createReviewMutation.isPending}
          onClose={handleCloseModal}
          onSubmit={handleSubmitReview}
          onUpdateReview={setReviewData}
        />
      </div>
    </main>
  );
};

export default ReviewOrderPage;
