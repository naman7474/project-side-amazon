import { callSpApi } from "@/services/amazon/index";

export async function fetchReport(reportType: string): Promise<any> {
  const params: any = {
    reportTypes: reportType,
  };
  return callSpApi("reports/2021-06-30/reports", params);
}

export async function fetchReportDocument(documentId: string): Promise<any> {
  const params: any = {};
  return callSpApi(`reports/2021-06-30/documents/${documentId}`, params);
}

export async function fetchReportDetail(reportId: string): Promise<any> {
  return callSpApi(`/reports/2021-06-30/reports/${reportId}`, {});
}

export async function createAmazonReport(
  reportType: string,
  marketplaceIds: Array<string>,
  data: Record<string, any>
): Promise<any> {
  const payload: any = {
    reportType: reportType,
    marketplaceIds,
    ...data,
  };
  return callSpApi("reports/2021-06-30/reports", null, payload);
}
