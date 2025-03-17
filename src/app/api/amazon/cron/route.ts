export const dynamic = "force-dynamic";

import { PartnerService } from "@/services/database/partners/service";
import axios from "@/utils/axios";
import { getUrlSearchParam, SuccessResponse } from "@/utils/request";

export async function GET(req: Request) {
  const type = getUrlSearchParam(req.url, "type");
  try {
    const sellers = await PartnerService.getPartnerList();
    for (const seller of sellers.partners) {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_HOST_API}/amazon?sellerId=${seller.id}&type=${type}`
        );
      } catch (err) {
        console.error(err);
      }
    }
    return SuccessResponse({
      message: "Updated data",
    });
  } catch (err: any) {
    console.error(err);
  }
}
