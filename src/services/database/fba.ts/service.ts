import Prisma from "@/services/database";

export class AmazonFbaService {
  static async addInboundData(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    const batchSize = 10; // Adjustable batch size for flexibility

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length)); // Optimized batch slicing
      await Prisma.$transaction(async (tx) => {
        for (const item of batch) {
          const existingRecord = await tx.amazonFbaInbound.findFirst({
            where: {
              sellerAccountId,
              asin: item.asin,
            },
          });

          if (existingRecord) {
            await tx.amazonFbaInbound.update({
              where: { id: existingRecord.id },
              data: {
                sellerAccountId,
                ...item,
              },
            });
          } else {
            await tx.amazonFbaInbound.create({
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

  static async addInventoryData(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    const batchSize = 10; // Adjustable batch size for flexibility

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length)); // Optimized batch slicing
      await Prisma.$transaction(async (tx) => {
        for (const item of batch) {
          const existingRecord = await tx.amazonFbaInventory.findFirst({
            where: {
              sellerAccountId,
              asin: item.asin,
              createdAt: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          });

          if (existingRecord) {
            await tx.amazonFbaInventory.update({
              where: { id: existingRecord.id },
              data: {
                sellerAccountId,
                ...item,
              },
            });
          } else {
            await tx.amazonFbaInventory.create({
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
}
