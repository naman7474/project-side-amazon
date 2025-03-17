import { createContext, useContext } from "react";

import { IUserAccount } from "@/models/auth";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: IUserAccount | null;
  login: (email: string, password: string) => Promise<void> | void;
  register: (data: Record<string, any>) => Promise<void> | void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
