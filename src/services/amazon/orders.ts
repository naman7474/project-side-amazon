import { parseValue } from "@/utils";

import { callSpApi } from "./index";

const fetchOrders = async (
  marketplaceIds: Array<string>,
  nextToken: string | null
) => {
  const params: any = {
    MarketplaceIds: marketplaceIds,
    MaxResultsPerPage: 100,
  };

  if (nextToken) {
    params.NextToken = nextToken;
  }

  const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  params.CreatedAfter = defaultStartDate.toISOString();
  // params["LastUpdatedAfter"] = lastUpdatedAfter;
  return callSpApi("orders/v0/orders", params);
};

const parseOrdersData = (data: any) => {
  if (!data?.length) {
    return [];
  }

  return data?.map((item: any) => ({
    orderId: parseValue(item?.AmazonOrderId),
    earliestShipDate: parseValue(item?.EarliestShipDate),
    salesChannel: parseValue(item?.SalesChannel),
    hasAutomatedShippingSettings: parseValue(
      item?.AutomatedShippingSettings?.HasAutomatedShippingSettings
    ),
    status: parseValue(item?.OrderStatus),
    numberOfItemsShipped: parseValue(item?.NumberOfItemsShipped),
    orderType: parseValue(item?.OrderType),
    isPremiumOrder: parseValue(item?.IsPremiumOrder),
    isPrime: parseValue(item?.IsPrime),
    fulfillmentChannel: parseValue(item?.FulfillmentChannel),
    numberOfItemsUnshipped: parseValue(item?.NumberOfItemsUnshipped),
    hasRegulatedItems: parseValue(item?.HasRegulatedItems),
    isReplacementOrder: parseValue(item?.IsReplacementOrder) !== "false",
    isSoldByAB: parseValue(item?.IsSoldByAB),
    latestShipDate: parseValue(item?.LatestShipDate),
    shipServiceLevel: parseValue(item?.ShipServiceLevel),
    isIspu: parseValue(item?.IsISPU),
    marketplaceId: parseValue(item?.MarketplaceId),
    purchaseDate: parseValue(item?.PurchaseDate),
    isAccessPointOrder: parseValue(item?.IsAccessPointOrder),
    isBusinessOrder: parseValue(item?.IsBusinessOrder),
    orderTotalAmount: parseValue(item?.OrderTotal?.Amount),
    orderTotalCurrencyCode: parseValue(item?.OrderTotal?.CurrencyCode),
    paymentMethodDetails: parseValue(item?.PaymentMethodDetails?.join(",")),
    isGlobalExpressEnabled: parseValue(item?.IsGlobalExpressEnabled),
    lastUpdateDate: parseValue(item?.LastUpdateDate),
    // shipmentServiceLevelCategory: parseValue(
    //   item?.ShipmentServiceLevelCategory
    // ),
  }));
};

export const fetchOrdersData = async (
  marketplaceIds: Array<string>
): Promise<any> => {
  const orders = [];
  let ordersNextToken: string | null = null;
  do {
    const ordersData = await fetchOrders(marketplaceIds, ordersNextToken);
    ordersNextToken = ordersData?.payload?.NextToken || null;
    orders.push(...parseOrdersData(ordersData?.payload?.Orders));
  } while (ordersNextToken);
  return orders;
};
