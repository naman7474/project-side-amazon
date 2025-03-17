import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import Iconify from "../Iconify";
import Image from "../Image";
import { UploadProps } from "./types";

export default function Upload({
  placeholder,
  error,
  disabled,
  sx,
  file,
  onDelete,
  loading,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      disabled,
      ...other,
    });

  const onFileDelete = useCallback(
    (ev: any) => {
      if (onDelete) {
        ev.preventDefault();
        ev.stopPropagation();
        onDelete();
      }
    },
    [onDelete]
  );

  const hasError = isDragReject || error;

  return (
    <Box
      {...getRootProps()}
      sx={{
        m: 0.5,
        width: 240,
        height: 80,
        flexShrink: 0,
        display: "flex",
        borderRadius: 1,
        cursor: "pointer",
        alignItems: "center",
        color: "text.disabled",
        justifyContent: "center",
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        border: (theme) => `dashed 1px ${alpha(theme.palette.grey[500], 0.16)}`,
        ...(isDragActive && {
          opacity: 0.72,
        }),
        ...(disabled && {
          opacity: 0.48,
          pointerEvents: "none",
        }),
        ...(hasError && {
          color: "error.main",
          bgcolor: "error.lighter",
          borderColor: "error.light",
        }),
        "&:hover": {
          opacity: 0.72,
        },
        ...sx,
      }}
    >
      {loading ? (
        <Stack spacing={1} alignItems="center">
          <CircularProgress size={20} />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Uploading...
          </Typography>
        </Stack>
      ) : (
        <>
          {file ? (
            <Box
              sx={{
                position: "relative",
                width: 1,
                height: 1,
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <Image
                alt="file preview"
                src={typeof file === "string" ? file : file?.preview || ""}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
              <IconButton
                size="small"
                onClick={onFileDelete}
                sx={{
                  top: 4,
                  right: 4,
                  zIndex: 9,
                  position: "absolute",
                  color: (theme) => alpha(theme.palette.common.white, 0.8),
                  bgcolor: (theme) => alpha(theme.palette.grey[700], 0.72),
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.grey[800], 0.48),
                  },
                }}
              >
                <Iconify icon="mingcute:close-line" width={12} />
              </IconButton>
            </Box>
          ) : (
            <>
              <input {...getInputProps()} />
              {placeholder || (
                <Iconify
                  icon="material-symbols:upload-file-outline"
                  width={50}
                />
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
}
