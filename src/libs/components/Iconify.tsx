import { Icon, IconifyIcon } from "@iconify/react";
import { ForwardedRef, forwardRef } from "react";

import Box, { BoxProps } from "@mui/material/Box";

interface Props extends BoxProps {
  icon: IconifyIcon | string;
}

// eslint-disable-next-line react/display-name
const Iconify = forwardRef(
  ({ icon, width = 20, sx, ...other }: Props, ref: ForwardedRef<any>) => (
    <Box
      ref={ref}
      component={Icon}
      className="component-iconify"
      icon={icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
  )
);

export default Iconify;
