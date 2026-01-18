"use client";

import React from "react";
import {
  Modal,
  Group,
  Text,
  Badge,
  Box,
  Divider,
  Stack,
  Grid,
  Card,
  Image,
  ScrollArea,
} from "@mantine/core";
import { Order } from "@/types/order";
import { formatCurrency } from "@/helper/renderNumber";
import {
  formatOrderStatus,
  getMantineOrderStatusColor,
} from "@/helper/orderHelper";

interface OrderDetailModalProps {
  opened: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderDetailModal({
  opened,
  onClose,
  order,
}: OrderDetailModalProps) {
  if (!order) return null;

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "CASH":
        return "Cash on Delivery";
      case "CREDIT_CARD":
        return "Credit Card";
      case "BANK_TRANSFER":
        return "Bank Transfer";
      default:
        return method || "N/A";
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "CASH":
        return "green";
      case "CREDIT_CARD":
        return "blue";
      case "BANK_TRANSFER":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Order Details #${order.id}`}
      size="xl"
      centered
      zIndex={1010}
      styles={{
        body: { padding: 0 },
        content: { maxHeight: "90vh" },
        header: { borderBottom: "1px solid #e9ecef", marginBottom: 0 },
      }}
      scrollAreaComponent={ScrollArea.Autosize}
      closeOnClickOutside={false}
    >
      <Box p="md" style={{ maxHeight: "calc(90vh - 60px)", overflow: "auto" }}>
        <Stack gap="md">
          {/* Order Information */}
          <Card withBorder p="md">
            <Text size="lg" fw={600} mb="md">
              Order Information
            </Text>
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm">
                  <strong>Order ID:</strong> #{order.id}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm">
                  <strong>User ID:</strong> {order.userId}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm">
                  <strong>User Name:</strong> {order.userName || "N/A"}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm">
                  <strong>Phone Number:</strong> {order.phoneNumber || "N/A"}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm">
                  <strong>Status:</strong>{" "}
                  <Badge color={getMantineOrderStatusColor(order.status)}>
                    {formatOrderStatus(order.status)}
                  </Badge>
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm">
                  <strong>Total Amount:</strong>{" "}
                  {formatCurrency(order.totalAmount)} VND
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm">
                  <strong>Shipping Fee:</strong>{" "}
                  {order.shippingFee
                    ? `${formatCurrency(order.shippingFee)} VND`
                    : "N/A"}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm">
                  <strong>Tracking Code:</strong> {order.trackingCode || "N/A"}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm">
                  <strong>Created At:</strong> {formatDate(order.createdAt)}
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm">
                  <strong>Updated At:</strong> {formatDate(order.updatedAt)}
                </Text>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Payment Information */}
          {order.payment && (
            <Card withBorder p="md">
              <Text size="lg" fw={600} mb="md">
                Payment Information
              </Text>
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm">
                    <strong>Payment Method:</strong>{" "}
                    <Badge
                      color={getPaymentMethodColor(order.payment.method || "")}
                    >
                      {getPaymentMethodDisplay(order.payment.method || "")}
                    </Badge>
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm">
                    <strong>Payment Status:</strong>{" "}
                    <Badge
                      color={
                        order.payment.paidAt || order.payment.status === "PAID"
                          ? "green"
                          : "red"
                      }
                    >
                      {order.payment.paidAt || order.payment.status === "PAID"
                        ? "Paid"
                        : "Unpaid"}
                    </Badge>
                  </Text>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Text size="sm">
                    <strong>Paid At:</strong> {formatDate(order.payment.paidAt)}
                  </Text>
                </Grid.Col>
              </Grid>
            </Card>
          )}

          {/* Shipping Address */}
          {order.shippingAddress && (
            <Card withBorder p="md">
              <Text size="lg" fw={600} mb="md">
                Shipping Address
              </Text>
              <Text size="sm">
                <strong>Full Name:</strong> {order.shippingAddress.fullName}
              </Text>
              <Text size="sm">
                <strong>Phone:</strong> {order.shippingAddress.phoneNumber}
              </Text>
              <Text size="sm">
                <strong>Address:</strong> {order.shippingAddress.homeNumber}
              </Text>
              <Text size="sm">
                <strong>More Details:</strong>{" "}
                {order.shippingAddress.moreDetail || "N/A"}
              </Text>
              {order.shippingAddress.ward && (
                <Text size="sm">
                  <strong>Location:</strong> {order.shippingAddress.ward.name},{" "}
                  {order.shippingAddress.ward.district?.name},{" "}
                  {order.shippingAddress.ward.district?.city?.name}
                </Text>
              )}
            </Card>
          )}

          {order.orderItems && order.orderItems.length > 0 && (
            <Card withBorder p="md">
              <Text size="lg" fw={600} mb="md">
                Order Items ({order.orderItems.length} items)
              </Text>
              <Stack gap="sm">
                {order.orderItems.map((item, index) => (
                  <Box key={item.id || index}>
                    <Group gap="md" align="flex-start">
                      {item.productDetail?.image?.url && (
                        <Image
                          src={item.productDetail.image.url}
                          alt={
                            item.productDetail?.product?.name ||
                            item.productDetail?.name ||
                            "Product"
                          }
                          w={60}
                          h={60}
                          fit="cover"
                          radius="sm"
                          style={{
                            width: "60px",
                            height: "60px",
                            minWidth: "60px",
                            minHeight: "60px",
                            maxWidth: "60px",
                            maxHeight: "60px",
                          }}
                        />
                      )}
                      <Box style={{ flex: 1 }}>
                        <Text fw={500} size="sm">
                          {item.productDetail?.productName || "Unknown Product"}
                        </Text>
                        <Text size="xs" color="dimmed">
                          Size: {item.productDetail?.size || "N/A"} | Color:{" "}
                          {item.productDetail?.color || "N/A"}
                          {item.productDetail?.type && (
                            <> | Type: {item.productDetail.type}</>
                          )}
                        </Text>
                        <Group gap="md">
                          <Text size="sm">
                            <strong>Quantity:</strong> {item.quantity}
                          </Text>
                          <Text size="sm">
                            <strong>Price:</strong>{" "}
                            {formatCurrency(item.productDetail?.price ?? 0)} VND
                          </Text>
                          <Text size="sm">
                            <strong>Total:</strong>{" "}
                            {formatCurrency(
                              (item.productDetail?.price ?? 0) * item.quantity
                            )}{" "}
                            VND
                          </Text>
                        </Group>
                      </Box>
                    </Group>
                    {index < order.orderItems!.length - 1 && (
                      <Divider my="sm" />
                    )}
                  </Box>
                ))}
              </Stack>
            </Card>
          )}

          {/* Order Summary */}
          <Card withBorder p="md">
            <Text size="lg" fw={600} mb="md">
              Order Summary
            </Text>
            <Group justify="space-between">
              <Text size="sm">Subtotal:</Text>
              <Text size="sm">
                {formatCurrency(
                  (order.totalAmount || 0) - (order.shippingFee || 0)
                )}{" "}
                VND
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Shipping Fee:</Text>
              <Text size="sm">
                {order.shippingFee
                  ? `${formatCurrency(order.shippingFee)} VND`
                  : "Free"}
              </Text>
            </Group>
            <Divider my="sm" />
            <Group justify="space-between">
              <Text size="lg" fw={600}>
                Total:
              </Text>
              <Text size="lg" fw={600} color="blue">
                {formatCurrency(order.totalAmount)} VND
              </Text>
            </Group>
          </Card>
        </Stack>
      </Box>
    </Modal>
  );
}
