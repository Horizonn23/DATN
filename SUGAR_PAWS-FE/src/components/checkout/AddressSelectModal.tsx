import React from "react";
import { ShippingAddress } from "@/types/address";
import { useGetMyAddresses } from "@/hooks/queries/useAddress";
import { Spinner } from "@/components/ui/Spinner";
import { AddressModal } from "@/components/user/AddressModal";
import Modal from "@/components/ui/Modal";

interface AddressSelectModalProps {
  open: boolean;
  onClose: () => void;
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
}

export const AddressSelectModal: React.FC<AddressSelectModalProps> = ({
  open,
  onClose,
  selectedAddressId,
  setSelectedAddressId,
}) => {
  const { data: addresses = [], isLoading } = useGetMyAddresses();

  const handleSelect = (id: number) => {
    setSelectedAddressId(id);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="medium" width="600px">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6 text-custom-wine">
          Select shipping address
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No address found.
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-h-80 overflow-y-auto mb-4">
            {addresses.map((addr: ShippingAddress) => (
              <div
                key={addr.id}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  addr.id === selectedAddressId
                    ? "border-custom-wine bg-custom-pink/20"
                    : "border-gray-200 bg-gray-50 hover:border-custom-wine"
                }`}
                onClick={() => handleSelect(addr.id)}
              >
                <div className="font-bold text-base text-gray-800 mb-1">
                  {addr.fullName}
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    ({addr.phoneNumber})
                  </span>
                </div>
                <div className="text-gray-700 text-sm">
                  {addr.homeNumber}, {addr.ward.name}, {addr.ward.district.name}
                  , {addr.ward.district.city.name}
                </div>
                {addr.moreDetail && (
                  <div className="text-gray-500 text-xs mb-1">
                    {addr.moreDetail}
                  </div>
                )}
                {addr.isDefault && (
                  <span className="inline-block bg-custom-pink text-custom-wine text-xs px-2 py-1 rounded mt-1">
                    Default
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        <AddressModal
          addressId={null}
          open={false}
          onClose={() => {}}
          setSelectedAddressId={() => {}}
        />
        <button
          className="w-full mt-2 bg-custom-wine text-white px-4 py-2 rounded font-semibold hover:bg-custom-rose transition"
          onClick={() => setSelectedAddressId(null)}
        >
          + Add new address
        </button>
      </div>
    </Modal>
  );
};
