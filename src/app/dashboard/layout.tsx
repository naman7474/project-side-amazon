"use client";

import { ReactNode } from "react";

import AuthGuard from "@/auth/auth-guard";
import DashboardLayout from "@/layouts/dashboard";
import { paths } from "@/routes/paths";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard loginRoute={paths.auth.login}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
