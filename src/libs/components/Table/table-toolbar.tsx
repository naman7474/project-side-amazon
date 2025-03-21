import { ReactNode } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import Iconify from "@/libs/components/Iconify";

export default function TableToolbar({
  numSelected,
  search,
  handleSearch,
  searchFields,
  showFilters,
  createText,
  createLink,
  onCreateClick,
  FilterComponent,
}: {
  numSelected: number;
  search: string;
  handleSearch: (
    ev: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  showFilters?: boolean;
  createText?: string;
  createLink?: string;
  onCreateClick?: VoidFunction;
  searchFields?: Array<string>;
  FilterComponent?: ReactNode;
}) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: "flex",
        justifyContent: "space-between",
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box>
          {!!searchFields?.length && (
            <OutlinedInput
              value={search}
              onChange={handleSearch}
              placeholder="Search..."
              startAdornment={
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: "text.disabled", width: 20, height: 20 }}
                  />
                </InputAdornment>
              }
            />
          )}
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Stack sx={{ ml: 2 }}>
          {showFilters && (
            <Tooltip title="Filter list">
              <IconButton>
                <Iconify icon="ic:round-filter-list" />
              </IconButton>
            </Tooltip>
          )}
          {(createLink || onCreateClick) && (
            <Button
              href={createLink}
              onClick={onCreateClick}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {createText}
            </Button>
          )}
          {FilterComponent}
        </Stack>
      )}
    </Toolbar>
  );
}
