import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import MuiTableRow from "@mui/material/TableRow";

import Table from "@/libs/components/Table";
import { HeadCellDef } from "@/libs/components/Table/table-head";
import { fCurrency } from "@/libs/utils/number";
import { fDate } from "@/libs/utils/time";

import { DefaultPaginationLimit } from "@/utils/constants";

const HeadLabel: Array<HeadCellDef> = [
  { id: "startTime", label: "Start Time" },
  { id: "endTime", label: "End Time" },
  { id: "orderCount", label: "Orders Count" },
  { id: "orderItemCount", label: "Order Items Count" },
  { id: "totalSalesAmount", label: "Sales Amount" },
  { id: "averageUnitPrice", label: "Average Unit Price" },
];

const RowComponent = ({ row }: { row: Record<string, any> }) => (
  <MuiTableRow hover sx={{ cursor: "pointer" }}>
    <TableCell>{fDate(row.startUnixTimestamp)}</TableCell>
    <TableCell>{fDate(row.endUnixTimestamp)}</TableCell>
    <TableCell>{row.orderCount}</TableCell>
    <TableCell>{row.orderItemCount}</TableCell>
    <TableCell>{fCurrency(row.totalSalesAmount)}</TableCell>
    <TableCell>{fCurrency(row.averageUnitPrice)}</TableCell>
  </MuiTableRow>
);

const DashboardSalesList = ({ data }: { data: Array<Record<string, any>> }) => (
  <Box sx={{ mt: 2 }}>
    <Table
      RowComponent={RowComponent}
      headLabel={HeadLabel}
      data={data}
      defaultOrderBy="startTime"
      defaultRowsPerPage={DefaultPaginationLimit}
    />
  </Box>
);

export default DashboardSalesList;
