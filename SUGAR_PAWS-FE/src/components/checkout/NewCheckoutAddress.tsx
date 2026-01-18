"use client";
import React, { useState, useEffect } from "react";
import { useGetMyAddresses } from "@/hooks/queries/useAddress";
import { Spinner } from "@/components/ui/Spinner";
import { AddressModal } from "@/components/user/AddressModal";
import { AddressSelectModal } from "./AddressSelectModal";
import CheckoutSectionHeader from "./CheckoutSectionHeader";
import AddressDisplayCard from "./AddressDisplayCard";

interface CheckoutAddressProps {
  setSelectedAddressId: (id: number | null) => void;
}

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({
  setSelectedAddressId,
}) => {
  const { data: addresses = [], isLoading } = useGetMyAddresses();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [localSelectedAddressId, setLocalSelectedAddressId] = useState<
    number | null
  >(null);

  // Find default address
  const defaultAddress =
    addresses.find((addr) => addr.isDefault) || addresses[0];

  // Update both local and parent state when address changes
  useEffect(() => {
    if (defaultAddress) {
      setLocalSelectedAddressId(defaultAddress.id);
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, defaultAddress, setSelectedAddressId]);

  const selectedAddress =
    addresses.find((addr) => addr.id === localSelectedAddressId) ||
    defaultAddress;

  // Handle address selection
  const handleAddressSelected = (id: number | null) => {
    setLocalSelectedAddressId(id);
    setSelectedAddressId(id);
    setSelectModalOpen(false);
    if (id === null) setModalOpen(true); // open add new address modal
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <CheckoutSectionHeader
        icon="📍"
        title="Shipping Address"
        gradient="from-custom-rose to-custom-pink"
      />

      <button
        className="bg-custom-pink border-[1px] border-custom-wine text-custom-wine mt-2 ml-4 px-3 py-[2px] rounded-full text-[12px] transition-colors"
        onClick={() => setSelectModalOpen(true)}
      >
        Change
      </button>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Spinner size="md" />
          </div>
        ) : selectedAddress ? (
          <AddressDisplayCard address={selectedAddress} compact={true} />
        ) : (
          <div className="text-center py-6">
            <div className="text-custom-purple text-3xl mb-2">📍</div>
            <div className="text-custom-dark font-medium mb-2">
              No shipping address found.
            </div>
            <button
              className="bg-custom-wine hover:bg-custom-wine/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => setSelectModalOpen(true)}
            >
              Add Address
            </button>
          </div>
        )}
      </div>

      <AddressSelectModal
        open={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        selectedAddressId={localSelectedAddressId}
        setSelectedAddressId={handleAddressSelected}
      />
      <AddressModal
        addressId={null}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        setSelectedAddressId={(id) => {
          setLocalSelectedAddressId(id);
          setSelectedAddressId(id);
        }}
      />
    </div>
  );
};

export default CheckoutAddress;
