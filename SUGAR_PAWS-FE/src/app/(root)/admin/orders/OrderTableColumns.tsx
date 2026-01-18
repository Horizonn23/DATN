import { useMemo } from "react";
import { type MRT_ColumnDef } from "mantine-react-table";
import { Order } from "@/types/order";
import { Text, Badge, Group, Tooltip, ActionIcon } from "@mantine/core";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { formatCurrency } from "@/helper/renderNumber";
import {
  formatOrderStatus,
  getMantineOrderStatusColor,
} from "@/helper/orderHelper";

interface UseOrderColumnsProps {
  onStatusEdit: (order: Order) => void;
  onViewDetails: (order: Order) => void;
  onDeleteOrder: (orderId: number) => void;
}

export function useOrderColumns({
  onStatusEdit,
  onViewDetails,
  onDeleteOrder,
}: UseOrderColumnsProps) {
  // Format date with better styling
  const formatDate = (date: Date | string | undefined) => {
    if (!date)
      return (
        <Text c="dimmed" fs="italic">
          Not set
        </Text>
      );
    const formattedDate = new Date(date).toLocaleString();
    return (
      <div className="text-sm">
        <Text fw={500}>{formattedDate.split(", ")[0]}</Text>
        <Text size="xs" c="dimmed">
          {formattedDate.split(", ")[1]}
        </Text>
      </div>
    );
  };

  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order ID",
        size: 30,
      },
      {
        accessorKey: "userId",
        header: "User ID",
        size: 30,
      },
      {
        accessorKey: "userName",
        header: "User Name",
        size: 120,
        Cell: ({ cell }) => {
          const name = cell.getValue<string>();
          return name ? (
            <Text fw={500}>{name}</Text>
          ) : (
            <Text c="dimmed" fs="italic">
              No name provided
            </Text>
          );
        },
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        size: 120,
        Cell: ({ cell }) => {
          const phone = cell.getValue<string>();
          return phone ? (
            <Text fw={500} className="font-mono">
              {phone}
            </Text>
          ) : (
            <Text c="dimmed" fs="italic">
              No phone provided
            </Text>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => (
          <Badge color={getMantineOrderStatusColor(cell.getValue<string>())}>
            {formatOrderStatus(cell.getValue<string>())}
          </Badge>
        ),
        filterVariant: "select",
        filterSelectOptions: [
          "PENDING",
          "CONFIRMED",
          "DELIVERED",
          "COMPLETED",
          "REQUESTCANCEL",
          "CANCELLED",
          "REFUNDED",
        ],
      },
      {
        accessorKey: "totalAmount",
        header: "Total Amount",
        size: 120,
        Cell: ({ cell }) => (
          <Text fw={600} c="blue">
            {formatCurrency(cell.getValue<number>())} VND
          </Text>
        ),
        filterVariant: "range",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 100,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
        filterVariant: "date-range",
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 100,
        Cell: ({ cell }) => formatDate(cell.getValue<string>()),
        filterVariant: "date-range",
      },
      {
        accessorKey: "shippingFee",
        header: "Shipping Fee",
        size: 120,
        Cell: ({ cell }) => {
          const fee = cell.getValue<number | null>();
          return fee ? (
            <Text fw={500} c="green">
              {formatCurrency(fee)} VND
            </Text>
          ) : (
            <Text c="dimmed">Free shipping</Text>
          );
        },
      },
      {
        accessorKey: "trackingCode",
        header: "Tracking Code",
        size: 120,
        Cell: ({ cell }) => {
          const code = cell.getValue<string>();
          return code ? (
            <Text fw={500} className="font-mono text-blue-600">
              {code}
            </Text>
          ) : (
            <Text c="dimmed" fs="italic">
              Not assigned
            </Text>
          );
        },
      },
      {
        accessorKey: "paidAt",
        header: "Paid At",
        size: 100,
        Cell: ({ cell }) => {
          const paidAt = cell.row.original.payment?.paidAt;
          return paidAt ? formatDate(paidAt) : "N/A";
        },
        filterVariant: "date-range",
      },
      {
        id: "paymentMethod",
        header: "Payment Method",
        size: 160,
        Cell: ({ row }) => {
          const payment = row.original.payment;
          const method = payment?.method;
          const getMethodDisplay = (method: string) => {
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

          const getMethodColor = (method: string) => {
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
            <Badge color={getMethodColor(method || "")}>
              {getMethodDisplay(method || "")}
            </Badge>
          );
        },
        filterVariant: "select",
        filterSelectOptions: ["CASH", "CREDIT_CARD", "BANK_TRANSFER"],
      },
      {
        id: "paidStatus",
        header: "Payment Status",
        size: 120,
        Cell: ({ row }) => {
          const payment = row.original.payment;
          const isPaid = payment?.paidAt || payment?.status === "PAID";
          return (
            <Badge color={isPaid ? "green" : "red"}>
              {isPaid ? "Paid" : "Unpaid"}
            </Badge>
          );
        },
        filterVariant: "select",
        filterSelectOptions: ["Paid", "Unpaid"],
      },
      {
        id: "actions",
        header: "Actions",
        size: 160,
        Cell: ({ row }) => (
          <Group gap="xs">
            <Tooltip label="Change Status">
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => onStatusEdit(row.original)}
              >
                <FaEdit />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="View Details">
              <ActionIcon
                variant="light"
                color="green"
                onClick={() => onViewDetails(row.original)}
              >
                <FaEye />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete Order">
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => onDeleteOrder(row.original.id)}
              >
                <FaTrash />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      },
    ],
    [onStatusEdit, onViewDetails, onDeleteOrder],
  );

  return columns;
}
