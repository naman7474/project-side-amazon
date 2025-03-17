import { User } from "./model";

export const parseUser = (user: any): Partial<User> => {
  if (!user) {
    return {};
  }

  const data = { ...user };
  if (user.detail) {
    data.name = user.detail.name;
    data.imageUrl = user.detail.imageUrl;
    data.company = user.detail.company;
    data.gst = user.detail.gst;
  }

  delete data.detail;
  return data;
};
