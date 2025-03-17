"use client";

import React, { ReactNode, useCallback, useMemo, useState } from "react";

import { IUserAccount } from "@/models/auth";
import axios, { API_ENDPOINTS, DefaultErrorMessage } from "@/utils/axios";

import { AuthContext } from "./auth-context";
import { getUserData, removeUserData, setUserData } from "./utils";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<IUserAccount | null>(getUserData());

  const login = useCallback(async (email: string, password: string) => {
    const data = {
      email,
      password,
    };

    const response = await axios.post(API_ENDPOINTS.auth.login, data);

    if (response.status !== 200 || response.data?.reason) {
      throw new Error(response.data?.reason || DefaultErrorMessage);
    }

    setUser(response.data);
    setUserData(response.data);
  }, []);

  const register = useCallback(async (data: Record<string, any>) => {
    const response = await axios.post(API_ENDPOINTS.auth.register, data);

    if (response.status !== 200 || response.data?.reason) {
      throw new Error(response.data?.reason || DefaultErrorMessage);
    }

    setUser(response.data);
    setUserData(response.data);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeUserData();
  }, [setUser]);

  const memoizedValue = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};
