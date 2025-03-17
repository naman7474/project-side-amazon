import { ReactNode } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";

import { bgGradient } from "@/libs/theme/css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
            textAlign: "center",
            overflow: "scroll",
          }}
        >
          {children}
        </Card>
      </Stack>
    </Box>
  );
}
