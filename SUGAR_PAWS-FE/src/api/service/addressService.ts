import {
  City,
  District,
  ShippingAddress,
  UpdateAddressDTO,
  Ward,
} from "@/types/address";
import { useRequest } from "../Request";
import { Params } from "../Request";

export function useAddressService() {
  const { Request } = useRequest();

  const getByUserId = async (userId: number) => {
    try {
      const { data } = await Request.get<ShippingAddress[]>(
        `/shipping-addresses/user/${userId}`,
      );
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("getByUserId Error:", err.response?.data || err.message);
      throw new Error(
        err.response?.data?.message || "Failed to get addresses by user id.",
      );
    }
  };

  const getMyAddresses = async () => {
    try {
      const { data } = await Request.get<ShippingAddress[]>(
        "/shipping-addresses/my-addresses",
      );
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("getMyAddresses Error:", err.response?.data || err.message);
      throw new Error(
        err.response?.data?.message || "Failed to get my addresses.",
      );
    }
  };

  const createAddress = async (params: Params) => {
    try {
      const { data } = await Request.post<ShippingAddress>(
        "/shipping-addresses",
        params,
      );
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("createAddress Error:", err.response?.data || err.message);
      throw new Error(
        err.response?.data?.message || "Failed to create address.",
      );
    }
  };

  const getAddressById = async (id: number) => {
    try {
      const { data } = await Request.get<ShippingAddress>(
        `/shipping-addresses/${id}`,
      );
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("getAddressById Error:", err.response?.data || err.message);
      throw new Error(
        err.response?.data?.message || "Failed to get address by id.",
      );
    }
  };

  const updateAddress = async (id: number, params: UpdateAddressDTO) => {
    try {
      const { data } = await Request.patch<ShippingAddress>(
        `/shipping-addresses/${id}`,
        params,
      );
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("updateAddress Error:", err.response?.data || err.message);
      throw new Error(
        err.response?.data?.message || "Failed to update address.",
      );
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      const { data } = await Request.del(
        `/shipping-addresses/${id}`,
        undefined,
        undefined,
      );
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("deleteAddress Error:", err.response?.data || err.message);
      throw new Error(
        err.response?.data?.message || "Failed to delete address.",
      );
    }
  };

  const getAllCities = async () => {
    try {
      const { data } = await Request.get<City[]>("/cities");
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error("getCities Error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Failed to get cities.");
    }
  };

  const getDistrictsByCityId = async (cityId: number) => {
    try {
      const { data } = await Request.get<District[]>(
        `/districts/city/${cityId}/`,
      );
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error(
        "getDistrictsByCityId Error:",
        err.response?.data || err.message,
      );
      throw new Error(
        err.response?.data?.message || "Failed to get districts by city id.",
      );
    }
  };

  const getWardsByDistrictId = async (districtId: number) => {
    try {
      const { data } = await Request.get<Ward[]>(
        `/wards/district/${districtId}/`,
      );
      return data;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      console.error(
        "getWardsByDistrictId Error:",
        err.response?.data || err.message,
      );
      throw new Error(
        err.response?.data?.message || "Failed to get wards by district id.",
      );
    }
  };

  return {
    getByUserId,
    getMyAddresses,
    createAddress,
    getAddressById,
    updateAddress,
    deleteAddress,
    getAllCities,
    getDistrictsByCityId,
    getWardsByDistrictId,
  };
}
