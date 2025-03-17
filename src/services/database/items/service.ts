import Prisma from "@/services/database";

export class AmazonItemsService {
  static async addItemsData(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    const batchSize = 10; // Adjustable batch size for flexibility

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length)); // Optimized batch slicing
      await Prisma.$transaction(async (tx) => {
        for (const item of batch) {
          const existingRecord = await tx.amazonItem.findFirst({
            where: {
              sellerAccountId,
              asin: item.asin,
            },
          });

          if (existingRecord) {
            await tx.amazonItem.update({
              where: { id: existingRecord.id },
              data: {
                sellerAccountId,
                ...item,
              },
            });
          } else {
            await tx.amazonItem.create({
              data: {
                sellerAccountId,
                ...item,
              },
            });
          }
        }
      });
    }
  }

  static async getItemsData(sellerAccountId: number) {
    return await Prisma.amazonItem.findMany({
      where: {
        sellerAccountId,
      },
    });
  }

  static async getItemsCount(sellerAccountId: number) {
    return await Prisma.amazonItem.count({
      where: {
        sellerAccountId,
      },
    });
  }

  static async addCatalogData(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    const batchSize = 10; // Adjustable batch size for flexibility

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length)); // Optimized batch slicing
      await Prisma.$transaction(async (tx) => {
        for (const item of batch) {
          const existingRecord = await tx.amazonCatalogProduct.findFirst({
            where: {
              sellerAccountId,
              asin: item.asin,
            },
          });

          if (existingRecord) {
            await tx.amazonCatalogProduct.update({
              where: { id: existingRecord.id },
              data: {
                sellerAccountId,
                ...item,
              },
            });
          } else {
            await tx.amazonCatalogProduct.create({
              data: {
                sellerAccountId,
                asin: item.asin,
                ...item,
              },
            });
          }
        }
      });
    }
  }

  static async addOffersData(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    const batchSize = 10; // Adjustable batch size for flexibility

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length)); // Optimized batch slicing
      await Prisma.$transaction(async (tx) => {
        for (const item of batch) {
          if (!item?.sku) continue;
          const existingRecord = await tx.amazonOffer.findFirst({
            where: {
              sellerAccountId,
              sku: item.sku,
            },
          });

          if (existingRecord) {
            await tx.amazonOffer.update({
              where: { id: existingRecord.id },
              data: {
                sellerAccountId,
                ...item,
              },
            });
          } else {
            await tx.amazonOffer.create({
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
