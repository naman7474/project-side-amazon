import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import TableCell from "@mui/material/TableCell";

export default function UserTableCell({
  name,
  description,
  image,
  onClick,
}: {
  name: string;
  description?: string;
  image?: string;
  onClick?: VoidFunction;
}) {
  return (
    <TableCell onClick={onClick}>
      <Stack direction="row" alignItems="center">
        <Avatar alt={name} src={image} sx={{ mr: 2 }} />
        <ListItemText
          primary={name}
          secondary={description || ""}
          primaryTypographyProps={{ typography: "body2" }}
          secondaryTypographyProps={{
            component: "span",
            color: "text.disabled",
          }}
        />
      </Stack>
    </TableCell>
  );
}
