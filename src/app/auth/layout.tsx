"use client";

import { ReactNode } from "react";

import GuestGuard from "@/auth/guest-guard";
import AuthLayout from "@/layouts/auth";
import { paths } from "@/routes/paths";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard authenticatedRoute={paths.dashboard.root}>
      <AuthLayout>{children}</AuthLayout>
    </GuestGuard>
  );
}
