"use client";

import { ReactNode, useEffect } from "react";

import { useRouter } from "@/libs/routes/hooks";

import { useAuth } from "./auth-context";

interface GuestGuardProps {
  children: ReactNode;
  authenticatedRoute: string;
}

const GuestGuard = ({ children, authenticatedRoute }: GuestGuardProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(authenticatedRoute);
    }
  }, [authenticatedRoute, isAuthenticated, router]);

  return <>{!isAuthenticated && children}</>;
};

export default GuestGuard;
