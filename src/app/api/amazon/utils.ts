import { AmazonFbaService } from "@/services/database/fba.ts/service";
import { AmazonItemsService } from "@/services/database/items/service";
import { AmazonOrdersService } from "@/services/database/orders/service";
import { AmazonSalesService } from "@/services/database/sales/service";
import { SellerMarketplaceService } from "@/services/database/seller/service";

import { fetchCatalogItem, fetchItemData } from "@/services/amazon/catalog";
import {
  fetchFbaInventory,
  getFbaInboundEligibility,
} from "@/services/amazon/fba";
import { fetchOrdersData } from "@/services/amazon/orders";
import {
  createAmazonReport,
  fetchReport,
  fetchReportDetail,
  fetchReportDocument,
} from "@/services/amazon/report";
import { fetchSalesData } from "@/services/amazon/sales";
import { fetchSellerData } from "@/services/amazon/seller";

import { parseValue } from "@/utils";
import { downloadAndParseJson, downloadAndParseTsv } from "@/utils/csv";
import {
  fetchProductFees,
  fetchProductOffers,
  fetchProductPricing,
} from "@/services/amazon/product";
import { AmazonProductService } from "@/services/database/products/service";
import { stringToJSON } from "@/libs/utils/string";
import { fetchFinances } from "@/services/amazon/finance";
import { AmazonReportService } from "@/services/database/reports/service";
import { updateAccessToken } from "@/services/amazon";

export const getMarketPlaceIds = async (sellerAccountId: number) => {
  const sellerMarketplace = await SellerMarketplaceService.getMarketplaceData(
    sellerAccountId
  );
  let marketplaceIds: string[];
  if (sellerMarketplace?.length) {
    marketplaceIds = sellerMarketplace.map((item: any) => item.marketplaceId);
  } else {
    const sellerItems = await fetchSellerData(sellerAccountId);
    await SellerMarketplaceService.createSellerMarketplace(
      sellerAccountId,
      sellerItems
    );
    marketplaceIds = sellerItems.map((item: any) => item.marketplaceId);
  }

  return marketplaceIds;
};

export const updateSalesData = async (
  sellerId: number,
  marketplaceIds: Array<string>
) => {
  const sales = await fetchSalesData(marketplaceIds);
  await AmazonSalesService.addSalesData(sellerId, sales);
};

export const updateOrdersData = async (
  sellerId: number,
  marketplaceIds: Array<string>
) => {
  const orders = await fetchOrdersData(marketplaceIds);
  await AmazonOrdersService.addOrdersData(sellerId, orders);
};

export const updateItemsData = async (
  sellerId: number,
  marketplaceIds: Array<string>,
  amazonSellerId: string,
  refreshToken?: string
) => {
  const items: Array<Record<string, any>> = [];
  const reports = await fetchReport("GET_MERCHANT_LISTINGS_ALL_DATA");
  const reportDocumentId = reports?.reports?.[0]?.reportDocumentId;
  if (reportDocumentId) {
    const documentData = await fetchReportDocument(reportDocumentId);
    const documentUrl = parseValue(documentData?.url);
    if (documentUrl) {
      const reportData: any = await downloadAndParseTsv(
        documentUrl,
        documentData?.compressionAlgorithm === "GZIP"
      );
      const skus = reportData.map(
        (item: Record<string, any>) => item["seller-sku"]
      );
      for (const [index, sku] of skus.entries()) {
        if (index && index % 500 === 0 && refreshToken) {
          await updateAccessToken(refreshToken);
        }
        const itemData = await fetchItemData(
          marketplaceIds,
          amazonSellerId,
          sku
        );
        items.push(itemData);
      }
    }
  }
  await AmazonItemsService.addItemsData(sellerId, items);
};

const fetchCatalogItemWithDelay = async (
  marketplaceIds: Array<string>,
  asin: string
) => {
  const item = await fetchCatalogItem(marketplaceIds, asin);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return item;
};

export const updateCatalogData = async (
  sellerId: number,
  marketplaceIds: Array<string>
) => {
  const catalogItems: Array<Record<string, any>> = [];
  const items = await AmazonItemsService.getItemsData(sellerId);
  for (const item of items) {
    const catalogData = await fetchCatalogItemWithDelay(
      marketplaceIds,
      item?.asin || ""
    );
    catalogItems.push(catalogData);
  }
  await AmazonItemsService.addCatalogData(sellerId, catalogItems);
};

const fetchFbaItemsWithDelay = async (
  marketplaceIds: Array<string>,
  asin: string
) => {
  const item = await getFbaInboundEligibility(marketplaceIds, asin);
  // Introduce a delay of 2 seconds between requests
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return item;
};

export const updateFbaItemsData = async (
  sellerId: number,
  marketplaceIds: Array<string>
) => {
  const fbaItems: Array<Record<string, any>> = [];
  const items = await AmazonItemsService.getItemsData(sellerId);
  for (const item of items) {
    const fbaItem = await fetchFbaItemsWithDelay(
      marketplaceIds,
      item?.asin || ""
    );
    fbaItems.push(fbaItem);
  }
  await AmazonFbaService.addInboundData(sellerId, fbaItems);
};

const fetchFbaInventoryWithDelay = async (marketplaceIds: Array<string>) => {
  const product = await fetchFbaInventory(marketplaceIds);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return product;
};

export const updateFbaInventoryData = async (
  sellerId: number,
  marketplaceIds: Array<string>
) => {
  const fbaInventory: Array<Record<string, any>> = [];
  const items = await AmazonItemsService.getItemsData(sellerId);
  for (const item of items) {
    const fbaInventoryData = await fetchFbaInventoryWithDelay(marketplaceIds);
    fbaInventory.push(...fbaInventoryData);
  }
  await AmazonFbaService.addInventoryData(sellerId, fbaInventory);
};

const fetchProductOffersWithDelay = async (
  marketplaceId: string,
  sku: string
) => {
  const product = await fetchProductOffers(marketplaceId, sku);
  // Introduce a delay of 2 seconds between requests
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return product;
};

export const updateOffersData = async (
  sellerId: number,
  marketplaceIds: Array<string>
) => {
  const offers: Array<Record<string, any>> = [];
  const items = await AmazonItemsService.getItemsData(sellerId);
  for (const item of items) {
    const offerData = await fetchProductOffersWithDelay(
      marketplaceIds[0],
      item?.sku || ""
    );
    offers.push(offerData);
  }
  await AmazonItemsService.addOffersData(sellerId, offers);
};

const fetchProductPricingWithDelay = async (
  marketplaceId: string,
  sku: string
) => {
  const product = await fetchProductPricing(marketplaceId, [sku]);
  // Introduce a delay of 2 seconds between requests
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return product;
};

export const updatePricingData = async (
  sellerId: number,
  marketplaceIds: Array<string>
) => {
  const pricings: Array<Record<string, any>> = [];
  const items = await AmazonItemsService.getItemsData(sellerId);
  for (const item of items) {
    const pricingData = await fetchProductPricingWithDelay(
      marketplaceIds[0],
      item?.sku || ""
    );
    pricings.push(pricingData);
  }

  await AmazonProductService.addProductPricingData(sellerId, pricings);
};

export const updatePricingFeesData = async (
  sellerId: number,
  marketplaceIds: Array<string>
) => {
  const fees: Array<Record<string, any>> = [];
  const items = await AmazonProductService.getProductPricingData(sellerId);
  for (const item of items) {
    const offer = stringToJSON(item?.offers || "");
    if (
      offer?.[0]?.BuyingPrice?.ListingPrice?.Amount &&
      offer?.[0]?.BuyingPrice?.ListingPrice?.CurrencyCode
    ) {
      const feesData = await fetchProductFees(
        marketplaceIds[0],
        item?.sku || "",
        offer?.[0]?.BuyingPrice?.ListingPrice?.Amount,
        offer?.[0]?.BuyingPrice?.ListingPrice?.CurrencyCode
      );
      fees.push(feesData);
    }
  }

  await AmazonProductService.addProductFeesData(sellerId, fees);
};

const fetchFinancesWithDelay = async (orderId: string) => {
  const finance = await fetchFinances(orderId || "");
  // Introduce a delay of 2 seconds between requests
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return finance;
};

export const updateFinancesData = async (sellerId: number) => {
  const finances: Array<Record<string, any>> = [];
  const orders = await AmazonOrdersService.getOrdersData(sellerId);
  for (const order of orders) {
    const finance = await fetchFinancesWithDelay(order?.orderId || "");
    finances.push(finance);
  }

  await AmazonOrdersService.addFinancesData(sellerId, finances);
};

function getWeekDateBoundaries(): {
  dataStartTime: string;
  dataEndTime: string;
} {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dayOfWeek = yesterday.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6

  // Calculate the offset to the last Sunday (or today if today is Sunday)
  const lastSundayOffset = dayOfWeek === 0 ? 0 : dayOfWeek;

  // Calculate the last Sunday date from today
  const lastSunday = new Date(yesterday);
  lastSunday.setDate(yesterday.getDate() - lastSundayOffset);

  // Calculate the next Saturday date from last Sunday
  const nextSaturday = new Date(lastSunday);
  nextSaturday.setDate(lastSunday.getDate() + 6);

  // Format the dates as YYYY-MM-DD strings
  const dataStartTime = lastSunday.toISOString().split("T")[0];
  const dataEndTime = nextSaturday.toISOString().split("T")[0];

  return { dataStartTime, dataEndTime };
}

export const createAmazonReports = async (
  sellerId: number,
  marketplaceIds: Array<string>,
  date: string
) => {
  for (const marketplaceId of marketplaceIds.slice(0, 1)) {
    const merchantListingReport = await createAmazonReport(
      "GET_MERCHANT_LISTINGS_ALL_DATA",
      [marketplaceId],
      {
        reportOptions: {
          custom: "false",
        },
      }
    );
    const { reportId: merchantListingReportId } = merchantListingReport;
    const brandReport = await createAmazonReport(
      "GET_BRAND_ANALYTICS_MARKET_BASKET_REPORT",
      [marketplaceId],
      {
        dataStartTime: date,
        dataEndTime: date,
        reportOptions: {
          reportPeriod: "DAY",
        },
      }
    );
    const { reportId: brandReportId } = brandReport;
    // const searchTermsReport = await createAmazonReport(
    //   "GET_BRAND_ANALYTICS_SEARCH_TERMS_REPORT",
    //   [marketplaceId],
    //   {
    //     dataStartTime: date,
    //     dataEndTime: date,
    //     reportOptions: {
    //       reportPeriod: "DAY",
    //     },
    //   }
    // );
    // const { reportId: searchTermsReportId } = searchTermsReport;
    const { dataStartTime, dataEndTime } = getWeekDateBoundaries();
    const purchaseReport = await createAmazonReport(
      "GET_BRAND_ANALYTICS_REPEAT_PURCHASE_REPORT",
      [marketplaceId],
      {
        dataStartTime: dataStartTime,
        dataEndTime: dataEndTime,
        reportOptions: {
          reportPeriod: "WEEK",
        },
      }
    );
    const { reportId: purchaseReportId } = purchaseReport;
    const salesReport = await createAmazonReport(
      "GET_SALES_AND_TRAFFIC_REPORT",
      [marketplaceId],
      {
        dataStartTime: date,
        dataEndTime: date,
        reportOptions: {
          dateGranularity: "DAY",
          asinGranularity: "SKU",
        },
      }
    );
    const { reportId: salesReportId } = salesReport;
    await AmazonReportService.addReports(sellerId, [
      {
        reportId: brandReportId,
        marketplaceId: marketplaceId,
        reportType: "GET_BRAND_ANALYTICS_MARKET_BASKET_REPORT",
        status: "IN_PROGRESS",
      },
      // {
      //   reportId: searchTermsReportId,
      //   marketplaceId: marketplaceId,
      //   reportType: "GET_BRAND_ANALYTICS_SEARCH_TERMS_REPORT",
      //   status: "IN_PROGRESS",
      // },
      {
        reportId: purchaseReportId,
        marketplaceId: marketplaceId,
        reportType: "GET_BRAND_ANALYTICS_REPEAT_PURCHASE_REPORT",
        status: "IN_PROGRESS",
      },
      {
        reportId: salesReportId,
        marketplaceId: marketplaceId,
        reportType: "GET_SALES_AND_TRAFFIC_REPORT",
        status: "IN_PROGRESS",
      },
      {
        reportId: merchantListingReportId,
        marketplaceId: marketplaceId,
        reportType: "GET_MERCHANT_LISTINGS_ALL_DATA",
        status: "IN_PROGRESS",
      },
    ]);
  }
};

export const updateReportsData = async (sellerId: number) => {
  const reports = await AmazonReportService.getPendingReports(sellerId);
  for (const report of reports) {
    try {
      const reportData = await fetchReportDetail(report?.reportId || "");
      if (reportData?.processingStatus) {
        const documentData = await fetchReportDocument(
          reportData?.reportDocumentId || ""
        );
        const documentUrl = parseValue(documentData?.url);
        if (documentUrl) {
          const data: any = await downloadAndParseJson(
            documentUrl,
            documentData?.compressionAlgorithm === "GZIP"
          );
          if (
            data?.reportSpecification &&
            reportData?.processingStatus === "DONE"
          ) {
            await AmazonReportService.createReportData({
              reportId: report?.id || 0,
              startDate: new Date(data?.reportSpecification?.dataStartTime),
              endDate: new Date(data?.reportSpecification?.dataEndTime),
              data: JSON.stringify({
                salesAndTrafficByDate: data?.salesAndTrafficByDate || null,
                salesAndTrafficByAsin: data?.salesAndTrafficByAsin || null,
                dataByAsin: data?.dataByAsin || null,
                dataByDepartmentAndSearchTerm:
                  data?.dataByDepartmentAndSearchTerm || null,
              }),
            });
            await AmazonReportService.updateReportsStatus(
              report?.id || 0,
              reportData?.processingStatus
            );
          } else {
            await AmazonReportService.updateReportsStatus(
              report?.id || 0,
              reportData?.processingStatus
            );
          }
        }
      }
    } catch (error) {
      await AmazonReportService.updateReportsStatus(report?.id || 0, "ERROR");
    }
  }
};
