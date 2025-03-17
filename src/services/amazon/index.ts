import * as qs from "querystring";

import axios from "axios";

let AccessToken = "";

export const updateAccessToken = async (refreshToken: string) => {
  const { accessToken } = await getApiToken(refreshToken);
  if (!accessToken) {
    console.error("Failed to get access token");
    return null;
  }

  AccessToken = accessToken;
  return accessToken;
};

export async function getApiToken(
  refreshToken: string | null = null,
  code: string | null = null
) {
  const url = "https://api.amazon.com/auth/o2/token";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };
  const data = refreshToken
    ? new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.NEXT_PUBLIC_AMAZON_CLIENT_ID || "",
        client_secret: process.env.NEXT_PUBLIC_AMAZON_CLIENT_SECRET || "",
      }).toString()
    : new URLSearchParams({
        grant_type: "authorization_code",
        code: code || "",
        client_id: process.env.NEXT_PUBLIC_AMAZON_CLIENT_ID || "",
        client_secret: process.env.NEXT_PUBLIC_AMAZON_CLIENT_SECRET || "",
        redirect_uri: process.env.NEXT_PUBLIC_AMAZON_REDIRECT_URI || "",
      }).toString();

  try {
    const response = await axios.post(url, data, { headers });
    return {
      accessToken: response?.data?.access_token,
      refreshToken: response?.data?.refresh_token,
    };
  } catch (err: any) {
    console.error(
      `Failed to get access token. Status code: ${
        err.response?.status
      }, Response: ${JSON.stringify(err.response?.data)}`
    );
    return { accessToken: null, refreshToken: null };
  }
}

export async function callSpApi(
  endpoint: string,
  params?: any,
  data?: any
): Promise<any> {
  const baseUrl = "https://sellingpartnerapi-eu.amazon.com";
  let url = `${baseUrl}/${endpoint}`;
  if (params) {
    url += `?${qs.stringify(params)}`;
  }
  console.log(url, data);

  const headers = {
    Authorization: `Bearer ${AccessToken}`,
    "Content-Type": "application/json",
    "x-amz-access-token": AccessToken,
    "x-amz-target":
      "Amazon.BrandAnalytics.SellingPartner.SPAPI.GetBrandAnalyticsMarketBasketReport",
  };

  try {
    if (params) {
      const response = await axios.get(url, { headers, data });
      return response.data;
    }

    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (err: any) {
    console.error(
      `Failed to call SP-API. Endpoint: ${endpoint}, Status code: ${
        err.response?.status
      }, Response: ${JSON.stringify(err.response?.data)}`
    );
    return null;
  }
}
