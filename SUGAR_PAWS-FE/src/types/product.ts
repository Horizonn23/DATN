import { Category } from "./category";

export type Product = {
  id: string;
  name: string;
  minPrice: number;
  maxPrice: number;
  displayImage: string[];
  vendor?: string;
  colors: string[];
  totalStock: number;
  discount?: number;
  totalSales?: number;
  sizes?: string[];
  types?: string[];
  reviewStars?: number;
  tags?: string[];
  rating?: number;
  description?: string;
  productDetails?: ProductDetail[];
  categories?: Category[];
};

export type UploadProductDto = {
  id: string;
  name: string;
  displayImage: string[];
  vendor?: string;
  discount?: number;
  sizes?: string[];
  tags?: string[];
  description?: string;
  categories?: number[];
};

export type ProductDetail = {
  id: number;
  productId: string | number;
  name?: string;
  vendor?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  color?: string;
  size?: string;
  type?: string;
  image: ImageDetail;
  moreDetails: string[];
  product?: Product;
  productName?: string;
  displayImage?: string[];
  sale: number;
  stock: number;
};

export type ImageDetail = {
  id: number | string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Review = {
  id: number;
  orderItemId: number;
  rating: number;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  productName?: string;
  productId?: number;
  orderDate?: string;
  orderId?: number;
  // Legacy fields for compatibility
  name?: string;
  time?: string;
  title?: string;
};

export type GetProductsRequest = {
  categoryName: string;
  colors?: string[];
  sizes?: string[];
  availability?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  itemPerPage?: number;
};

export type GetColorsRequest = {
  categoryName: string;
};

export type GetSizesRequest = {
  categoryName: string;
};
