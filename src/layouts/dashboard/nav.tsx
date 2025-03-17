import { useEffect } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import Logo from "@/libs/components/Logo";
import Scrollbar from "@/libs/components/Scrollbar";
import { useResponsive } from "@/libs/hooks/use-responsive";
import { usePathname } from "@/libs/routes/hooks";

import { useAuth } from "@/auth/auth-context";
import { IAdminType } from "@/models/user";

import { NAV } from "./config-layout";
import getAdminNavConfig from "./config-navigation";
import NavItem from "./nav-item";

export default function Nav({
  openNav,
  onCloseNav,
}: {
  openNav: boolean;
  onCloseNav: VoidFunction;
}) {
  const { user } = useAuth();

  const theme = useTheme();

  const pathname = usePathname();

  const upLg = useResponsive("up", "lg");

  const navConfig = getAdminNavConfig(user?.role || IAdminType.Admin);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderMenu = (
    <Stack
      component="nav"
      spacing={0.5}
      sx={{
        px: {
          xs: 2,
          lg: 1,
        },
        pt: 6,
      }}
    >
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
        "& .simplebar-placeholder": {
          display: "none",
        },
      }}
    >
      <Logo
        width={upLg ? 100 : "60%"}
        height="auto"
        sx={{ mt: 3, px: { xs: 4, lg: 2 } }}
      />

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH_COLLAPSED },
        background: theme.palette.grey[200],
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.WIDTH_COLLAPSED,
            borderRight: `solid 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
