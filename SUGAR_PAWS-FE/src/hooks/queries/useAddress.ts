import { useAddressService } from "@/api/service/addressService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Params } from "@/api/Request";
import { UpdateAddressDTO } from "@/types/address";

export function useGetAddressesByUserId(userId: number) {
  const { getByUserId } = useAddressService();
  return useQuery({
    queryKey: ["addresses", userId],
    queryFn: () => getByUserId(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useGetMyAddresses() {
  const { getMyAddresses } = useAddressService();
  return useQuery({
    queryKey: ["my-addresses"],
    queryFn: async () => {
      const data = await getMyAddresses();
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useGetAddressById(id: number) {
  const { getAddressById } = useAddressService();
  return useQuery({
    queryKey: ["address", id],
    queryFn: () => getAddressById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useCreateAddress() {
  const { createAddress } = useAddressService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: Params) => createAddress(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useUpdateAddress() {
  const { updateAddress } = useAddressService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (args: { id: number; params: UpdateAddressDTO }) => {
      return updateAddress(args.id, args.params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useDeleteAddress() {
  const { deleteAddress } = useAddressService();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-addresses"] });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });
}

export function useGetAllCities() {
  const { getAllCities } = useAddressService();
  return useQuery({
    queryKey: ["cities"],
    queryFn: getAllCities,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
}

export function useGetDistrictsByCityId(cityId: number) {
  const { getDistrictsByCityId } = useAddressService();
  return useQuery({
    queryKey: ["districts", cityId],
    queryFn: () => getDistrictsByCityId(cityId),
    enabled: !!cityId,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
}

export function useGetWardsByDistrictId(districtId: number) {
  const { getWardsByDistrictId } = useAddressService();
  return useQuery({
    queryKey: ["wards", districtId],
    queryFn: () => getWardsByDistrictId(districtId),
    enabled: !!districtId,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
}
