import Prisma from "@/services/database";

export class AmazonProductService {
  static async addProductPricingData(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    const batchSize = 10; // Adjustable batch size for flexibility
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length)); // Optimized batch slicing
      await Prisma.$transaction(async (tx) => {
        for (const item of batch) {
          const existingRecord = await tx.amazonProductPricing.findFirst({
            where: {
              sellerAccountId,
              sku: item.sku,
            },
          });

          if (existingRecord) {
            // Update existing record if timestamps match
            await tx.amazonProductPricing.update({
              where: { id: existingRecord.id },
              data: {
                sellerAccountId,
                sku: item.sku,
                ...item,
              },
            });
          } else {
            // Create new record if timestamps don't match
            await tx.amazonProductPricing.create({
              data: {
                sellerAccountId,
                sku: item.sku,
                ...item,
              },
            });
          }
        }
      });
    }
  }

  static async getProductPricingData(sellerAccountId: number) {
    return await Prisma.amazonProductPricing.findMany({
      where: {
        sellerAccountId,
      },
    });
  }

  static async addProductFeesData(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    const batchSize = 10; // Adjustable batch size for flexibility
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length)); // Optimized batch slicing
      await Prisma.$transaction(async (tx) => {
        for (const item of batch) {
          const existingRecord = await tx.amazonProductFees.findFirst({
            where: {
              sellerAccountId,
              sku: item.sku,
            },
          });

          if (existingRecord) {
            // Update existing record if timestamps match
            await tx.amazonProductFees.update({
              where: { id: existingRecord.id },
              data: {
                sellerAccountId,
                sku: item.sku,
                ...item,
              },
            });
          } else {
            // Create new record if timestamps don't match
            await tx.amazonProductFees.create({
              data: {
                sellerAccountId,
                sku: item.sku,
                ...item,
              },
            });
          }
        }
      });
    }
  }
}
