import { callSpApi } from "@/services/amazon/index";
import { parseValue } from "@/utils";

export async function parseSellerData(
  data: any,
  sellerAccountId: number
): Promise<any> {
  if (!data?.payload) {
    return [];
  }

  const { payload } = data;
  return payload?.map((item: any) => ({
    sellerAccountId,
    name: parseValue(item?.marketplace?.name),
    marketplaceId: parseValue(item?.marketplace?.id),
    countryCode: parseValue(item?.marketplace?.countryCode),
    currencyCode: parseValue(item?.marketplace?.defaultCurrencyCode),
    domainName: parseValue(item?.marketplace?.domainName),
    defaultLanguage: parseValue(item?.marketplace?.defaultLanguageCode),
    isParticipating: parseValue(item?.participation?.isParticipating),
    hasSuspendedListings: parseValue(item?.participation?.hasSuspendedListings),
  }));
}

export async function fetchSellerData(sellerAccountId: number): Promise<any> {
  const params: any = {};
  return parseSellerData(
    await callSpApi("sellers/v1/marketplaceParticipations", params),
    sellerAccountId
  );
}
