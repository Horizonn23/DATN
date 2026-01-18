import { Button, Text, Badge, Group, Tooltip, ActionIcon } from "@mantine/core";
import Image from "next/image";
import React from "react";
import {
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable,
  type MRT_RowSelectionState,
} from "mantine-react-table";
import { FiEye, FiEdit, FiPlus, FiGrid, FiTrash } from "react-icons/fi";
import { Product } from "@/types/product";
import { Category } from "@/types/category";

interface ProductTableProps {
  data: Product[];
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (
    updater:
      | MRT_RowSelectionState
      | ((old: MRT_RowSelectionState) => MRT_RowSelectionState),
  ) => void;
  selectedProductIds: string[];
  onCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onViewDetailTable: (productId: string) => void;
  onDeleteProduct: (product: Product) => void;
  onBulkDelete: () => void;
  onExportSelected: () => void;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => void;
  totalProducts: number;
}

const ProductTable: React.FC<ProductTableProps> = ({
  data,
  rowSelection,
  onRowSelectionChange,
  selectedProductIds,
  onCreateProduct,
  onEditProduct,
  onViewDetails,
  onViewDetailTable,
  onDeleteProduct,
  onBulkDelete,
  onExportSelected,
  pagination,
  onPaginationChange,
  totalProducts,
}) => {
  const columns: MRT_ColumnDef<Product>[] = [
    {
      accessorKey: "id",
      header: "ID",
      size: 80,
      Cell: ({ cell }) => {
        const value = cell.getValue<string | number>();
        const idString = String(value);
        return (
          <Text fw={500} c="blue" className="text-center">
            #{idString.slice(-6)}
          </Text>
        );
      },
    },
    {
      accessorKey: "displayImage",
      header: "Image",
      Cell: ({ cell }) => {
        const images = cell.getValue<string[]>();
        const imgSrc =
          images && images[0]
            ? images[0].startsWith("//")
              ? `https:${images[0]}`
              : images[0]
            : "/assets/images/loading/no-image.png";
        return (
          <div className="w-16 h-16 mx-auto relative">
            <Image
              src={imgSrc}
              alt="Product Image"
              fill
              className="object-cover rounded"
              sizes="64px"
              priority={false}
            />
          </div>
        );
      },
      size: 80,
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: "Product Name",
      size: 200,
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return (
          <Tooltip label={value} position="top-start">
            <Text fw={500} lineClamp={2} className="cursor-help">
              {value}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      size: 120,
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        return value ? (
          <Text fw={500}>{value}</Text>
        ) : (
          <Text c="dimmed" fs="italic">
            Unknown Vendor
          </Text>
        );
      },
    },
    {
      accessorKey: "minPrice",
      header: "Min Price",
      size: 160,
      Cell: ({ cell }) => {
        const value = cell.getValue<number>();
        return (
          <Text fw={600} c="blue">
            {value?.toLocaleString()} VND
          </Text>
        );
      },
    },
    {
      accessorKey: "maxPrice",
      header: "Max Price",
      size: 160,
      Cell: ({ cell }) => {
        const value = cell.getValue<number>();
        return (
          <Text fw={600} c="blue">
            {value?.toLocaleString()} VND
          </Text>
        );
      },
    },
    {
      accessorKey: "totalStock",
      header: "Stock",
      size: 60,
      Cell: ({ cell }) => {
        const value = cell.getValue<number>();
        return (
          <Text
            fw={500}
            c={value > 0 ? "green" : "red"}
            className="text-center"
          >
            {value}
          </Text>
        );
      },
    },
    {
      accessorKey: "totalSales",
      header: "Sold",
      size: 60,
      Cell: ({ cell }) => {
        const value = cell.getValue<number | undefined>();
        return (
          <Text fw={500} c="orange" className="text-center">
            {value ?? 0}
          </Text>
        );
      },
    },
    {
      accessorKey: "discount",
      header: "Discount (%)",
      size: 80,
      Cell: ({ cell }) => {
        const value = cell.getValue<number | undefined>();
        return value && value > 0 ? (
          <Badge color="red" variant="light">
            {value}%
          </Badge>
        ) : (
          <Text c="dimmed">-</Text>
        );
      },
    },
    {
      accessorKey: "categories",
      header: "Category",
      size: 120,
      Cell: ({ cell }) => {
        const categories = cell.getValue<Category[] | undefined>();
        if (!categories || categories.length === 0) {
          return (
            <Text c="dimmed" fs="italic">
              No category
            </Text>
          );
        }

        const categoryNames = categories
          .map((cat) => cat.name.charAt(0).toUpperCase() + cat.name.slice(1))
          .join(", ");

        return (
          <Tooltip label={categoryNames} position="top-start">
            <div className="flex flex-wrap gap-1">
              {categories.slice(0, 2).map((cat, idx) => (
                <Badge key={idx} color="blue" variant="light" size="sm">
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </Badge>
              ))}
              {categories.length > 2 && (
                <Badge color="gray" variant="light" size="sm">
                  +{categories.length - 2}
                </Badge>
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      size: 120,
      Cell: ({ cell }) => {
        const tags = cell.getValue<string[] | undefined>();
        if (!tags || tags.length === 0) {
          return (
            <Text c="dimmed" fs="italic">
              No tags
            </Text>
          );
        }

        const tagString = tags.join(", ");
        return (
          <Tooltip label={tagString} position="top-start">
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag, idx) => (
                <Badge key={idx} color="green" variant="light" size="sm">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge color="gray" variant="light" size="sm">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      size: 200,
      Cell: ({ row }) => (
        <Group gap="xs">
          <Tooltip label="View Product Details">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(row.original);
              }}
            >
              <FiEye />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="View Product Detail Table">
            <ActionIcon
              variant="light"
              color="green"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetailTable(row.original.id);
              }}
            >
              <FiGrid />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit Product">
            <ActionIcon
              variant="light"
              color="orange"
              onClick={(e) => {
                e.stopPropagation();
                onEditProduct(row.original);
              }}
            >
              <FiEdit />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Product">
            <ActionIcon
              variant="light"
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProduct(row.original);
              }}
            >
              <FiTrash />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
      enableSorting: false,
    },
  ];

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
    manualPagination: true,
    positionToolbarAlertBanner: "none",
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newPagination = updater(pagination);
        onPaginationChange(newPagination);
      } else {
        onPaginationChange(updater);
      }
    },
    onRowSelectionChange: onRowSelectionChange,
    rowCount: totalProducts,
    state: {
      pagination,
      rowSelection,
    },
    initialState: {
      showGlobalFilter: true,
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    mantineSearchTextInputProps: {
      placeholder: "Search products by name, vendor, or category...",
      size: "sm",
      leftSection: <FiEye />,
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
      onClick: () => onViewDetails(row.original),
    }),
    renderTopToolbarCustomActions: () => (
      <div className="flex gap-2">
        <Button
          color="green"
          onClick={onCreateProduct}
          leftSection={<FiPlus size={16} />}
          size="sm"
        >
          Create New Product
        </Button>
        <Button
          color="blue"
          variant="light"
          onClick={onExportSelected}
          size="sm"
          disabled={selectedProductIds.length === 0}
        >
          Export Selected
        </Button>
        <Button
          color="red"
          variant="light"
          onClick={onBulkDelete}
          size="sm"
          disabled={selectedProductIds.length === 0}
        >
          Delete Selected ({selectedProductIds.length})
        </Button>
      </div>
    ),
  });

  return <MantineReactTable table={table} />;
};

export default ProductTable;
