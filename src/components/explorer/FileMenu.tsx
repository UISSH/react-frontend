import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton } from "@mui/material";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
export default function Index(props: { id: string | number; name?: string }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const handleDownload = () => {};

  return (
    <div>
      <IconButton
        id={props.id + "-positioned-button"}
        aria-controls={open ? props.id + "-positioned-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        aria-expanded={open ? "true" : undefined}>
        <MoreHorizIcon />
      </IconButton>

      <Menu
        className="p-0 m-0"
        sx={{ "& .MuiList-padding": { paddingTop: 0 } }}
        id={props.id + "-positioned-menu"}
        aria-labelledby={props.id + "-positioned-button"}
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
        {props.name && (
          <div
            className="w-full h-full p-2 bg-slate-300 text-center "
            color="primary">
            {props.name}{" "}
          </div>
        )}
        <MenuItem onClick={handleDownload}>Download</MenuItem>
      </Menu>
    </div>
  );
}
