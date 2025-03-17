"use client";

import { ReactNode, useState } from "react";

import Box from "@mui/material/Box";

import Header from "./header";
import Main from "./main";
import Nav from "./nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>
    </>
  );
}
