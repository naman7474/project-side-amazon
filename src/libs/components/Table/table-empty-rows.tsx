import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export default function TableEmptyRows({
  emptyRows,
  height,
}: {
  emptyRows: number;
  height: number;
}) {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={{
        ...(height && {
          height: height * emptyRows,
        }),
      }}
    >
      <TableCell colSpan={9} />
    </TableRow>
  );
}
