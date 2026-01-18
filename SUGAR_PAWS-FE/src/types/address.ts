export type City = {
  cityCode: number;
  name: string;
};

export type District = {
  districtCode: number;
  name: string;
};

export type Ward = {
  wardCode: number;
  name: string;
};

export type ShippingAddress = {
  id: number;
  userId: number;
  fullName: string;
  phoneNumber: string;
  homeNumber: string;
  wardCode: number | "";
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  moreDetail: string;
  ward: Pick<Ward, "wardCode" | "name"> & {
    district: Pick<District, "districtCode" | "name"> & {
      city: Pick<City, "cityCode" | "name">;
    };
  };
};

export type UpdateAddressDTO = {
  fullName?: string;
  phoneNumber?: string;
  homeNumber?: string;
  wardCode?: number;
  isDefault?: boolean;
  moreDetail?: string;
};
