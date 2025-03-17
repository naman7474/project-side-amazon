import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import { RouterLink } from "../routes/components";

const Logo = ({
  disabledLink = false,
  sx,
  src,
  width,
  height,
}: {
  disabledLink?: boolean;
  sx?: Record<string, any>;
  src?: string;
  width?: number | string;
  height?: number | string;
}) => {
  const logo = (
    <Box
      component="img"
      src={src || "/assets/logo.webp"}
      sx={{
        width: width || 40,
        height: height || 40,
        cursor: "pointer",
        ...sx,
      }}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: "contents" }}>
      {logo}
    </Link>
  );
};

export default Logo;
