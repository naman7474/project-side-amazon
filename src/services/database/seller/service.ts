import Prisma from "@/services/database";

export class SellerMarketplaceService {
  static async createSellerMarketplace(
    sellerAccountId: number,
    data: Array<Record<string, any>>
  ) {
    await Prisma.$transaction(async (tx) => {
      const marketplacesData = await tx.amazonSellerMarketplace.findFirst({
        where: { sellerAccountId },
      });
      if (!marketplacesData) {
        await tx.amazonSellerMarketplace.createMany({
          data: data.map((item) => ({
            sellerAccountId,
            ...item,
          })),
        });
      }
    });
  }

  static async getMarketplaceData(sellerAccountId: number) {
    return await Prisma.amazonSellerMarketplace.findMany({
      where: { sellerAccountId },
    });
  }
}
