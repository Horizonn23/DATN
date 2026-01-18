import { useUserService } from "@/api/service/userService";
import { User } from "@/types/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthToken } from "@/helper/storage";

export function useGetMyInfo() {
  const { getMyInfo } = useUserService();

  const getMyInfoQuery = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => getMyInfo(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    enabled: !!getAuthToken(),
  });

  return { getMyInfo: getMyInfoQuery };
}

export function useUpdateMyInfo() {
  const { updateProfile } = useUserService();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // Refetch user info after update
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });

  return mutation;
}

export function useGetAllUsers() {
  const { getAllUsers } = useUserService();

  const getAllUsersQuery = useQuery({
    queryKey: ["users", "all"],
    queryFn: () => getAllUsers(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { getAllUsers: getAllUsersQuery };
}

export function useCreateUser() {
  const { createUser } = useUserService();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
    },
  });

  return mutation;
}

export function useUpdateUser() {
  const { updateUser } = useUserService();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
    },
  });

  return mutation;
}
