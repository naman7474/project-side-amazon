import { ReactNode, useEffect } from "react";

import { useRouter } from "@/libs/routes/hooks";

import { useAuth } from "./auth-context";

interface AuthGuardProps {
  children: ReactNode;
  loginRoute: string;
}

const AuthGuard = ({ children, loginRoute }: AuthGuardProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.href,
      }).toString();

      const href = `${loginRoute}?${searchParams}`;

      router.replace(href);
    }
  }, [isAuthenticated, router, loginRoute]);

  return <>{isAuthenticated && children}</>;
};

export default AuthGuard;
