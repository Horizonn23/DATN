import {
  Modal,
  Group,
  Text,
  Badge,
  Paper,
  Select,
  Button,
  Box,
} from "@mantine/core";
import { FaEdit, FaSync } from "react-icons/fa";
import { Order } from "@/types/order";
import {
  formatOrderStatus,
  getMantineOrderStatusColor,
  getOrderStatusSelectOptions,
} from "@/helper/orderHelper";

interface OrderStatusModalProps {
  opened: boolean;
  onClose: () => void;
  selectedOrder: Order | null;
  newStatus: string;
  onStatusChange: (status: string | null) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function OrderStatusModal({
  opened,
  onClose,
  selectedOrder,
  newStatus,
  onStatusChange,
  onConfirm,
  isLoading = false,
}: OrderStatusModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FaEdit className="text-blue-600" />
          </div>
          <div>
            <Text fw={600} size="lg">
              Update Order Status
            </Text>
            <Text size="sm" c="dimmed">
              Order #{selectedOrder?.id}
            </Text>
          </div>
        </Group>
      }
      centered
      zIndex={1020}
      size="md"
      overlayProps={{
        backgroundOpacity: 0.3,
        blur: 3,
      }}
    >
      <Box p="md">
        <Paper
          p="lg"
          mb="lg"
          className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200"
        >
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" fw={600} className="text-gray-700 mb-2">
                Current Status
              </Text>
              <Badge
                size="lg"
                color={getMantineOrderStatusColor(selectedOrder?.status || "")}
                className="px-3 py-2"
              >
                {formatOrderStatus(selectedOrder?.status || "")}
              </Badge>
            </div>
            <div className="text-4xl">
              {selectedOrder?.status === "COMPLETED"
                ? "✅"
                : selectedOrder?.status === "PENDING"
                  ? "⏳"
                  : selectedOrder?.status === "CANCELLED"
                    ? "❌"
                    : "📦"}
            </div>
          </Group>
        </Paper>

        <Select
          label="Select New Status"
          placeholder="Choose the new status for this order"
          data={getOrderStatusSelectOptions()}
          value={newStatus}
          onChange={onStatusChange}
          mb="lg"
          leftSection={<FaEdit />}
          size="md"
          className="mb-4"
          comboboxProps={{
            zIndex: 1021,
            position: "bottom",
            middlewares: { flip: true, shift: true },
          }}
        />

        <Group justify="flex-end" mt="xl" gap="md">
          <Button
            variant="outline"
            onClick={onClose}
            size="md"
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={isLoading}
            disabled={!newStatus || newStatus === selectedOrder?.status}
            size="md"
            leftSection={<FaSync />}
            className="px-6"
            gradient={{ from: "blue", to: "cyan" }}
            variant="gradient"
          >
            Update Status
          </Button>
        </Group>
      </Box>
    </Modal>
  );
}
