import { ReactNode } from "react";

import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import MuiTableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

import { visuallyHidden } from "./utils";

export type HeadCellDef = {
  id: string;
  label: ReactNode;
  align?: "left" | "right" | "center";
  width?: number;
  minWidth?: number;
};

export default function TableHead({
  order,
  orderBy,
  headLabel,
  onRequestSort,
}: {
  order: "asc" | "desc";
  orderBy: string;
  headLabel: Array<HeadCellDef>;
  onRequestSort: (event: any, property: string) => void;
}) {
  const onSort = (property: string) => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <MuiTableHead>
      <TableRow>
        {headLabel.map((headCell: HeadCellDef) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={onSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </MuiTableHead>
  );
}
