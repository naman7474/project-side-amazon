import { User } from "@/services/database/accounts/model";
import { UserService } from "@/services/database/accounts/service";

const getUser = async (req: Request): Promise<Partial<User> | null> => {
  const userId = req.headers.get("auth-user-id") || "";
  const accessToken = req.headers.get("auth-token");
  if (!userId || !accessToken) {
    return null;
  }

  const user = await UserService.getUserById(parseInt(userId, 10));
  if (user && user.accessToken === accessToken) {
    // req.user = user;
    return user;
  }

  return null;
};

export const isAuthenticatedRequest = async (
  req: Request
): Promise<Partial<User> | null> => getUser(req);
