import React from "react";
import Modal from "@/components/ui/Modal";
import ProductDetailTable from "./ProductDetailTable";

interface ProductDetailTableModalProps {
  productId: string | null;
  open: boolean;
  onClose: () => void;
}

const ProductDetailTableModal: React.FC<ProductDetailTableModalProps> = ({
  productId,
  open,
  onClose,
}) => {
  if (!productId) return null;

  return (
    <Modal open={open} onClose={onClose} size="large" width="90%">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Product Category
        </h2>
        <ProductDetailTable productId={productId} />
      </div>
    </Modal>
  );
};

export default ProductDetailTableModal;
