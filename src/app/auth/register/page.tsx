import { APP_NAME } from "@/config";
import { RegisterView } from "@/sections/auth";

export const metadata = {
  title: `Register: ${APP_NAME}`,
};

export default function RegisterPage() {
  return <RegisterView />;
}
