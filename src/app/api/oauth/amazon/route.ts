export const dynamic = "force-dynamic";

import { getApiToken } from "@/services/amazon";
import { PartnerService } from "@/services/database/partners/service";
import { isAuthenticatedRequest } from "@/utils/middleware";
import {
  BadRequestResponse,
  getUrlSearchParam,
  InternalServerErrorResponse,
  SuccessResponse,
} from "@/utils/request";
import axios from "@/utils/axios";

export async function GET(req: Request) {
  try {
    const user = await isAuthenticatedRequest(req);
    const sellingPartnerId = getUrlSearchParam(req.url, "selling_partner_id");
    const oauthCode = getUrlSearchParam(req.url, "spapi_oauth_code");
    if (!sellingPartnerId || !oauthCode) {
      return BadRequestResponse("Invalid request");
    }

    const { refreshToken, accessToken } = await getApiToken(null, oauthCode);
    if (!refreshToken || !accessToken) {
      return BadRequestResponse("Refresh token or access token request failed");
    }

    const partner = await PartnerService.createPartner(
      user?.id || 5,
      sellingPartnerId,
      refreshToken,
      accessToken
    );

    if (partner) {
      console.log(
        `${process.env.NEXT_PUBLIC_HOST_API}/amazon?sellerId=${partner.id}`
      );
      axios.get(
        `${process.env.NEXT_PUBLIC_HOST_API}/amazon?sellerId=${partner.id}`
      );
    }

    return SuccessResponse(partner);
  } catch (err: any) {
    console.error(err);
    return InternalServerErrorResponse(err?.message || "Something went wrong");
  }
}
