import { callSpApi } from "@/services/amazon/index";

const parseFbaInventory = (data: any) => {
  if (!data?.payload) {
    return [];
  }

  return data?.payload?.inventorySummaries?.map((item: any) => ({
    asin: item.asin,
    fnSku: item.fnSku,
    sellerSku: item.sellerSku,
    condition: item.condition,
    fulfillableQuantity: item.inventoryDetails?.fulfillableQuantity,
    inboundWorkingQuantity: item.inventoryDetails?.inboundWorkingQuantity,
    inboundShippedQuantity: item.inventoryDetails?.inboundShippedQuantity,
    inboundReceivingQuantity: item.inventoryDetails?.inboundReceivingQuantity,
    totalReservedQuantity:
      item.inventoryDetails?.reservedQuantity?.totalReservedQuantity,
    pendingCustomerOrderQuantity:
      item.inventoryDetails?.reservedQuantity?.pendingCustomerOrderQuantity,
    pendingTransshipmentQuantity:
      item.inventoryDetails?.reservedQuantity?.pendingTransshipmentQuantity,
    fcProcessingQuantity:
      item.inventoryDetails?.reservedQuantity?.fcProcessingQuantity,
    totalResearchingQuantity:
      item.inventoryDetails?.researchingQuantity?.totalResearchingQuantity,
    totalUnfulfillableQuantity:
      item.inventoryDetails?.unfulfillableQuantity?.totalUnfulfillableQuantity,
    customerDamagedQuantity:
      item.inventoryDetails?.unfulfillableQuantity?.customerDamagedQuantity,
    warehouseDamagedQuantity:
      item.inventoryDetails?.unfulfillableQuantity?.warehouseDamagedQuantity,
    distributorDamagedQuantity:
      item.inventoryDetails?.unfulfillableQuantity?.distributorDamagedQuantity,
    carrierDamagedQuantity:
      item.inventoryDetails?.unfulfillableQuantity?.carrierDamagedQuantity,
    defectiveQuantity:
      item.inventoryDetails?.unfulfillableQuantity?.defectiveQuantity,
    expiredQuantity:
      item.inventoryDetails?.unfulfillableQuantity?.expiredQuantity,
    lastUpdatedTime: item.lastUpdatedTime || null,
    productName: item.productName,
    totalQuantity: item.totalQuantity,
  }));
};

export async function fetchFbaInventory(
  marketplaceIds: Array<string>
  // sellerId: string
): Promise<any> {
  const params: any = {
    marketplaceIds,
    granularityId: marketplaceIds[0],
    granularityType: "Marketplace",
    // sellerSku: sellerId,
    details: "true",
  };
  return parseFbaInventory(
    await callSpApi(`fba/inventory/v1/summaries`, params)
  );
}

const parseFbaInbound = (item: any) => {
  if (!item.payload) {
    return;
  }

  return {
    asin: item.payload.asin,
    marketplaceId: item.payload.marketplaceId,
    program: item.payload.program,
    isEligibleForProgram: item.payload.isEligibleForProgram,
    ineligibilityReasonList:
      item.payload.ineligibilityReasonList?.join(",") || "",
  };
};

export async function getFbaInboundEligibility(
  marketplaceIds: Array<string>,
  asin: string
): Promise<any> {
  const params: any = {
    marketplaceIds,
    asin,
    program: "INBOUND",
  };
  return parseFbaInbound(
    await callSpApi(`fba/inbound/v1/eligibility/itemPreview`, params)
  );
}

// const data = {
//   payload: {
//     asin: "B07DQLT7DS",
//     marketplaceId: "A21TJRUUN4KGV",
//     program: "INBOUND",
//     isEligibleForProgram: false,
//     ineligibilityReasonList: ["FBA_INB_0037", "FBA_INB_0050"],
//   },
// };
