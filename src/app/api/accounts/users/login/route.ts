import { encrypt } from "@/libs/utils/encrypt";

import { User } from "@/services/database/accounts/model";
import { UserService } from "@/services/database/accounts/service";
import {
  BadRequestResponse,
  ForbiddenResponse,
  InternalServerErrorResponse,
  SuccessResponse,
} from "@/utils/request";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.email || !body.password) {
      return BadRequestResponse("Email and password are required");
    }

    const password = await encrypt(body.password);
    const user: Partial<User> | null = await UserService.getUserByEmail(
      body.email
    );

    if (!user || user.password !== password) {
      return ForbiddenResponse("Invalid email or password");
    }

    delete user.password;

    return SuccessResponse({ ...user });
  } catch (error: any) {
    console.error(error);
    return InternalServerErrorResponse(
      error?.message || "Something went wrong"
    );
  }
}
