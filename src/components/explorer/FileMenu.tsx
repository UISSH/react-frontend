import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { requestData } from "../../requests/http";
import { getApiGateway } from "../../requests/utils";
import {
  GlobalLoadingAtom,
  UpdateExplorerTableUISignalAtom,
} from "../../store/recoilStore";
import RenameFSDialog from "./RenameFSDialog";
export interface FileMenuProps {
  path: string;
  directory: string;
  name: string;
}

function DeleteFile(
  props: FileMenuProps & { open: boolean; onClose: () => void }
) {
  const [updateState, setUpdateState] = useRecoilState(
    UpdateExplorerTableUISignalAtom
  );

  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const handleClose = () => {
    props.onClose();
  };

  const handelDelete = async () => {
    setGlobalLoadingAtom(true);
    let res = await requestData({
      url: "FileBrowserCmd",
      method: "POST",
      data: {
        current_directory: props.directory,
        operation_command: `rm '${props.name}'`,
      },
    });
    setGlobalLoadingAtom(false);
    if (res.ok) {
      enqueueSnackbar(t("delete_success"), {
        variant: "success",
      });
      setUpdateState((s) => s + 1);
      handleClose();
    } else {
      enqueueSnackbar(t("delete_fail"), {
        variant: "error",
      });
    }
  };
  return (
    <div>
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle>
          <span className="capitalize"> {t("common.delete")}</span> {props.name}
        </DialogTitle>
        <DialogContent>
          <div className="pt-2">
            {t("Are you sure you want to delete this file?")}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handelDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function Index(props: FileMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openRename, setOpenRename] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/dash/editor/`, {
      state: {
        type: "vim",
        path: props.path,
      },
    });
  };
  const handleDownload = async () => {
    let res = await requestData({
      url: "/api/FileBrowser/request_download_file/",
      params: {
        path: props.path,
      },
    });
    let resJson = await res.json();

    let donwloadUrl = `${getApiGateway()}/api/FileBrowser/download_file/?path=${
      props.path
    }&token=${resJson.msg}`;
    window.location.href = donwloadUrl;
    setAnchorEl(null);
  };

  const handleRename = () => {
    setAnchorEl(null);
    setOpenRename(true);
  };

  const RenameFSDialogCache = React.useMemo(
    () => (
      <RenameFSDialog
        currentPath={props.directory}
        name={props.name}
        open={openRename}
        onStatus={(status) => {
          setOpenRename(false);
        }}></RenameFSDialog>
    ),
    [openRename, props.directory, props.name]
  );

  return (
    <div>
      {RenameFSDialogCache}
      <DeleteFile
        {...props}
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}></DeleteFile>
      <IconButton
        id={props.path + "-positioned-button"}
        aria-controls={open ? props.path + "-positioned-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        aria-expanded={open ? "true" : undefined}>
        <MoreHorizIcon />
      </IconButton>

      <Menu
        sx={{ "& .MuiList-padding": { paddingTop: 0, paddingBottom: 0 } }}
        id={props.path + "-positioned-menu"}
        aria-labelledby={props.path + "-positioned-button"}
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
        <MenuItem className=" capitalize" onClick={handleEdit}>
          {t("exploprer.edit")}
        </MenuItem>
        <MenuItem className=" capitalize" onClick={handleDownload}>
          {t("exploprer.download")}
        </MenuItem>
        <MenuItem className="capitalize" onClick={handleRename}>
          {t("exploprer.rename")}
        </MenuItem>
        <MenuItem
          className=" capitalize bg-red-500 text-white hover:text-black"
          onClick={() => {
            setAnchorEl(null);
            setOpenDelete(true);
          }}>
          {t("exploprer.delete")}
        </MenuItem>
      </Menu>
    </div>
  );
}
