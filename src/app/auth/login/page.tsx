import { APP_NAME } from "@/config";
import { LoginView } from "@/sections/auth";

export const metadata = {
  title: `Login: ${APP_NAME}`,
};

export default function LoginPage() {
  return <LoginView />;
}
