import { User } from "@/types/user";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { FiEye } from "react-icons/fi";
import { createUserTableColumns } from "./UserTableColumns";
import UserTableToolbar from "./UserTableToolbar";

interface UserTableProps {
  users: User[];
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (userId: string | number) => void;
  onExport: () => void;
  onBulkDelete: () => void;
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (selection: Record<string, boolean>) => void;
}

export default function UserTable({
  users,
  onAddUser,
  onEditUser,
  onViewUser,
  onDeleteUser,
  onExport,
  onBulkDelete,
  rowSelection,
  onRowSelectionChange,
}: UserTableProps) {
  const selectedUserIds = Object.keys(rowSelection).filter(
    (key) => rowSelection[key],
  );

  const columns = createUserTableColumns({
    onEditUser,
    onViewUser,
    onDeleteUser,
  });

  const table = useMantineReactTable({
    columns,
    data: users,
    enableColumnFilterModes: false,
    enableColumnOrdering: false,
    enableFilters: false,
    enablePagination: true,
    enableSorting: false,
    enableRowSelection: true,
    enableColumnDragging: false,
    enableGlobalFilter: true,
    positionToolbarAlertBanner: "none",
    onRowSelectionChange: (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        const newSelection = updaterOrValue(rowSelection);
        onRowSelectionChange(newSelection);
      } else {
        onRowSelectionChange(updaterOrValue);
      }
    },
    state: {
      rowSelection,
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
      rowsPerPageOptions: ["10", "20", "30", "50"],
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
          background:
            "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)",
          border: "1px solid #CBD5E1",
          borderRadius: "12px",
          color: "#334155",
          fontWeight: 600,
          fontSize: "14px",
          padding: "8px 12px",
          boxShadow:
            "0 2px 4px rgba(148, 163, 184, 0.1), 0 1px 2px rgba(148, 163, 184, 0.06)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover:not([data-disabled])": {
            background:
              "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)",
            borderColor: "#3B82F6",
            color: "#1E40AF",
            transform: "translateY(0) scale(0.98)",
          },
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
    mantineTableBodyRowProps: ({ row }) => ({
      style: { cursor: "pointer" },
      onClick: () => onViewUser(row.original),
    }),
    mantineTableHeadCellProps: {
      className:
        "bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold text-gray-700",
    },
    mantineTableBodyCellProps: {
      className: "text-gray-600",
    },
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      showGlobalFilter: true,
    },
    mantineSearchTextInputProps: {
      placeholder: "Search users by name, email, or username...",
      size: "sm",
      leftSection: <FiEye />,
      styles: {
        root: {
          marginLeft: "12px",
        },
      },
    },
    renderTopToolbarCustomActions: () => (
      <UserTableToolbar
        onAddUser={onAddUser}
        onExport={onExport}
        onBulkDelete={onBulkDelete}
        selectedCount={selectedUserIds.length}
      />
    ),
  });

  return <MantineReactTable table={table} />;
}
