import { encrypt } from "@/libs/utils/encrypt";

import { User } from "@/services/database/accounts/model";
import { UserService } from "@/services/database/accounts/service";
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  SuccessResponse,
} from "@/utils/request";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (
      !body.email ||
      !body.password ||
      !body.name ||
      !body.company ||
      !body.phone
    ) {
      return BadRequestResponse("Missing required fields");
    }

    const password = await encrypt(body.password);
    const user: Partial<User> | null = await UserService.createUser({
      ...body,
      password,
    });

    return SuccessResponse({ ...user });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      return BadRequestResponse("Email already exists");
    }

    return InternalServerErrorResponse(
      error?.message || "Something went wrong"
    );
  }
}
