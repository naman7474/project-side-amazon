import { callSpApi } from "@/services/amazon/index";

const parseCatalogItem = (item: any) => {
  if (!item?.summaries?.length) {
    return;
  }

  const itemData = item.summaries[0];
  return {
    asin: item.asin,
    marketplaceId: itemData.marketplaceId,
    adultProduct: itemData.adultProduct,
    autographed: itemData.autographed,
    brand: itemData.brand,
    browseClassificationDisplayName: itemData.browseClassification?.displayName,
    browseClassificationId: itemData.browseClassification?.classificationId,
    itemClassification: itemData.itemClassification,
    itemName: itemData.itemName,
    memorabilia: itemData.memorabilia,
    tradeInEligible: itemData.tradeInEligible,
    websiteDisplayGroup: itemData.websiteDisplayGroup,
    websiteDisplayGroupName: itemData.websiteDisplayGroupName,
    attributes: item.attributes ? JSON.stringify(item.attributes) : null,
    salesRanks: item.salesRanks ? JSON.stringify(item.salesRanks) : null,
  };
};

export async function fetchCatalogItem(
  marketplaceIds: Array<string>,
  asin: string
): Promise<any> {
  const params: any = {
    marketplaceIds,
    includedData: "salesRanks,summaries,attributes",
    // keywords: "books",
    // sellerId: "A14IOOJN7DLJME",
    // identifiersType: "SKU",
    // Query: "books", // At least one of Query, SellerSKU, UPC, EAN, ISBN, JAN is also required.
  };
  return parseCatalogItem(
    await callSpApi(`catalog/2022-04-01/items/${asin}`, params)
  );
}

const parseItemData = (item: any) => {
  if (!item?.summaries?.length) {
    return;
  }
  const itemData = item.summaries[0];
  return {
    sku: item.sku,
    marketplaceId: itemData.marketplaceId,
    asin: itemData.asin,
    productType: itemData.productType,
    conditionType: itemData.conditionType,
    status: itemData.status.join(","),
    itemName: itemData.itemName,
    createdDate: itemData.createdDate,
    lastUpdatedDate: itemData.lastUpdatedDate,
    mainImageLink: itemData.mainImage?.link,
    mainImageHeight: itemData.mainImage?.height,
    mainImageWidth: itemData.mainImage?.width,
    issues: item.issues ? JSON.stringify(item.issues) : null,
    offers: item.offers ? JSON.stringify(item.offers) : null,
    fulfillment: item.fulfillmentAvailability
      ? JSON.stringify(item.fulfillmentAvailability)
      : null,
  };
};

export async function fetchItemData(
  marketplaceIds: Array<string>,
  sellerId: string,
  sku: string
): Promise<any> {
  const params: any = {
    marketplaceIds,
    includedData: "issues,summaries,offers,fulfillmentAvailability",
  };
  return parseItemData(
    await callSpApi(`/listings/2021-08-01/items/${sellerId}/${sku}`, params)
  );
}

// const data = {
//   sku: "TI-1GQD-H5HA",
//   summaries: [
//     {
//       marketplaceId: "A21TJRUUN4KGV",
//       asin: "B07DQLT7DS",
//       productType: "ABIS_BOOK",
//       conditionType: "new_new",
//       status: ["DISCOVERABLE"],
//       itemName: "Satyarth Prakash",
//       createdDate: "2024-03-08T13:09:15.486Z",
//       lastUpdatedDate: "2024-03-09T14:15:23.644Z",
//       mainImage: {
//         link: "https://m.media-amazon.com/images/I/51tqMAoxZ5L.jpg",
//         height: 500,
//         width: 318,
//       },
//     },
//   ],
// };
