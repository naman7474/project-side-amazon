import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import MuiTableRow from "@mui/material/TableRow";

import Table from "@/libs/components/Table";
import { HeadCellDef } from "@/libs/components/Table/table-head";
import { fCurrency } from "@/libs/utils/number";
import { fDate } from "@/libs/utils/time";

import { DefaultPaginationLimit } from "@/utils/constants";

const HeadLabel: Array<HeadCellDef> = [
  { id: "orderId", label: "Id" },
  { id: "purchaseDate", label: "Purchase Date" },
  { id: "total", label: "Total" },
  { id: "earliestShipDate", label: "Earliest Shipping Date" },
  { id: "latestShipDate", label: "Latest Shipping Date" },
  { id: "status", label: "Status" },
];

const RowComponent = ({ row }: { row: Record<string, any> }) => (
    <MuiTableRow hover>
      <TableCell>{row.orderId}</TableCell>
      <TableCell>{fDate(row.purchaseDate)}</TableCell>
      <TableCell>{fCurrency(row.orderTotalAmount)}</TableCell>
      <TableCell>{fDate(row.earliestShipDate)}</TableCell>
      <TableCell>{fDate(row.latestShipDate)}</TableCell>
      <TableCell>{row.status}</TableCell>
    </MuiTableRow>
  );

const DashboardOrdersList = ({
  data,
}: {
  data: Array<Record<string, any>>;
}) => (
    <Box sx={{ mt: 2 }}>
      <Table
        RowComponent={RowComponent}
        headLabel={HeadLabel}
        data={data}
        defaultOrderBy="id"
        defaultRowsPerPage={DefaultPaginationLimit}
      />
    </Box>
  );

export default DashboardOrdersList;
