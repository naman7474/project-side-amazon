import { memo, forwardRef, ReactNode } from "react";

import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";

import { StyledRootScrollbar, StyledScrollbar } from "./styles";

const Scrollbar = forwardRef<
  HTMLDivElement,
  {
    children?: ReactNode;
    sx?: SxProps<Theme>;
  }
>(({ children, sx, ...other }, ref) => {
  const userAgent =
    typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  if (isMobile) {
    return (
      <Box ref={ref} sx={{ overflow: "auto", ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <StyledRootScrollbar>
      <StyledScrollbar
        scrollableNodeProps={{
          ref,
        }}
        clickOnTrack={false}
        sx={sx}
        {...other}
      >
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
});

Scrollbar.displayName = "Scrollbar";
export default memo(Scrollbar);
