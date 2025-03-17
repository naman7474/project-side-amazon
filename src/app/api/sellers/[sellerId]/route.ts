import { PartnerService } from "@/services/database/partners/service";
import { AmazonSalesService } from "@/services/database/sales/service";
import { SellerMarketplaceService } from "@/services/database/seller/service";
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  SuccessResponse,
} from "@/utils/request";
import { AmazonOrdersService } from "@/services/database/orders/service";
import { AmazonItemsService } from "@/services/database/items/service";

export async function GET(req: Request, context: any) {
  const { params } = context;
  const sellerId = params.sellerId || "";
  try {
    const seller = await PartnerService.getPartnerDetail(
      parseInt(sellerId, 10) || 0
    );

    if (!seller?.id) {
      return BadRequestResponse("Seller not found");
    }

    const sales = await AmazonSalesService.getSalesData(seller.id);
    const orders = await AmazonOrdersService.getOrdersData(seller.id);
    const totalOrders = await AmazonOrdersService.getOrdersCount(seller.id);
    const totalItems = await AmazonItemsService.getItemsCount(seller.id);

    return SuccessResponse({ sales, orders, totalOrders, totalItems });
  } catch (err: any) {
    console.error(err);
    return InternalServerErrorResponse(err?.message || "Something went wrong");
  }
}
