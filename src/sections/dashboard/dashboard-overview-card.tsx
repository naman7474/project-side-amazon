import { useCallback } from "react";

import Box from "@mui/material/Box";
import Card, { CardProps } from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import SvgColor from "@/libs/components/SvgColor";
import { useRouter } from "@/libs/routes/hooks";

interface Props extends CardProps {
  title: string;
  total: string;
  color: string;
  icon?: string;
  link?: string;
}

export default function DashboardOverviewCard({
  title,
  total,
  color,
  icon,
  link,
  sx,
  ...other
}: Props) {
  const router = useRouter();

  const onCardClick = useCallback(() => {
    if (link) {
      router.push(link);
    }
  }, [link, router]);

  return (
    <Card
      onClick={onCardClick}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 3,
        cursor: link ? "pointer" : "initial",
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" mb={2}>
          {title}
        </Typography>

        <Typography variant="h3" color={color}>
          {total}
        </Typography>
      </Box>
      <Box sx={{ pr: 2, pt: 2 }}>
        {!!icon && (
          <SvgColor
            src={`/assets/icons/navbar/${icon}.svg`}
            sx={{ width: 48, height: 48 }}
          />
        )}
      </Box>
    </Card>
  );
}
