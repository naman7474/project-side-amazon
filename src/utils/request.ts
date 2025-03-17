import { DefaultPaginationLimit } from "@/utils/constants";

const ErrorResponse = (status: number, data: any) =>
  new Response(JSON.stringify(data), { status });

export const InternalServerErrorResponse = (status?: number, data?: any) =>
  new Response(
    JSON.stringify(data || { success: false, error: "Internal Server Error" }),
    { status: status || 500 }
  );

export const BadRequestResponse = (message?: string) =>
  ErrorResponse(400, { success: false, error: message || "Bad Request" });

export const NotFoundResponse = () =>
  ErrorResponse(404, { success: false, error: "Not Found" });

export const UnauthorizedResponse = (message?: string) =>
  ErrorResponse(401, { success: false, error: message || "Unauthorized" });

export const ForbiddenResponse = (message?: string) =>
  ErrorResponse(403, { success: false, error: message || "Forbidden" });

export const SuccessResponse = (data: any) =>
  new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const isDashboardRequest = (req: Request): boolean => {
  const source = req.headers.get("source");
  return source === "dashboard";
};

export const getLimitAndNext = (
  url: string
): { limit: number; next: number } => {
  const { searchParams } = new URL(url);
  const limit =
    parseInt(searchParams.get("limit") || "", 10) || DefaultPaginationLimit;
  const next = parseInt(searchParams.get("next") || "", 10) || 0;

  return { limit, next };
};

export const getUrlSearchParam = (
  url: string,
  param: string,
  defaultValue?: string
): string => {
  const { searchParams } = new URL(url);
  return searchParams.get(param) || defaultValue || "";
};
