import React from "react";

interface CheckoutSectionHeaderProps {
  icon: string;
  title: string;
  gradient: string;
}

const CheckoutSectionHeader: React.FC<CheckoutSectionHeaderProps> = ({
  icon,
  title,
  gradient,
}) => {
  return (
    <div className={`bg-gradient-to-r ${gradient} px-4 py-2`}>
      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
        {icon} {title}
      </h3>
    </div>
  );
};

export default CheckoutSectionHeader;
