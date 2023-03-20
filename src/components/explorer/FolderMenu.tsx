import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import RenameFSDialog from "./RenameFSDialog";

export interface FolderMenuProps {
  id: string | number;
  path: string;
  directory: string;
  name: string;
  className?: string;
}

export default function FolderMenu(props: FolderMenuProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const [openRename, setOpenRename] = React.useState(false);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const handleRename = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation();
    setAnchorEl(null);
    setOpenRename(true);
  };

  return (
    <div>
      <RenameFSDialog
        currentPath={props.directory}
        name={props.name}
        open={openRename}
        onStatus={(status) => {
          setOpenRename(false);
        }}></RenameFSDialog>
      <IconButton
        id={props.id + "-positioned-button"}
        aria-controls={open ? props.id + "-positioned-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        aria-expanded={open ? "true" : undefined}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        sx={{ "& .MuiList-padding": { paddingTop: 0, paddingBottom: 0 } }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "folder-button",
        }}>
        {props.name && (
          <Box
            className="w-full h-full p-2 pl-4 "
            sx={{
              minWidth: "100px",
              color: (theme) => theme.palette.secondary.contrastText,
              backgroundColor: (theme) => {
                return theme.palette.secondary.main;
              },
            }}>
            {props.name}
          </Box>
        )}
        <MenuItem onClick={handleRename}>{t("exploprer.rename")}</MenuItem>
      </Menu>
    </div>
  );
}
