import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
export default function Index(props: { key: string }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDownload = () => {};

  return (
    <div>
      <IconButton
        id={props.key + "-positioned-button"}
        aria-controls={open ? props.key + "-positioned-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        aria-expanded={open ? "true" : undefined}>
        <MenuIcon />
      </IconButton>

      <Menu
        id={props.key + "-positioned-menu"}
        aria-labelledby={props.key + "-positioned-button"}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}>
        <MenuItem onClick={handleDownload}>Download</MenuItem>
        <MenuItem onClick={handleDownload}>Download</MenuItem>
        <MenuItem onClick={handleDownload}>Download</MenuItem>
      </Menu>
    </div>
  );
}
