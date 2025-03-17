import Prisma from "@/services/database";
import { getPreviousDate } from "@/utils/time";

export class AmazonSalesService {
  static async addSalesData(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    const batchSize = 10; // Adjustable batch size for flexibility

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, Math.min(i + batchSize, data.length)); // Optimized batch slicing
      await Prisma.$transaction(async (tx) => {
        for (const item of batch) {
          const startUnixTimestamp = new Date(
            item.startUnixTimestamp
          ).toISOString();
          const endUnixTimestamp = new Date(
            item.endUnixTimestamp
          ).toISOString();
          const existingRecord = await tx.amazonSales.findFirst({
            where: {
              sellerAccountId,
              startUnixTimestamp,
              endUnixTimestamp,
            },
          });

          if (existingRecord) {
            // Update existing record if timestamps match
            await tx.amazonSales.update({
              where: { id: existingRecord.id },
              data: {
                sellerAccountId,
                ...item,
                startUnixTimestamp,
                endUnixTimestamp,
              },
            });
          } else {
            // Create new record if timestamps don't match
            await tx.amazonSales.create({
              data: {
                sellerAccountId,
                ...item,
                startUnixTimestamp,
                endUnixTimestamp,
              },
            });
          }
        }
      });
    }
  }

  static async getSalesData(sellerAccountId: number) {
    return await Prisma.amazonSales.findMany({
      where: {
        sellerAccountId,
        startUnixTimestamp: {
          gte: new Date(getPreviousDate(30)).toISOString(),
        },
      },
    });
  }
}
