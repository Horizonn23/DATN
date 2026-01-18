import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductservice } from "@/api/service/productService";
import { UploadProductDto } from "@/types/product";

export function useUpdateProduct() {
  const { updateProduct } = useProductservice();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      data,
      images,
    }: {
      id: string;
      data: Partial<UploadProductDto>;
      images?: File[];
    }) => {
      return await updateProduct(id, data, images);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
      queryClient.invalidateQueries({
        queryKey: ["productDetail", variables.id],
      });
    },
  });

  return { updateProductMutation: mutation };
}
