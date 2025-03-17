import { callSpApi } from "@/services/amazon/index";

const parseFinanceData = (orderId: string, data: any) => {
  const financialEvents = data?.payload?.FinancialEvents;
  if (!financialEvents) {
    return null;
  }

  const result: any = {
    orderId: orderId,
    refundEventList: financialEvents.RefundEventList
      ? JSON.stringify(financialEvents.RefundEventList)
      : null,
    itemFeeList: financialEvents.ItemFeeList
      ? JSON.stringify(financialEvents.ItemFeeList)
      : null,
    shipmentEventList: financialEvents.ShipmentEventList
      ? JSON.stringify(financialEvents.ShipmentEventList)
      : null,
  };
  return result;
};

export async function fetchFinances(orderId: string): Promise<any> {
  const params: any = {};
  const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
  params.PostedAfter = defaultStartDate.toISOString();
  return parseFinanceData(
    orderId,
    await callSpApi(`finances/v0/orders/${orderId}/financialEvents`, params)
  );
}
