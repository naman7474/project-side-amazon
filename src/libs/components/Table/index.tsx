import {
  ChangeEvent,
  ComponentType,
  MouseEvent,
  ReactNode,
  useState,
} from "react";

import Card from "@mui/material/Card";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import Scrollbar from "@/libs/components/Scrollbar";

import TableEmptyRows from "./table-empty-rows";
import TableHead, { HeadCellDef } from "./table-head";
import TableNoData from "./table-no-data";
import TableToolbar from "./table-toolbar";
import { emptyRows, applyFilter, getComparator } from "./utils";

export type TableProps<T> = {
  headLabel: Array<HeadCellDef>;
  data: Array<T>;
  RowComponent: ComponentType<{
    row: T;
  }>;
  defaultOrderBy: string;
  defaultRowsPerPage: number;
  count?: number;
  createText?: string;
  createLink?: string;
  onCreateClick?: VoidFunction;
  searchFields?: Array<string>;
  onPageChange?: (page: number) => void;
  FilterComponent?: ReactNode;
};

export default function Table<T>({
  headLabel,
  data,
  RowComponent,
  defaultOrderBy,
  defaultRowsPerPage,
  count,
  createText = "Add",
  createLink,
  onCreateClick,
  searchFields,
  onPageChange,
  FilterComponent,
}: TableProps<T>) {
  const [page, setPage] = useState<number>(0);

  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);

  const [search, setSearch] = useState<string>("");

  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultRowsPerPage);

  const handleSort = (event: any, id: string) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSearch = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setPage(0);
    setSearch(event.target.value);
  };

  const dataFiltered = applyFilter<T>({
    inputData: data,
    comparator: getComparator(order, orderBy),
    search,
    searchFields: searchFields || [],
  });

  const noData = !dataFiltered.length;

  return (
    <Card>
      {!!(
        searchFields?.length ||
        createLink ||
        onCreateClick ||
        FilterComponent
      ) && (
        <TableToolbar
          numSelected={0}
          search={search}
          handleSearch={handleSearch}
          searchFields={searchFields}
          createText={createText}
          createLink={createLink}
          onCreateClick={onCreateClick}
          FilterComponent={FilterComponent}
        />
      )}

      <TableContainer sx={{ overflow: "unset" }}>
        <Scrollbar>
          <MuiTable sx={{ minWidth: 800 }}>
            <TableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleSort}
              headLabel={headLabel}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: T, idx: number) => (
                  <RowComponent key={`row-${idx}`} row={row} />
                ))}

              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, data.length)}
              />

              {noData && (
                <TableNoData query={search} length={headLabel?.length || 6} />
              )}
            </TableBody>
          </MuiTable>
        </Scrollbar>
      </TableContainer>

      <TablePagination
        page={page}
        component="div"
        count={count || data.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[defaultRowsPerPage]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
