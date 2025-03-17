export const dynamic = "force-dynamic";

import { PartnerService } from "@/services/database/partners/service";
import { isAuthenticatedRequest } from "@/utils/middleware";
import {
  InternalServerErrorResponse,
  SuccessResponse,
  UnauthorizedResponse,
} from "@/utils/request";

export async function GET(req: Request) {
  try {
    const user = await isAuthenticatedRequest(req);
    if (!user) {
      return UnauthorizedResponse();
    }

    const partners = await PartnerService.getPartnerList(user?.id || 0);
    return SuccessResponse(partners);
  } catch (err: any) {
    console.error(err);
    return InternalServerErrorResponse(err?.message || "Something went wrong");
  }
}
