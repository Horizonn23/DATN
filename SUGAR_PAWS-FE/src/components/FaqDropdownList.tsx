import React from "react";
import FaqDropdown, { FaqDropdownProps } from "./FaqDropdown";

export interface FaqDropdownListProps {
  title: string;
  dropdownList: FaqDropdownProps[];
}

const FaqDropdownList: React.FC<FaqDropdownListProps> = ({
  title,
  dropdownList,
}) => {
  const midIndex = Math.ceil(dropdownList.length / 2);
  const firstColumn = dropdownList.slice(0, midIndex);
  const secondColumn = dropdownList.slice(midIndex);

  return (
    <div>
      <h2 className="text-center font-semibold text-[32px] mb-4 text-custom-purple">
        {title}
      </h2>
      <div className="flex gap-6">
        <div className="flex-1 flex flex-col gap-2">
          {firstColumn.map((item, index) => (
            <FaqDropdown
              key={index}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          {secondColumn.map((item, index) => (
            <FaqDropdown
              key={index}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqDropdownList;
