import Prisma from "@/services/database";

export class PartnerService {
  static async getPartnerList(userId?: number) {
    const userQuery = userId ? { userId } : {};
    const partners = await Prisma.amazonSellerAccount.findMany({
      where: { ...userQuery, isShadowed: false },
      select: {
        id: true,
        name: true,
        sellerId: true,
        refreshToken: true,
        accessToken: true,
      },
    });

    return { partners };
  }

  static async getPartnerDetail(id: number) {
    const partner = await Prisma.amazonSellerAccount.findUnique({
      where: {
        id,
        isShadowed: false,
      },
      select: {
        id: true,
        name: true,
        sellerId: true,
        refreshToken: true,
        accessToken: true,
      },
    });

    return { ...partner };
  }

  static async createPartner(
    userId: number,
    sellerId: string,
    refreshToken: string,
    accessToken: string
  ) {
    return Prisma.amazonSellerAccount.create({
      data: {
        name: "Amazon",
        userId,
        sellerId,
        refreshToken,
        accessToken,
      },
    });
  }

  static async updatePartner(
    id: number,
    refreshToken: string,
    accessToken: string
  ) {
    return Prisma.amazonSellerAccount.update({
      where: { id },
      data: {
        refreshToken,
        accessToken,
      },
    });
  }

  static async getPartnerMarketplaces(id: number) {
    const marketplaces = await Prisma.amazonSellerMarketplace.findMany({
      where: { sellerAccountId: id },
    });

    return { marketplaces };
  }
}
