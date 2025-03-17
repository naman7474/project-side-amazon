import Prisma from "@/services/database";
import { getPreviousDate } from "@/utils/time";

export class AmazonOrdersService {
  static async addOrdersData(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    const batchSize = 10;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length));
      await Prisma.$transaction(async (tx) => {
        for (const item of batch) {
          const existingRecord = await tx.amazonOrders.findFirst({
            where: {
              sellerAccountId,
              orderId: item.orderId,
            },
          });

          if (existingRecord) {
            await tx.amazonOrders.update({
              where: { id: existingRecord.id },
              data: {
                sellerAccountId,
                ...item,
              },
            });
          } else {
            await tx.amazonOrders.create({
              data: {
                sellerAccountId,
                orderId: item.orderId,
                ...item,
              },
            });
          }
        }
      });
    }
  }

  static async getOrdersData(sellerAccountId: number) {
    return await Prisma.amazonOrders.findMany({
      where: {
        sellerAccountId,
        purchaseDate: {
          gte: new Date(getPreviousDate(30)).toISOString(),
        },
      },
    });
  }

  static async getOrdersCount(sellerAccountId: number) {
    return await Prisma.amazonOrders.count({
      where: {
        sellerAccountId,
      },
    });
  }

  static async addFinancesData(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    const batchSize = 10;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length));
      await Prisma.$transaction(async (tx) => {
        for (const item of batch) {
          const existingRecord = await tx.amazonFinances.findFirst({
            where: {
              sellerAccountId,
              orderId: item.orderId,
            },
          });

          if (existingRecord) {
            await tx.amazonFinances.update({
              where: { id: existingRecord.id },
              data: {
                sellerAccountId,
                ...item,
              },
            });
          } else {
            await tx.amazonFinances.create({
              data: {
                sellerAccountId,
                orderId: item.orderId,
                ...item,
              },
            });
          }
        }
      });
    }
  }
}
