import {
  localStorageGetItem,
  localStorageRemoveItem,
  localStorageSetItem,
} from "@/libs/utils/localStorage";

import { IUserAccount } from "@/models/auth";
import axios from "@/utils/axios";
import { USER_STORAGE_KEY } from "@/utils/constants";

export const getUserData = () => {
  try {
    const data: IUserAccount = JSON.parse(
      localStorageGetItem(USER_STORAGE_KEY) || ""
    );
    axios.defaults.headers.common["auth-user-id"] = data.id;
    axios.defaults.headers.common["auth-token"] = data.accessToken;
    return data;
  } catch (error) {
    return null;
  }
};

export const setUserData = (data: IUserAccount) => {
  if (!data) {
    return;
  }

  localStorageSetItem(USER_STORAGE_KEY, JSON.stringify(data));
  axios.defaults.headers.common["auth-user-id"] = data.id;
  axios.defaults.headers.common["auth-token"] = data.accessToken;
};

export const removeUserData = () => {
  localStorageRemoveItem(USER_STORAGE_KEY);
  axios.defaults.headers.common["auth-user-id"] = "";
  axios.defaults.headers.common["auth-token"] = "";
};
