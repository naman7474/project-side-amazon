import { fDate } from "@/libs/utils/time";

export const dynamic = "force-dynamic";

import { updateAccessToken } from "@/services/amazon";
import { PartnerService } from "@/services/database/partners/service";
import {
  BadRequestResponse,
  getUrlSearchParam,
  InternalServerErrorResponse,
  SuccessResponse,
} from "@/utils/request";

import {
  createAmazonReports,
  getMarketPlaceIds,
  updateCatalogData,
  updateFbaItemsData,
  updateFinancesData,
  updateItemsData,
  updateOffersData,
  updateOrdersData,
  updatePricingData,
  updatePricingFeesData,
  updateSalesData,
  updateReportsData,
  updateFbaInventoryData,
} from "./utils";

export async function GET(req: Request) {
  try {
    const type = getUrlSearchParam(req.url, "type");
    const urlSellerId = getUrlSearchParam(req.url, "sellerId");
    if (!urlSellerId) {
      return BadRequestResponse("Seller ID is required");
    }

    const seller = await PartnerService.getPartnerDetail(
      parseInt(urlSellerId, 10) || 0
    );

    if (!seller?.id) {
      return BadRequestResponse("Seller not found");
    }

    const sellerId = seller.id || 0;
    const token = await updateAccessToken(seller?.refreshToken || "");
    if (!token) {
      return BadRequestResponse("Failed to update access token");
    }

    // Seller Marketplace details
    const marketplaceIds = await getMarketPlaceIds(sellerId);

    if (type === "reports") {
      // Generate Reports
      let yesterday: Date | string = new Date();
      yesterday.setDate(yesterday.getDate() - 2);
      await createAmazonReports(
        sellerId,
        marketplaceIds,
        fDate(yesterday, "yyyy-MM-dd")
      );
    } else if (type === "sales") {
      await updateSalesData(sellerId, marketplaceIds);
    } else if (type === "orders") {
      await updateOrdersData(sellerId, marketplaceIds);
    } else if (type === "reports_update") {
      await updateReportsData(sellerId);
    } else if (type === "items") {
      await updateItemsData(
        sellerId,
        marketplaceIds,
        seller?.sellerId || "",
        seller?.refreshToken || ""
      );
    } else if (type === "catalog") {
      await updateCatalogData(sellerId, marketplaceIds);
    } else if (type === "fba_items") {
      await updateFbaItemsData(sellerId, marketplaceIds);
    } else if (type === "offers") {
      await updateOffersData(sellerId, marketplaceIds);
    } else if (type === "pricing") {
      await updatePricingData(sellerId, marketplaceIds);
    } else if (type === "pricing_fees") {
      await updatePricingFeesData(sellerId, marketplaceIds);
    } else if (type === "finances") {
      await updateFinancesData(sellerId);
    } else if (type === "fba_inventory") {
      await updateFbaInventoryData(sellerId, marketplaceIds);
    }

    return SuccessResponse({
      message: "Updated data",
    });
  } catch (err: any) {
    console.error(err);
    return InternalServerErrorResponse(err?.message || "Something went wrong");
  }
}
