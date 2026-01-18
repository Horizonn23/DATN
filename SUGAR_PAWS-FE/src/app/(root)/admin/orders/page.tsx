"use client";

import {
  useGetAllOrders,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from "@/hooks/queries/useOrder";
import { Order } from "@/types/order";
import { useState, useEffect } from "react";
import { FaTimes, FaSync } from "react-icons/fa";
import { Button, Title, Box, LoadingOverlay, Paper, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import OrderDetailModal from "./OrderDetailModal";
import OrderHeader from "./OrderHeader";
import OrderStatistics from "./OrderStatistics";
import OrderTable from "./OrderTable";
import OrderStatusModal from "./OrderStatusModal";

export default function OrderAdminPage() {
  const { getAllOrders } = useGetAllOrders();
  const { data: orders, isLoading, isError, refetch } = getAllOrders;
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const updatePaymentStatusMutation = useUpdatePaymentStatus();

  // Status update modal state
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");

  // Order detail modal state
  const [detailOpened, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  // Selected orders for batch operations
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Update selectedOrderIds when rowSelection changes
  useEffect(() => {
    const selectedIds = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map(Number);
    setSelectedOrderIds(selectedIds);
  }, [rowSelection]);

  // Show loading screen for initial load
  if (isLoading && !orders) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <Title order={3} className="text-gray-700 mb-2">
            Loading Orders...
          </Title>
          <Text c="dimmed">Please wait while we fetch the latest data</Text>
        </div>
      </div>
    );
  }

  // Handle status change
  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await updateOrderStatusMutation.mutateAsync({
        orderId: selectedOrder.id,
        status: newStatus,
      });
      close();
      refetch();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Handle order deletion (in a real app, this would typically be a soft delete)
  const handleDeleteOrder = (orderId: number) => {
    // Implementation would depend on your API
    console.log("Delete order", orderId);
  };

  // Handle marking selected orders as paid
  const handleMarkAsPaid = async () => {
    if (selectedOrderIds.length === 0) return;

    try {
      const selectedOrders =
        orders?.filter((order) => selectedOrderIds.includes(order.id)) || [];

      const promises = selectedOrders.map((order) => {
        if (order.payment?.id && order.payment.status !== "PAID") {
          return updatePaymentStatusMutation.mutateAsync({
            paymentId: order.payment.id,
            status: "PAID",
            paidAt: new Date(),
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      setRowSelection({});
      refetch();
    } catch (error) {
      console.error("Failed to mark orders as paid:", error);
    }
  };

  // Handle status edit
  const handleStatusEdit = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    open();
  };

  // Handle view details
  const handleViewDetails = (order: Order) => {
    setDetailOrder(order);
    openDetail();
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    console.log("Bulk delete not implemented");
  };

  // Handle export selected
  const handleExportSelected = () => {
    console.log("Export selected orders");
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  // Handle export
  const handleExport = () => {
    console.log("Export functionality");
  };

  if (isError) {
    return (
      <div className="p-8">
        <Paper
          p="xl"
          shadow="md"
          className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200"
        >
          <div className="text-center">
            <div className="bg-red-500 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaTimes size={24} />
            </div>
            <Title order={3} className="text-red-600 mb-2">
              Error loading orders data
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              We encountered an issue while fetching the orders. Please try
              again.
            </Text>
            <Button
              variant="filled"
              color="red"
              onClick={() => refetch()}
              leftSection={<FaSync />}
            >
              Retry
            </Button>
          </div>
        </Paper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="mb-6">
        <OrderHeader
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        {/* Statistics Cards */}
        <OrderStatistics orders={orders} />
      </div>

      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading || updateOrderStatusMutation.isPending}
          loaderProps={{ size: "lg", color: "blue" }}
          className="rounded-xl"
        />
        <Paper
          shadow="xl"
          p="lg"
          className="bg-white rounded-xl border border-gray-100 overflow-hidden"
        >
          <div className="mb-4">
            <Title order={3} className="text-gray-700 font-semibold mb-2">
              📊 Orders Data Table
            </Title>
            <Text size="sm" c="dimmed">
              View, filter, and manage all customer orders
            </Text>
          </div>
          <OrderTable
            data={orders || []}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            selectedOrderIds={selectedOrderIds}
            onStatusEdit={handleStatusEdit}
            onViewDetails={handleViewDetails}
            onDeleteOrder={handleDeleteOrder}
            onBulkDelete={handleBulkDelete}
            onMarkAsPaid={handleMarkAsPaid}
            onExportSelected={handleExportSelected}
            isMarkingAsPaid={updatePaymentStatusMutation.isPending}
          />
        </Paper>
      </Box>

      {/* Status Change Modal */}
      <OrderStatusModal
        opened={opened}
        onClose={close}
        selectedOrder={selectedOrder}
        newStatus={newStatus}
        onStatusChange={(value) => setNewStatus(value || "")}
        onConfirm={handleStatusChange}
        isLoading={updateOrderStatusMutation.isPending}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        opened={detailOpened}
        onClose={closeDetail}
        order={detailOrder}
      />
    </div>
  );
}
