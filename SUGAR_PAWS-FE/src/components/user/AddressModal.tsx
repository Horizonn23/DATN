import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { City, District, ShippingAddress, Ward } from "@/types/address";
import {
  useGetAddressById,
  useUpdateAddress,
  useCreateAddress,
  useGetAllCities,
  useGetDistrictsByCityId,
  useGetWardsByDistrictId,
} from "@/hooks/queries/useAddress";
import { Spinner } from "@/components/ui/Spinner";
import { RiCloseLine } from "react-icons/ri";

interface AddressModalProps {
  addressId: number | null;
  open: boolean;
  onClose: () => void;
  setSelectedAddressId: (id: number | null) => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  addressId,
  open,
  onClose,
  setSelectedAddressId,
}) => {
  const { data: address, isLoading } = useGetAddressById(addressId ?? 0);
  const updateAddressMutation = useUpdateAddress();
  const createAddressMutation = useCreateAddress();

  const { register, handleSubmit, reset, setValue, watch } = useForm<
    ShippingAddress & {
      cityCode: number | "";
      districtCode: number | "";
    }
  >();

  const selectedCity = watch("cityCode");
  const selectedDistrict = watch("districtCode");

  const { data: cities, isLoading: isCitiesLoading } = useGetAllCities();
  const { data: districts, isLoading: isDistrictsLoading } =
    useGetDistrictsByCityId(Number(selectedCity) || 0);
  const { data: wards, isLoading: isWardsLoading } = useGetWardsByDistrictId(
    Number(selectedDistrict) || 0,
  );

  useEffect(() => {
    if (addressId && address) {
      reset({
        fullName: address.fullName,
        phoneNumber: address.phoneNumber,
        homeNumber: address.homeNumber,
        moreDetail: address.moreDetail,
        wardCode: address.ward.wardCode,
        cityCode: address.ward.district.city.cityCode,
        districtCode: address.ward.district.districtCode,
      });
    } else {
      reset({
        fullName: "",
        phoneNumber: "",
        homeNumber: "",
        moreDetail: "",
        wardCode: undefined,
        cityCode: "",
        districtCode: "",
      });
    }
  }, [addressId, address, reset]);

  const onSubmit = (data: ShippingAddress) => {
    const formData = {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      homeNumber: data.homeNumber,
      moreDetail: data.moreDetail,
      wardCode: Number(data.wardCode),
    };

    if (addressId) {
      updateAddressMutation.mutate(
        { id: addressId, params: formData },
        {
          onSuccess: () => {
            setSelectedAddressId(null);
            onClose();
          },
        },
      );
    } else {
      createAddressMutation.mutate(formData, {
        onSuccess: () => {
          setSelectedAddressId(null);
          onClose();
        },
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl relative">
        <button
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-700"
          onClick={() => {
            setSelectedAddressId(null);
            onClose();
          }}
        >
          <RiCloseLine size={28} />
        </button>
        <h3 className="text-xl font-bold mb-6 text-custom-wine">
          {addressId ? "Update your address" : "Add a new address"}
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* Full Name & Phone Number */}
            <div className="flex gap-2">
              <div className="flex flex-col">
                <label className="font-semibold mb-1">Full Name</label>
                <input
                  {...register("fullName", { required: true })}
                  placeholder="Full Name"
                  className="border rounded p-2"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="font-semibold mb-1">Phone Number</label>
                <input
                  {...register("phoneNumber", { required: true })}
                  placeholder="Phone Number"
                  className="border rounded p-2"
                />
              </div>
            </div>

            {/* City */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1">City (Province)</label>
              <div className="relative">
                <select
                  {...register("cityCode", { required: true })}
                  onChange={(e) => {
                    const cityCode = Number(e.target.value);
                    setValue("cityCode", cityCode);
                    setValue("districtCode", "");
                    setValue("wardCode", "");
                  }}
                  className="border rounded-xl p-2 w-full pr-10"
                  disabled={isCitiesLoading}
                >
                  <option value="">Select City/Province</option>
                  {cities?.map((city: City) => (
                    <option key={city.cityCode} value={city.cityCode}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* District */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1">District</label>
              <div className="relative">
                <select
                  {...register("districtCode", { required: true })}
                  onChange={(e) => {
                    const districtCode = Number(e.target.value);
                    setValue("districtCode", districtCode);
                    setValue("wardCode", "");
                  }}
                  className="border rounded-xl p-2 w-full pr-10"
                  disabled={!selectedCity || isDistrictsLoading}
                >
                  <option value="">Select District</option>
                  {districts?.map((district: District) => (
                    <option
                      key={district.districtCode}
                      value={district.districtCode}
                    >
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ward */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Ward</label>
              <div className="relative">
                <select
                  {...register("wardCode", {
                    required: true,
                    setValueAs: (v) => (v === "" ? undefined : Number(v)),
                  })}
                  className="border rounded-xl p-2 w-full pr-10"
                  disabled={!selectedDistrict || isWardsLoading}
                >
                  <option value="">Select Ward</option>
                  {wards?.map((ward: Ward) => (
                    <option key={ward.wardCode} value={ward.wardCode}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* House Number */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1">House Number</label>
              <input
                {...register("homeNumber", { required: true })}
                placeholder="House Number"
                className="border rounded p-2"
              />
            </div>

            {/* More Detail */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1">More Detail</label>
              <input
                {...register("moreDetail")}
                placeholder="More Detail"
                className="border rounded p-2"
              />
            </div>

            <button
              type="submit"
              className="bg-custom-wine text-white px-4 py-2 rounded font-semibold hover:bg-custom-pink transition"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
