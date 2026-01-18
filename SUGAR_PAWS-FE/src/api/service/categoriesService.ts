import { Category } from "@/types/category";
import API from "../api";
import { useRequest } from "../Request";

export function useCategoriesService() {
  const { Request } = useRequest();

  const getCategories = async () => {
    return await Request.get<Category[]>(API.CATEGORIES);
  };

  return {
    getCategories,
  };
}
