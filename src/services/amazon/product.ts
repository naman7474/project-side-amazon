import { callSpApi } from "@/services/amazon/index";

const parseProductPricing = (data: any) => {
  if (!data?.payload) {
    return [];
  }

  const item = data?.payload?.[0];
  return {
    sku: item?.SellerSKU,
    marketplaceId: item?.Product?.Identifiers?.SKUIdentifier?.MarketplaceId,
    offers: item?.Product?.Offers
      ? JSON.stringify(item?.Product?.Offers)
      : null,
  };
};

export async function fetchProductPricing(
  marketplaceId: string,
  skus: Array<string>
): Promise<any> {
  const params: any = {
    MarketplaceId: marketplaceId,
    Skus: skus,
    ItemType: "Sku",
  };
  return parseProductPricing(
    await callSpApi(`products/pricing/v0/price`, params)
  );
}

const parseProductOffers = (item: any) => {
  if (!item?.payload) {
    return null;
  }

  return {
    sku: item.payload.SKU,
    status: item.payload.status,
    itemCondition: item.payload.ItemCondition,
    marketplaceId: item.payload.marketplaceId,
    sellerSku: item.payload.Identifier?.SellerSKU,
    summary: JSON.stringify(item.payload.Summary),
    offers: JSON.stringify(item.payload.Offers),
  };
};

export async function fetchProductOffers(
  marketplaceId: string,
  sku: string
): Promise<any> {
  const params: any = {
    MarketplaceId: marketplaceId,
    ItemCondition: "New",
    // keywords: "books",
    // sellerId: "A14IOOJN7DLJME",
    // identifiersType: "SKU",
    // Query: "books", // At least one of Query, SellerSKU, UPC, EAN, ISBN, JAN is also required.
  };
  return parseProductOffers(
    await callSpApi(`products/pricing/v0/listings/${sku}/offers`, params)
  );
}

const parseProductFees = (data: any) => {
  if (!data?.payload) {
    return null;
  }

  const item = data?.payload;
  return {
    sku: item?.FeesEstimateResult?.FeesEstimateIdentifier?.IdValue,
    feesEstimate: item?.FeesEstimateResult?.FeesEstimate
      ? JSON.stringify(item?.FeesEstimateResult?.FeesEstimate)
      : null,
    feesEstimateIdentifier: item?.FeesEstimateResult?.FeesEstimateIdentifier
      ? JSON.stringify(item?.FeesEstimateResult?.FeesEstimateIdentifier)
      : null,
  };
};

export async function fetchProductFees(
  marketplaceId: string,
  sku: string,
  listingPrice: number,
  listingCurrency: string
): Promise<any> {
  const data = {
    IdType: "SellerSKU",
    IdValue: sku,
    FeesEstimateRequest: {
      MarketplaceId: marketplaceId,
      PriceToEstimateFees: {
        ListingPrice: {
          Amount: listingPrice,
          CurrencyCode: listingCurrency,
        },
      },
      Identifier: sku,
    },
  };
  return parseProductFees(
    await callSpApi(
      `/products/fees/v0/listings/${sku}/feesEstimate`,
      null,
      data
    )
  );
}
