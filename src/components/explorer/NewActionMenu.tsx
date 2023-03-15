import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { useTranslation } from "react-i18next";
import FileNameDialog from "./FileNameDialog";
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
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [fileNameDialogOpen, setFileNameDialogOpen] = React.useState(false);
  const [fileNameDialogStatus, setFileNameDialogStatus] = React.useState({
    open: false,
    action: "create" as "create" | "rename",
    fileType: "file" as "file" | "folder",
  });
  const handleClose = (action: string) => {
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
      <Button
        className="h-full"
        variant="contained"
        id="basic-button"
        startIcon={<AddIcon />}
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}>
        {t("exploprer.add")}
      </Button>
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
            handleClose("newFile");
          }}>
          {t("common.file")}
        </MenuItem>
        <MenuItem
          className="capitalize"
          onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
            handleClose("newFolder");
          }}>
          {t("common.folder")}
        </MenuItem>
      </Menu>
    </div>
  );
}
