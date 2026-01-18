import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_RowSelectionState,
} from "mantine-react-table";
import { FaEye } from "react-icons/fa";
import { Order } from "@/types/order";
import { useOrderColumns } from "./OrderTableColumns";
import OrderToolbar from "./OrderToolbar";

interface OrderTableProps {
  data: Order[];
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (
    updater:
      | MRT_RowSelectionState
      | ((old: MRT_RowSelectionState) => MRT_RowSelectionState)
  ) => void;
  selectedOrderIds: number[];
  onStatusEdit: (order: Order) => void;
  onViewDetails: (order: Order) => void;
  onDeleteOrder: (orderId: number) => void;
  onBulkDelete: () => void;
  onMarkAsPaid: () => void;
  onExportSelected: () => void;
  isMarkingAsPaid?: boolean;
}

export default function OrderTable({
  data,
  rowSelection,
  onRowSelectionChange,
  selectedOrderIds,
  onStatusEdit,
  onViewDetails,
  onDeleteOrder,
  onBulkDelete,
  onMarkAsPaid,
  onExportSelected,
  isMarkingAsPaid = false,
}: OrderTableProps) {
  const columns = useOrderColumns({
    onStatusEdit,
    onViewDetails,
    onDeleteOrder,
  });

  const table = useMantineReactTable({
    columns,
    data,
    enableColumnFilterModes: false,
    enableColumnOrdering: false,
    enableFilters: false,
    enablePagination: true,
    enableSorting: false,
    enableRowSelection: true,
    enableColumnDragging: false,
    enableGlobalFilter: true,
    positionToolbarAlertBanner: "none",
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      showGlobalFilter: true,
      sorting: [{ id: "createdAt", desc: true }],
      rowSelection: {},
    },
    mantineSearchTextInputProps: {
      placeholder: "Search orders by ID, user name, phone, or status...",
      size: "sm",
      leftSection: <FaEye />,
      styles: {
        root: {
          marginLeft: "12px",
        },
      },
    },
    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
      withTableBorder: true,
      withColumnBorders: false,
      className: "rounded-lg overflow-hidden",
    },
    mantineTableContainerProps: {
      style: {
        maxWidth: "100%",
        overflowX: "auto",
        overflowY: "visible",
      },
    },
    mantinePaginationProps: {
      showRowsPerPage: true,
      rowsPerPageOptions: ["10", "25", "50", "100"],
      size: "lg",
      withEdges: true,
      withControls: true,
      siblings: 2,
      boundaries: 1,
      className:
        "mt-6 p-6 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border border-slate-200 rounded-2xl shadow-lg backdrop-blur-sm",
      styles: {
        root: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        },
        control: {
          "&[data-active]": {
            background:
              "linear-gradient(135deg, #3B82F6 0%, #1E40AF 50%, #1D4ED8 100%)",
            border: "none",
            color: "white",
            fontWeight: 700,
            boxShadow:
              "0 8px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(59, 130, 246, 0.3)",
            transform: "translateY(-2px) scale(1.05)",
            zIndex: 10,
          },
          "&:hover:not([data-active])": {
            background:
              "linear-gradient(135deg, #EBF4FF 0%, #DBEAFE 50%, #BFDBFE 100%)",
            border: "2px solid #3B82F6",
            color: "#1E40AF",
            transform: "translateY(-1px) scale(1.02)",
            boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "&[data-disabled]": {
            background: "#F8FAFC",
            color: "#CBD5E1",
            border: "1px solid #E2E8F0",
            cursor: "not-allowed",
            opacity: 0.6,
          },
          border: "2px solid #E2E8F0",
          borderRadius: "12px",
          fontWeight: 600,
          fontSize: "14px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          minWidth: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:active": {
            transform: "translateY(0) scale(0.98)",
          },
        },
        dots: {
          color: "#64748B",
          fontSize: "20px",
          fontWeight: "bold",
          padding: "0 8px",
        },
      },
    },
    mantineTopToolbarProps: {
      style: {
        padding: "12px",
      },
    },
    getRowId: (row) => row.id.toString(),
    state: {
      rowSelection,
    },
    onRowSelectionChange,
    renderTopToolbarCustomActions: () => (
      <OrderToolbar
        selectedOrderIds={selectedOrderIds}
        onBulkDelete={onBulkDelete}
        onMarkAsPaid={onMarkAsPaid}
        onExportSelected={onExportSelected}
        isMarkingAsPaid={isMarkingAsPaid}
      />
    ),
  });

  return <MantineReactTable table={table} />;
}
