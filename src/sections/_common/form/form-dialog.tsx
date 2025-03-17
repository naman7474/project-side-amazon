import { ReactNode } from "react";

import { DialogTitle } from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";

import FormHolder, { FormHolderProps } from "./form-holder";

interface DialogProps<T> extends FormHolderProps<T> {
  open: boolean;
  onClose: VoidFunction;
  title: string;
  children: ReactNode;
}

export default function FormDialog<T>({
  open,
  onClose,
  title,
  children,
  ...formProps
}: DialogProps<T>) {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      disableEnforceFocus
    >
      <DialogTitle>{title}</DialogTitle>
      <Box sx={{ p: 3 }}>
        <FormHolder {...formProps} hideCard>
          {children}
        </FormHolder>
      </Box>
    </Dialog>
  );
}
