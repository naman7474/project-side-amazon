import { useCallback, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import TextField from "@mui/material/TextField";

import { useApi } from "@/hooks/use-apis";

enum Status {
  Active = "active",
  Inactive = "inactive",
}

export default function StatusTableCell({
  data,
  api,
}: {
  data: Record<string, any>;
  api: string;
}) {
  const [status, setStatus] = useState<Status>(
    data?.isShadowed ? Status.Inactive : Status.Active
  );
  const { isLoading, postData } = useApi();

  const onChange = useCallback(
    (ev: any) => {
      setStatus(ev.target.value);
      postData(api, {
        ...data,
        isShadowed: ev.target.value === Status.Inactive,
      });
    },
    // eslint-disable-next-line
    []
  );
  return (
    <TableCell sx={{ cursor: "pointer" }}>
      <>
        {isLoading ? (
          <CircularProgress size={20} />
        ) : (
          <TextField value={status} size="small" select onChange={onChange}>
            <MenuItem value={Status.Active}>Active</MenuItem>
            <MenuItem value={Status.Inactive}>Inactive</MenuItem>
          </TextField>
        )}
      </>
    </TableCell>
  );
}
