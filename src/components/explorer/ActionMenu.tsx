import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { useTranslation } from "react-i18next";
import FileNameDialog from "./NewFSDialog";
export interface ExplorerTableProps {
  currentPath?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function NewActionMenu(props: ExplorerTableProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const [fileNameDialogStatus, setFileNameDialogStatus] = React.useState({
    open: false,
    action: "create" as "create" | "rename",
    fileType: "file" as "file" | "folder",
  });
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickMenu = (action: string) => {
    if (action === "newFile") {
      setFileNameDialogStatus({
        open: true,
        action: "create",
        fileType: "file",
      });
    } else {
      setFileNameDialogStatus({
        open: true,
        action: "create",
        fileType: "folder",
      });
    }
    setAnchorEl(null);
  };
  if (props.currentPath === undefined) return <></>;

  return (
    <div>
      <FileNameDialog
        currentPath={props.currentPath}
        onStatus={(status) => {
          setFileNameDialogStatus({ ...fileNameDialogStatus, open: false });
        }}
        {...fileNameDialogStatus}></FileNameDialog>

      <IconButton
        className="h-full"
        id="basic-button"
        color="primary"
        aria-haspopup="true"
        aria-controls={open ? "basic-menu" : undefined}
        onClick={handleClick}>
        <AddIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}>
        <MenuItem
          className="capitalize"
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            handleClickMenu("newFile");
          }}>
          {t("common.file")}
        </MenuItem>
        <MenuItem
          className="capitalize"
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            handleClickMenu("newFolder");
          }}>
          {t("common.folder")}
        </MenuItem>
      </Menu>
    </div>
  );
}
