import { useCallback, useState } from "react";

import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import TableCell from "@mui/material/TableCell";

export default function ImageTableCell({
  src,
  width,
  height,
}: {
  src: string;
  width?: number;
  height?: number;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = useCallback(() => {
    if (!src) {
      return;
    }

    setOpen(true);
  }, [src]);
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  return (
    <>
      {open && (
        <Dialog open={open} onClose={handleClose} maxWidth="xl">
          <Avatar
            variant="square"
            src={src}
            alt="Image"
            sx={{
              width: "auto",
              height: "auto",
              maxWidth: "80vw",
              maxHeight: "90vh",
            }}
          >
            {" "}
          </Avatar>
        </Dialog>
      )}
      <TableCell
        onClick={handleOpen}
        sx={{ cursor: src ? "pointer" : "initial" }}
      >
        <Avatar
          sizes="lg"
          variant="rounded"
          src={src}
          alt="Image"
          sx={{ height: height || 70, width: width || 70 }}
        >
          {" "}
        </Avatar>
      </TableCell>
    </>
  );
}
