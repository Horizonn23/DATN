import React from "react";
import { ShippingAddress } from "@/types/address";

interface AddressDisplayCardProps {
  address: ShippingAddress;
  compact?: boolean;
}

const AddressDisplayCard: React.FC<AddressDisplayCardProps> = ({
  address,
  compact = false,
}) => {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {/* Name and Phone */}
      <div className="flex items-center gap-2">
        <div
          className={`${compact ? "w-8 h-8" : "w-10 h-10"} bg-custom-pink/30 rounded-full flex items-center justify-center`}
        >
          <span className="text-custom-purple font-bold text-sm">👤</span>
        </div>
        <div>
          <div
            className={`font-bold text-custom-dark ${compact ? "text-base" : "text-lg"}`}
          >
            {address.fullName}
          </div>
          <div className="text-custom-wine font-medium text-sm">
            📞 {address.phoneNumber}
          </div>
        </div>
        {address.isDefault && (
          <span className="ml-auto bg-custom-rose/20 text-custom-wine px-2 py-1 rounded-full text-xs font-semibold">
            Default
          </span>
        )}
      </div>

      {/* Address */}
      <div className="bg-custom-yellow/30 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <span className="text-custom-purple mt-1">🏠</span>
          <div className="text-custom-dark leading-relaxed">
            <div className="font-medium text-sm">
              {address.homeNumber}, {address.ward.name}
            </div>
            <div className="text-sm">
              {address.ward.district.name}, {address.ward.district.city.name}
            </div>
            {address.moreDetail && (
              <div className="text-custom-purple text-xs mt-1 italic">
                📝 {address.moreDetail}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDisplayCard;
