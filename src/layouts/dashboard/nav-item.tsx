import { ReactNode, useCallback, useState } from "react";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";

import Iconify from "@/libs/components/Iconify";
import { useResponsive } from "@/libs/hooks/use-responsive";
import { RouterLink } from "@/libs/routes/components";
import { usePathname, useRouter } from "@/libs/routes/hooks";

const NavSubItem = ({
  path,
  title,
  handlePopoverClose,
}: {
  path: string;
  title: string;
  handlePopoverClose?: VoidFunction;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const upLg = useResponsive("up", "lg");

  const onClick = useCallback(() => {
    router.push(path);
    if (handlePopoverClose) {
      handlePopoverClose();
    }
  }, [handlePopoverClose, path, router]);

  const active = path === pathname;
  return (
    <ListItemButton
      key={path}
      href={path}
      onClick={onClick}
      sx={{
        fontSize: "body2.fontSize",
        display: "flex",
        alignItems: "center",
        color: "text.secondary",
        ...(active && {
          color: "primary.main",
        }),
      }}
    >
      {!upLg && (
        <Box component="span" sx={{ width: 20, height: 20, mr: 2 }}>
          {active && <Iconify icon="radix-icons:dot-filled" />}
        </Box>
      )}
      <Box component="span">{title}</Box>
    </ListItemButton>
  );
};

export default function NavItem({
  item,
}: {
  item: {
    path: string;
    icon: ReactNode;
    title: string;
    items?: Array<{ path: string; title: string }>;
  };
}) {
  const pathname = usePathname();

  const upLg = useResponsive("up", "lg");

  const [openPopover, setOpenPopover] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState<boolean>(false);

  const handlePopoverClose = () => {
    setOpenPopover(null);
  };

  const handleSubmenuClick = useCallback(
    (ev: any) => {
      if (upLg) {
        setOpenPopover(ev.currentTarget);
      } else {
        setOpenSubmenu(!openSubmenu);
      }
    },
    [openSubmenu, upLg]
  );

  const active = item.path === pathname;

  return (
    <>
      <ListItemButton
        onClick={handleSubmenuClick}
        component={item?.items?.length ? Box : RouterLink}
        href={item.path}
        sx={{
          px: { lg: 1 },
          display: "flex",
          justifyContent: "space-between",
          minHeight: 44,
          borderRadius: 0.75,
          typography: "body2",
          color: "text.secondary",
          textTransform: "capitalize",
          fontWeight: "fontWeightMedium",
          position: "relative",
          ...(active && {
            color: "primary.main",
            fontWeight: "fontWeightSemiBold",
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
            },
          }),
        }}
      >
        <Stack
          direction={upLg ? "column" : "row"}
          sx={{ alignItems: { lg: "center" }, flex: { lg: 1 } }}
        >
          <Box
            component="span"
            sx={{ width: 24, height: 24, mr: { xs: 2, lg: 0 } }}
          >
            {item.icon}
          </Box>
          <Box
            component="span"
            sx={{ fontSize: { lg: 10 }, textAlign: { lg: "center" } }}
          >
            {item.title}
          </Box>
        </Stack>

        {item?.items?.length && (
          <>
            {upLg ? (
              <Iconify
                sx={{ position: "absolute", right: 1 }}
                icon="icon-park-outline:right"
              />
            ) : (
              <Iconify
                icon={
                  openSubmenu
                    ? "icon-park-outline:up"
                    : "icon-park-outline:down"
                }
              />
            )}
          </>
        )}
      </ListItemButton>
      {upLg ? (
        <Popover
          open={!!openPopover}
          anchorEl={openPopover}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "center", horizontal: "right" }}
          transformOrigin={{ vertical: "center", horizontal: "left" }}
          PaperProps={{
            sx: {
              p: 0,
              mt: 1,
              ml: 0.75,
              minWidth: 100,
            },
          }}
        >
          {item.items?.map((subItem) => (
            <NavSubItem
              key={subItem.path}
              path={subItem.path}
              title={subItem.title}
              handlePopoverClose={handlePopoverClose}
            />
          ))}
        </Popover>
      ) : (
        <Collapse in={openSubmenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.items?.map((subItem) => (
              <NavSubItem
                key={subItem.path}
                path={subItem.path}
                title={subItem.title}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}
