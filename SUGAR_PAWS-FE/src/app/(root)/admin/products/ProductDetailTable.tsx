"use client";

import React from "react";
import { useGetProductDetail } from "@/hooks/queries/useProducts";
import Image from "next/image";
import { MantineReactTable, MRT_ColumnDef } from "mantine-react-table";
import { FiEdit } from "react-icons/fi";
import { Button } from "@mantine/core";

interface ProductDetailTableProps {
  productId: string;
  onEditDetail?: (detail: ProductDetail) => void;
}

// Define a local interface that matches the structure we need
interface ProductDetail {
  id: number;
  productId: string | number;
  size: string;
  color: string;
  stock: number;
  sale: number;
  price: number;
  image?: {
    url: string;
  };
}

const ProductDetailTable: React.FC<ProductDetailTableProps> = ({
  productId,
  onEditDetail,
}) => {
  const { getProductDetail } = useGetProductDetail(productId);
  const productDetailData = getProductDetail.data;
  const loadingDetail = getProductDetail.isLoading;
  const errorDetail = getProductDetail.error?.message || null;

  const columns: MRT_ColumnDef<ProductDetail>[] = [
    {
      accessorKey: "size",
      header: "Size",
      Cell: ({ cell }) => <span>{cell.getValue<string>() || "-"}</span>,
      size: 80,
    },
    {
      accessorKey: "color",
      header: "Color",
      Cell: ({ cell }) => {
        const colorValue = cell.getValue<string>();
        return <span>{colorValue || "-"}</span>;
      },
      size: 100,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      Cell: ({ cell }) => <span>{cell.getValue<number>()}</span>,
      size: 80,
    },
    {
      accessorKey: "sale",
      header: "Sale (%)",
      Cell: ({ cell }) => <span>{cell.getValue<number>() ?? 0}</span>,
      size: 80,
    },
    {
      accessorKey: "price",
      header: "Price",
      Cell: ({ cell }) => {
        const price = cell.getValue<number>();
        return (
          <span>{price ? `${price.toLocaleString("vi-VN")}₫` : "0₫"}</span>
        );
      },
      size: 100,
    },
    {
      accessorKey: "image",
      header: "Image",
      Cell: ({ row }) => {
        const image = row.original.image;
        return (
          <div className="w-12 h-12 mr-auto relative">
            {image && image.url ? (
              <Image
                src={
                  image.url.startsWith("//") ? `https:${image.url}` : image.url
                }
                alt=""
                fill
                className="object-cover rounded"
                sizes="48px"
              />
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
      size: 100,
    },
    {
      id: "actions",
      header: "Action",
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <Button
            size="md"
            variant="subtle"
            color="orange"
            radius="xl"
            onClick={(e) => {
              e.stopPropagation();
              if (onEditDetail) onEditDetail(row.original);
            }}
            style={{
              minWidth: 32,
              minHeight: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              backgroundColor: "transparent",
            }}
            title="Edit Product Detail"
          >
            <FiEdit size={16} />
          </Button>
        </div>
      ),
      size: 80,
      enableSorting: false,
    },
  ];

  if (loadingDetail)
    return <div className="px-8 py-4">Đang tải chi tiết...</div>;
  if (errorDetail)
    return <div className="px-8 py-4 text-red-500">{errorDetail}</div>;
  if (
    !productDetailData ||
    !productDetailData.productDetails ||
    productDetailData.productDetails.length === 0
  )
    return <div className="px-8 py-4">Không có chi tiết sản phẩm.</div>;

  // Convert imported product details to the type expected by the table
  const tableData: ProductDetail[] = (
    productDetailData.productDetails || []
  ).map((detail) => ({
    id: detail.id,
    productId: detail.productId,
    size: detail.size || "",
    color: detail.color || "",
    stock: detail.stock,
    sale: detail.sale,
    price: detail.price,
    image: detail.image,
  }));

  return (
    <MantineReactTable
      columns={columns}
      data={tableData}
      enableRowSelection={false}
      enableColumnActions={false}
      enableColumnFilters={false}
      enableSorting={true}
      enablePagination={true}
      initialState={{
        density: "xs",
        pagination: { pageIndex: 0, pageSize: 10 },
      }}
      mantineTableProps={{
        striped: true,
        highlightOnHover: true,
        withTableBorder: true,
        withColumnBorders: false,
      }}
      mantinePaginationProps={{
        showRowsPerPage: true,
        rowsPerPageOptions: ["10", "20", "30", "50"],
      }}
    />
  );
};

export default ProductDetailTable;
