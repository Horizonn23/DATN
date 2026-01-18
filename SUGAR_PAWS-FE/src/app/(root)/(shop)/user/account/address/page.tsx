"use client";

import { ShippingAddress } from "@/types/address";
import React from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import {
  useGetMyAddresses,
  useDeleteAddress,
  useUpdateAddress,
} from "@/hooks/queries/useAddress";
import { Spinner } from "@/components/ui/Spinner";
import { AddressModal } from "@/components/user/AddressModal";

const AddressPage = () => {
  const getMyAddressesQuery = useGetMyAddresses();
  const deleteAddressMutation = useDeleteAddress();
  const updateAddressMutation = useUpdateAddress();

  const addresses: ShippingAddress[] | [] = getMyAddressesQuery.data || [];

  const [selectedAddressId, setSelectedAddressId] = React.useState<
    number | null
  >(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleSetDefault = (id: number) => {
    const address = addresses.find((addr) => addr.id === id);
    if (!address) return;
    updateAddressMutation.mutate({
      id: address.id,
      params: { isDefault: true },
    });
  };

  const handleDelete = (id: number) => {
    deleteAddressMutation.mutate(id);
  };

  const handleUpdate = (id: number) => {
    setSelectedAddressId(id);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAddressId(null);
    setModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-10 text-custom-wine text-center tracking-tight drop-shadow-sm">
          My Addresses
        </h2>
        <div className="flex flex-col gap-6 w-full max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-800">
              Address List
            </span>
            <button
              className="bg-white border-2 border-custom-wine text-custom-wine px-5 py-1 rounded-xl font-semibold hover:bg-custom-wine hover:text-white transition-all shadow"
              onClick={handleAddNew}
            >
              + Add New Address
            </button>
          </div>
          {getMyAddressesQuery.isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="md" color="text-custom-wine" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No addresses found.
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className="border border-gray-200 rounded-2xl p-6 bg-gray-50 shadow-md"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="w-2/3">
                    <div className="font-bold text-lg text-gray-800 mb-1">
                      {addr.fullName}
                      <span className="text-sm text-gray-500 font-normal ml-2">
                        ({addr.phoneNumber})
                      </span>
                    </div>
                    <div className="text-gray-700 mb-2">
                      {addr.homeNumber}, {addr.ward.name},{" "}
                      {addr.ward.district.name}, {addr.ward.district.city.name}
                    </div>
                    {addr.moreDetail && (
                      <div className="text-gray-500 text-sm mb-2">
                        {addr.moreDetail}
                      </div>
                    )}
                    {addr.isDefault ? (
                      <span className="inline-block bg-custom-pink text-custom-wine text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    ) : (
                      <button
                        className="border border-custom-wine text-custom-wine hover:bg-custom-pink hover:border-none text-xs px-2 py-1 rounded-lg transition"
                        onClick={() => handleSetDefault(addr.id)}
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    <button
                      className="text-custom-rose hover:text-custom-wine p-2 rounded-full transition-transform duration-200 hover:scale-110"
                      title="Update"
                      onClick={() => handleUpdate(addr.id)}
                    >
                      <FaPencilAlt size={18} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-custom-wine p-2 rounded-full transition-transform duration-200 hover:scale-110"
                      title="Delete"
                      onClick={() => handleDelete(addr.id)}
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <AddressModal
        addressId={selectedAddressId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        setSelectedAddressId={setSelectedAddressId}
      />
    </>
  );
};

export default AddressPage;
