import Prisma from "@/services/database";

export class AmazonReportService {
  static async addReports(sellerAccountId: number, data: any) {
    const reportData = data.map((item: any) => {
      return {
        sellerAccountId,
        ...item,
      };
    });
    return Prisma.amazonReports.createMany({
      data: reportData,
    });
  }

  static async getPendingReports(sellerAccountId: number) {
    return Prisma.amazonReports.findMany({
      where: {
        sellerAccountId,
        status: {
          in: ["IN_PROGRESS", "IN_PROGRESS"],
        },
      },
    });
  }

  static async updateReportsStatus(id: number, status: string) {
    return Prisma.amazonReports.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  static async createReportData(data: any) {
    return Prisma.amazonReportData.create({
      data,
    });
  }
}
