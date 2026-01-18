"use client";

import React, { useState, useEffect } from "react";
import {
  useGetAllProducts,
  useUpdateProduct,
  useCreateProduct,
  useDeleteProduct,
  useDeleteManyProducts,
} from "@/hooks/queries/useProducts";
import { Product } from "@/types/product";
import { FaTimes, FaSync } from "react-icons/fa";
import { Button, Title, Box, LoadingOverlay, Paper, Text } from "@mantine/core";
import { showErrorToast } from "@/components/ui/ErrorToast";
import { showSuccessToast } from "@/components/ui/SuccessToast";
import { showWarningToast } from "@/components/ui/WarningToast";
import { showConfirmToast } from "@/components/ui/ConfirmToast";
import ProductTable from "./ProductTable";
import ProductHeader from "./ProductHeader";
import ProductModal from "./ProductModal";
import ProductDetailModal from "./ProductDetailModal";
import ProductDetailTableModal from "./ProductDetailTableModal";

const AdminProductsPage = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { getAllProducts } = useGetAllProducts({
    page: pagination.pageIndex + 1,
    itemPerPage: pagination.pageSize,
  });
  const { data: productsData, isLoading, error, refetch } = getAllProducts;
  const products = productsData?.products;

  // Modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailTableModalOpen, setDetailTableModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Mutations
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: deleteManyProducts } = useDeleteManyProducts();

  // Selected products for batch operations
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Update selectedProductIds when rowSelection changes
  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).filter(
      (key) => rowSelection[key],
    );
    setSelectedProductIds(selectedIds);
  }, [rowSelection]);

  // Show loading screen for initial load
  if (isLoading && !products) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <Title order={3} className="text-gray-700 mb-2">
            Loading Products...
          </Title>
          <Text c="dimmed">Please wait while we fetch the latest data</Text>
        </div>
      </div>
    );
  }

  // Handle product creation
  const handleCreateProduct = () => {
    setEditProduct(null);
    setIsEditMode(false);
    setProductModalOpen(true);
  };

  // Handle product editing
  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setIsEditMode(true);
    setProductModalOpen(true);
  };

  // Handle product view details
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  // Handle product detail table view
  const handleViewDetailTable = (productId: string) => {
    setDetailProductId(productId);
    setDetailTableModalOpen(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  // Handle export
  const handleExport = () => {
    console.log("Export products functionality");
  };

  // Handle export selected
  const handleExportSelected = () => {
    console.log("Export selected products");
  };

  // Handle delete product
  const handleDeleteProduct = async (product: Product) => {
    showConfirmToast(
      `Are you sure you want to delete "${product.name}"?`,
      async () => {
        try {
          await deleteProduct(product.id);
          showSuccessToast(`Product "${product.name}" deleted successfully`);
          refetch();
        } catch (error) {
          console.error("Failed to delete product:", error);
          showErrorToast("Failed to delete product. Please try again.");
        }
      },
    );
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) {
      showWarningToast("Please select products to delete");
      return;
    }

    showConfirmToast(
      `Are you sure you want to delete ${selectedProductIds.length} selected products?`,
      async () => {
        try {
          await deleteManyProducts(selectedProductIds);
          showSuccessToast(
            `${selectedProductIds.length} products deleted successfully`,
          );
          setRowSelection({});
          refetch();
        } catch (error) {
          console.error("Failed to delete products:", error);
          showErrorToast("Failed to delete products. Please try again.");
        }
      },
    );
  };

  if (error) {
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
              Error loading products data
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              We encountered an issue while fetching the products. Please try
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
        <ProductHeader
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
      </div>

      <Box pos="relative">
        <LoadingOverlay
          visible={isLoading}
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
              🛍️ Products Data Table
            </Title>
            <Text size="sm" c="dimmed">
              View, filter, and manage all products
            </Text>
          </div>
          <ProductTable
            data={products || []}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            selectedProductIds={selectedProductIds}
            onCreateProduct={handleCreateProduct}
            onEditProduct={handleEditProduct}
            onViewDetails={handleViewDetails}
            onViewDetailTable={handleViewDetailTable}
            onDeleteProduct={handleDeleteProduct}
            onBulkDelete={handleBulkDelete}
            onExportSelected={handleExportSelected}
            pagination={pagination}
            onPaginationChange={setPagination}
            totalProducts={productsData?.totalProducts || 0}
          />
        </Paper>
      </Box>

      {/* Product Modal */}
      <ProductModal
        opened={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        product={editProduct}
        isEditMode={isEditMode}
        onSubmit={async (formData) => {
          try {
            if (isEditMode && editProduct) {
              await updateProduct({
                id: editProduct.id,
                updateData: formData,
                images: formData.images,
              });
              showSuccessToast(
                `Product "${editProduct.name}" updated successfully`,
              );
            } else {
              await createProduct({
                productData: {
                  ...formData,
                  displayImage: formData.displayImage || [],
                },
                images: formData.images,
              });
              showSuccessToast("Product created successfully");
            }
            setProductModalOpen(false);
            refetch();
          } catch (error) {
            console.error("Failed to save product:", error);
            showErrorToast("Failed to save product. Please try again.");
          }
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={selectedProduct}
      />

      {/* Product Detail Table Modal */}
      <ProductDetailTableModal
        open={detailTableModalOpen}
        onClose={() => setDetailTableModalOpen(false)}
        productId={detailProductId || ""}
      />
    </div>
  );
};

export default AdminProductsPage;
