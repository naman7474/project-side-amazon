import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

export default function TableNoData({
  query,
  length,
}: {
  query: string;
  length: number;
}) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={length} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: "center",
          }}
        >
          <>
            {query ? (
              <>
                <Box
                  component="img"
                  src="/assets/illustrations/illustration_not_found.png"
                  sx={{
                    mx: "auto",
                    height: 120,
                    mt: 5,
                  }}
                />

                <Typography variant="h4" paragraph>
                  Not found
                </Typography>

                <Typography variant="body2">
                  No results found for &nbsp;
                  <strong>&quot;{query}&quot;</strong>.
                  <br /> Try checking for typos or using complete words.
                </Typography>
              </>
            ) : (
              <>
                <Box
                  component="img"
                  src="/assets/illustrations/illustration_not_found.png"
                  sx={{
                    mx: "auto",
                    height: 120,
                    mt: 5,
                  }}
                />

                <Typography variant="h4" paragraph>
                  No data
                </Typography>
              </>
            )}
          </>
        </Paper>
      </TableCell>
    </TableRow>
  );
}
