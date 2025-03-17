"use client";

import { ReactNode } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LoadingScreen from "@/libs/components/LoadingScreen";

export default function PageView({
  heading,
  isLoading,
  children,
  actions,
}: {
  heading: string;
  isLoading?: boolean;
  children: ReactNode;
  actions?: ReactNode;
}) {
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth={false}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ mb: 4 }}
      >
        <Box sx={{ flexGrow: 1, mb: 1 }}>
          {heading && <Typography variant="h2">{heading}</Typography>}
        </Box>
        {actions && <Box>{actions}</Box>}
      </Stack>
      {children}
    </Container>
  );
}
