/* eslint-disable prettier/prettier */
import API from "@/api/api";
import { useRequest } from "@/api/Request";
import {
  GetColorsRequest,
  GetProductsRequest,
  GetSizesRequest,
  Product,
  UploadProductDto,
} from "@/types/product";

export function useProductservice() {
  const { Request } = useRequest();

  const getProducts = async ({
    categoryName,
    colors,
    sizes,
    minPrice,
    maxPrice,
    sortBy,
    page,
    itemPerPage,
  }: GetProductsRequest) => {
    try {
      const { data } = await Request.get<{
        products: Product[];
        totalProducts: number;
      }>(API.PRODUCTS, {
        category: categoryName,
        colors: colors,
        sizes: sizes,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sortBy: sortBy,
        page: page,
        itemPerPage: itemPerPage,
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: unknown) {
      let message = "Failed to fetch products.";
      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = err.response?.data?.message || err.message || message;
        console.error("GetProducts Error:", err.response?.data || err.message);
      } else {
        console.error("GetProducts Error:", error);
      }
      throw new Error(message);
    }
  };

  const getAllProducts = async ({
    page = 1,
    itemPerPage = 10,
  }: {
    page?: number;
    itemPerPage?: number;
  }) => {
    try {
      const { data } = await Request.get<{
        products: Product[];
        totalProducts: number;
      }>(API.ALL_PRODUCTS, {
        page,
        itemPerPage,
      });
      return data;
    } catch (error: unknown) {
      let message = "Failed to fetch all products.";
      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = err.response?.data?.message || err.message || message;
        console.error(
          "GetAllProducts Error:",
          err.response?.data || err.message
        );
      } else {
        console.error("GetAllProducts Error:", error);
      }
      throw new Error(message);
    }
  };

  const getColors = async ({ categoryName }: GetColorsRequest) => {
    try {
      const { data } = await Request.get<string[]>(API.COLORS, {
        category: categoryName,
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("GetColors Error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch colors."
      );
    }
  };

  const getSizes = async ({ categoryName }: GetSizesRequest) => {
    try {
      const { data } = await Request.get<string[]>(API.SIZES, {
        category: categoryName,
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("GetSizesError:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch colors."
      );
    }
  };

  const getProductDetail = async (id: string) => {
    try {
      const { data } = await Request.get<Product>(API.PRODUCT_DETAIL + id);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(
        "GetProductDetail Error:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch product detail."
      );
    }
  };

  const createProduct = async (
    productData: Omit<UploadProductDto, "id">,
    images?: File[]
  ) => {
    try {
      const formData = new FormData();

      // Always ensure required arrays are defined even if empty
      if (!productData.categories) productData.categories = [];
      if (!productData.tags) productData.tags = [];
      if (!productData.displayImage) productData.displayImage = [];

      Object.entries(productData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (key === "categories" && Array.isArray(value)) {
          // Handle categories array - backend expects array format with numeric values
          if (value.length > 0) {
            value.forEach((catId) => {
              // Ensure category IDs are valid numbers
              const numericId = Number(catId);
              if (!isNaN(numericId)) {
                formData.append("categories[]", numericId.toString());
              }
            });
          }
        } else if (key === "tags" && Array.isArray(value)) {
          // Handle tags array - backend expects array format
          if (value.length === 0) {
            // If array is empty, still send an empty array marker
            formData.append("tags[]", "");
          } else {
            value.forEach((tag) => {
              formData.append("tags[]", tag.toString());
            });
          }
        } else if (key === "displayImage" && Array.isArray(value)) {
          // Handle displayImage array - backend expects array format
          if (value.length === 0) {
            // If array is empty, still send an empty array marker
            formData.append("displayImage[]", "");
          } else {
            value.forEach((url) => {
              if (typeof url === "string") {
                formData.append("displayImage[]", url);
              }
            });
          }
        } else if (Array.isArray(value)) {
          // Handle other arrays
          if (value.length === 0) {
            formData.append(`${key}[]`, "");
          } else {
            value.forEach((item) => {
              formData.append(`${key}[]`, item.toString());
            });
          }
        } else {
          formData.append(key, value.toString());
        }
      });

      images?.forEach((image) => {
        formData.append("images", image);
      });

      const { data } = await Request.post<Product>(
        API.ALL_PRODUCTS,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
        formData as any,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    } catch (error: unknown) {
      let message = "Failed to create product.";
      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = err.response?.data?.message || err.message || message;
        console.error(
          "CreateProduct Error:",
          err.response?.data || err.message
        );
      } else {
        console.error("CreateProduct Error:", error);
      }
      throw new Error(message);
    }
  };

  const updateProduct = async (
    id: string,
    updateData: Partial<UploadProductDto>,
    images?: File[]
  ) => {
    try {
      // If there are no images, use the regular JSON update
      if (!images || images.length === 0) {
        const { data } = await Request.patch<Product>(
          API.PRODUCT_DETAIL + id,
          updateData
        );
        return data;
      }

      // Create FormData for handling file uploads
      const formData = new FormData();

      // Always ensure required arrays are defined even if empty
      if (updateData.categories === undefined) updateData.categories = [];
      if (updateData.tags === undefined) updateData.tags = [];
      if (updateData.displayImage === undefined) updateData.displayImage = [];

      // Append product data
      Object.entries(updateData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (key === "categories" && Array.isArray(value)) {
          // Handle categories array - backend expects array format with numeric values
          if (value.length > 0) {
            value.forEach((catId) => {
              // Ensure category IDs are valid numbers
              const numericId = Number(catId);
              if (!isNaN(numericId)) {
                formData.append("categories[]", numericId.toString());
              }
            });
          }
        } else if (key === "tags" && Array.isArray(value)) {
          // Handle tags array - backend expects array format
          if (value.length === 0) {
            // If array is empty, still send an empty array marker
            formData.append("tags[]", "");
          } else {
            value.forEach((tag) => {
              formData.append("tags[]", tag.toString());
            });
          }
        } else if (key === "displayImage" && Array.isArray(value)) {
          // Handle displayImage array - backend expects array format
          if (value.length === 0) {
            // If array is empty, still send an empty array marker
            formData.append("displayImage[]", "");
          } else {
            value.forEach((url) => {
              if (typeof url === "string") {
                formData.append("displayImage[]", url);
              }
            });
          }
        } else if (Array.isArray(value)) {
          // Handle other arrays
          if (value.length === 0) {
            formData.append(`${key}[]`, "");
          } else {
            value.forEach((item) => {
              formData.append(`${key}[]`, item.toString());
            });
          }
        } else {
          formData.append(key, value.toString());
        }
      });

      // Append new images
      images.forEach((image) => {
        formData.append("images", image);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
      const { data } = await Request.patch<Product>(
        API.PRODUCT_DETAIL + id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
        formData as any,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (error: unknown) {
      let message = "Failed to update product.";
      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = err.response?.data?.message || err.message || message;
        console.error(
          "UpdateProduct Error:",
          err.response?.data || err.message
        );
      } else {
        console.error("UpdateProduct Error:", error);
      }
      throw new Error(message);
    }
  };

  const searchProducts = async ({
    searchTerm,
    page = 1,
    itemPerPage = 40,
  }: {
    searchTerm: string;
    page?: number;
    itemPerPage?: number;
  }) => {
    try {
      if (!searchTerm || searchTerm.trim() === "") {
        throw new Error("Search term is required");
      }

      const { data } = await Request.get<{
        products: Product[];
        totalProducts: number;
      }>(API.SEARCH_PRODUCTS, {
        name: searchTerm.trim(),
        page,
        itemPerPage,
      });
      return data;
    } catch (error: unknown) {
      let message = "Failed to search products.";
      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = err.response?.data?.message || err.message || message;
        console.error(
          "SearchProducts Error:",
          err.response?.data || err.message
        );
      } else {
        console.error("SearchProducts Error:", error);
      }
      throw new Error(message);
    }
  };

  const getRelatedProducts = async (productId: string) => {
    try {
      const { data } = await Request.get<Product[]>(
        API.PRODUCT_DETAIL + productId + "/related"
      );
      return data;
    } catch (error: unknown) {
      let message = "Failed to fetch related products.";
      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = err.response?.data?.message || err.message || message;
        console.error(
          "GetRelatedProducts Error:",
          err.response?.data || err.message
        );
      } else {
        console.error("GetRelatedProducts Error:", error);
      }
      throw new Error(message);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { data } = await Request.del(API.ALL_PRODUCTS + "/" + productId);
      return data;
    } catch (error: unknown) {
      let message = "Failed to delete product.";
      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = err.response?.data?.message || err.message || message;
        console.error(
          "DeleteProduct Error:",
          err.response?.data || err.message
        );
      } else {
        console.error("DeleteProduct Error:", error);
      }
      throw new Error(message);
    }
  };

  const deleteManyProducts = async (productIds: string[]) => {
    try {
      const { data } = await Request.del(API.ALL_PRODUCTS, undefined, {
        productIds: productIds.map((id) => parseInt(id, 10)),
      });
      return data;
    } catch (error: unknown) {
      let message = "Failed to delete products.";
      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        message = err.response?.data?.message || err.message || message;
        console.error(
          "DeleteManyProducts Error:",
          err.response?.data || err.message
        );
      } else {
        console.error("DeleteManyProducts Error:", error);
      }
      throw new Error(message);
    }
  };

  return {
    getProducts,
    getColors,
    getSizes,
    getProductDetail,
    getAllProducts,
    updateProduct,
    createProduct,
    getRelatedProducts,
    searchProducts,
    deleteProduct,
    deleteManyProducts,
  };
}
