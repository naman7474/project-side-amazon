import _ from "lodash";

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  clip: "rect(0 0 0 0)",
};

export function emptyRows(
  page: number,
  rowsPerPage: number,
  arrayLength: number
) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: "asc" | "desc",
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter<T>({
  inputData,
  comparator,
  search,
  searchFields,
}: {
  inputData: Array<T>;
  comparator: (a: any, b: any) => number;
  search?: string;
  searchFields?: Array<string>;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    // @ts-ignore
    return a[1] - b[1];
  });

  // @ts-ignore
  inputData = stabilizedThis.map((el) => el[0]);

  if (search && searchFields?.length) {
    inputData = inputData.filter((item) =>
      searchFields.some((field) =>
        _.get(item, field)?.toLowerCase()?.includes(search.toLowerCase())
      )
    );
  }

  return inputData;
}
