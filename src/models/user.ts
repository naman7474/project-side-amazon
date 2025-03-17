export type IUserItem = {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  phone?: string;
  isShadowed: boolean;
};

export enum IAdminType {
  Admin = "admin",
  Superadmin = "superadmin",
  Merchant = "merchant",
}

export type IAdminItem = IUserItem & {
  role: IAdminType;
};
