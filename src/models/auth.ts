import { IAdminType } from "@/models/user";

export type IUserAccount = {
  id: number;
  email: string;
  name: string;
  phone: string;
  imageUrl: string;
  accessToken: string;
  role: IAdminType;
  isShadowed: false;
};
