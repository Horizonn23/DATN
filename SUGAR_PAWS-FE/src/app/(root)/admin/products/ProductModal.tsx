import React, { useState, useRef, useEffect } from "react";
import { Button, TextInput, Modal, MultiSelect } from "@mantine/core";
import { Product } from "@/types/product";
import { useGetCategories } from "@/hooks/queries/useCategories";
import { Category } from "@/types/category";
import {
  parseHtmlBlocks,
  parseTable,
  blocksToHtml,
} from "@/components/product/editor/utils";
import ProductDescriptionEditor from "@/components/product/editor/ProductDescriptionEditor";
import ProductImagesEditor from "@/components/product/editor/ProductImagesEditor";
import { DescBlock } from "@/components/product/editor/BlockEditor";

interface ProductModalProps {
  opened: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (data: {
    name: string;
    description: string;
    vendor?: string;
    categories?: number[];
    tags?: string[];
    images?: File[];
    displayImage?: string[];
  }) => void;
  isEditMode: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({
  opened,
  onClose,
  product,
  onSubmit,
  isEditMode,
}) => {
  const [name, setName] = useState(product?.name || "");
  const [vendor, setVendor] = useState(product?.vendor || "");
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    product?.categories?.map((cat: Category) => cat.id) || [],
  );
  const [descBlocks, setDescBlocks] = useState<DescBlock[]>(() =>
    parseHtmlBlocks(product?.description || ""),
  );
  // Table state for each table block
  const [tableStates, setTableStates] = useState<Record<number, string[][]>>(
    {},
  );

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategories();
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Map category IDs to full category objects
    const categoryObjects = selectedCategories.map((catId) => {
      const category = categoriesData?.find((cat) => cat.id === catId);
      return category || ({ id: catId } as Category);
    });

    const formData = {
      name,
      description: blocksToHtml(descBlocks, tableStates),
      vendor,
      categories: categoryObjects.map((cat) => cat.id),
      tags,
      images,
      displayImage: existingImages,
    };

    onSubmit(formData);
  };

  // Sync state when opening modal or switching product
  useEffect(() => {
    if (opened) {
      if (isEditMode && product) {
        // Edit mode with product data
        setName(product.name || "");
        setVendor(product.vendor || "");
        setTags(product.tags || []);
        setSelectedCategories(
          product.categories?.map((cat: Category) => cat.id) || [],
        );
        setDescBlocks(parseHtmlBlocks(product.description || ""));

        // Parse all table blocks
        const newTableStates: Record<number, string[][]> = {};
        parseHtmlBlocks(product.description || "").forEach((block, idx) => {
          if (block.type === "table") {
            newTableStates[idx] = parseTable(block.value);
          }
        });
        setTableStates(newTableStates);

        // Set existing images from product's displayImage
        setExistingImages(product.displayImage || []);
      } else {
        // Create mode - reset all fields
        setName("");
        setVendor("");
        setTags([]);
        setSelectedCategories([]);
        setDescBlocks([]);
        setTableStates({});
        setExistingImages([]);
      }
      // Reset new images in both modes
      setImages([]);
    }
  }, [opened, product, isEditMode]);

  // No need for additional helper functions as they've been moved to components

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditMode ? "Edit Product" : "Create New Product"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter product name"
        />
        <TextInput
          label="Vendor"
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          placeholder="Enter vendor name"
          description="Company or brand that manufactures this product"
        />

        {/* Product Categories */}
        <MultiSelect
          label="Categories"
          data={
            categoriesData?.map((cat) => ({
              value: cat.id.toString(),
              label: cat.name,
            })) || []
          }
          value={selectedCategories.map((id) => id.toString())}
          onChange={(values) =>
            setSelectedCategories(values.map((v) => parseInt(v)))
          }
          searchable
          clearable
          disabled={categoriesLoading}
          description="Select product categories"
        />

        <MultiSelect
          label="Tags"
          data={tags.map((tag) => ({ value: tag, label: tag }))}
          value={tags}
          placeholder="Enter or select tags"
          searchable
          onChange={(values) => setTags(values)}
          description="Product categories or search keywords (e.g. 'organic', 'gluten-free', 'dog food')"
        />
        <ProductDescriptionEditor
          descBlocks={descBlocks}
          setDescBlocks={setDescBlocks}
          tableStates={tableStates}
          setTableStates={setTableStates}
        />

        <ProductImagesEditor
          existingImages={existingImages}
          setExistingImages={setExistingImages}
          images={images}
          setImages={setImages}
          fileInputRef={fileInputRef}
        />

        <Button type="submit" variant="filled">
          {isEditMode ? "Save Changes" : "Create Product"}
        </Button>
      </form>
    </Modal>
  );
};

export default ProductModal;
