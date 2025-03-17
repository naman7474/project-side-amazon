import { formatISO, getUnixTime, parseISO, subDays } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";

import { callSpApi } from "@/services/amazon/index";
import { parseValue } from "@/utils";

const getLast31DaysInterval = () => {
  const today = new Date();
  const thirtyTwoDaysAgo = subDays(today, 31); // 31 because we're including today in the count

  // Format dates with timezone offset manually to '-07:00'. Adjust if needed.
  const formatWithTimezoneOffset = (date: Date) => {
    const isoString = formatISO(date, { representation: "complete" });
    const offsetIndex =
      isoString.lastIndexOf("+") > 0
        ? isoString.lastIndexOf("+")
        : isoString.length;
    return `${isoString.substring(0, offsetIndex)}-07:00`;
  };

  const startDateString = formatWithTimezoneOffset(thirtyTwoDaysAgo);
  const endDateString = formatWithTimezoneOffset(today);

  return `${startDateString}--${endDateString}`;
};

const breakIntervalIntoUnixTimestamps = (
  interval: string
): [number, number] => {
  const [startString, endString] = interval.split("--");

  // Convert ISO strings to Date objects, considering timezone
  const startDate = zonedTimeToUtc(parseISO(startString), "Asia/Kolkata");
  const endDate = zonedTimeToUtc(parseISO(endString), "Asia/Kolkata");

  // Convert Date objects to Unix timestamps
  const startUnixTimestamp = getUnixTime(startDate) * 1000;
  const endUnixTimestamp = getUnixTime(endDate) * 1000;

  return [startUnixTimestamp, endUnixTimestamp];
};

export const fetchSalesData = async (
  marketPlaceIds: Array<string>
): Promise<any> => {
  const params: any = {
    marketplaceIds: marketPlaceIds,
    interval: getLast31DaysInterval(),
    granularity: "Day",
  };

  return parseSalesData(await callSpApi("sales/v1/orderMetrics", params));
};

export const parseSalesData = (data: any) => {
  if (!data?.payload) {
    return [];
  }

  const { payload } = data;

  return payload.map((orderMetric: any) => {
    const { interval } = orderMetric;
    const [startUnixTimestamp, endUnixTimestamp] =
      breakIntervalIntoUnixTimestamps(interval);

    return {
      startUnixTimestamp,
      endUnixTimestamp,
      unitCount: parseValue(orderMetric?.unitCount),
      orderItemCount: parseValue(orderMetric?.orderItemCount),
      orderCount: parseValue(orderMetric?.orderCount),
      totalSalesAmount: parseValue(orderMetric?.totalSales?.amount),
      totalSalesCurrency: parseValue(orderMetric?.totalSales?.currencyCode),
      averageUnitPrice: parseValue(orderMetric?.averageUnitPrice?.amount),
      averageUnitPriceCurrency: parseValue(
        orderMetric?.averageUnitPrice?.currencyCode
      ),
    };
  });
};
