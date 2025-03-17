// interface FeeEstimateRequest {
//   MarketplaceId: string;
//   IdType: string;
//   IdValue: string;
//   IsAmazonFulfilled: boolean;
//   PriceToEstimateFees: {
//     ListingPrice: {
//       CurrencyCode: string;
//       Amount: number;
//     };
//     Shipping: {
//       CurrencyCode: string;
//       Amount: number;
//     };
//     Points?: {
//       PointsNumber: number;
//     };
//   };
//   Identifier: string;
// }
//
// async function getFeeEstimates(
//   accessToken: string,
//   asin: string,
//   marketplaceId: string,
//   price: number,
//   shipping: number = 0
// ): Promise<any> {
//   const apiUrl = `https://sellingpartnerapi.amazon.com/products/fees/v0/items/${asin}/feesEstimate`;
//   const data: FeeEstimateRequest = {
//     MarketplaceId: marketplaceId,
//     IdType: "ASIN",
//     IdValue: asin,
//     IsAmazonFulfilled: true, // Change to false if not FBA
//     PriceToEstimateFees: {
//       ListingPrice: {
//         CurrencyCode: "USD", // Adjust as needed
//         Amount: price,
//       },
//       Shipping: {
//         CurrencyCode: "USD", // Adjust as needed
//         Amount: shipping,
//       },
//     },
//     Identifier: "request1", // Unique identifier for the request
//   };
//
//   try {
//     const response = await axios.post(apiUrl, data, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "x-amz-access-token": accessToken,
//         "Content-Type": "application/json",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Failed to get fee estimates:", error);
//     return null;
//   }
// }
//
// // Example usage:
// (async () => {
//   const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with your actual access token
//   const asin = "YOUR_ASIN"; // Replace with the ASIN you're interested in
//   const marketplaceId = "MARKETPLACE_ID"; // Replace with the marketplace ID, e.g., ATVPDKIKX0DER for Amazon US
//   const price = 100; // Example price
//   const shipping = 0; // Example shipping cost (set to 0 if not applicable)
//
//   const feeEstimates = await getFeeEstimates(
//     accessToken,
//     asin,
//     marketplaceId,
//     price,
//     shipping
//   );
//   if (feeEstimates) {
//     console.log("Fee Estimates:", feeEstimates);
//   }
// })();
