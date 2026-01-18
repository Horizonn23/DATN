import { useCategoriesService } from "@/api/service/categoriesService";
import { useQuery } from "@tanstack/react-query";

export function useGetCategories() {
  const { getCategories } = useCategoriesService();

  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategories();
      return response.data;
    },
  });
}
