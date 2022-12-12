import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { fetchData, requestData } from "../../requests/http";
import { getApiGateway } from "../../requests/utils";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { UpdateExplorerTableUISignal } from "./ExplorerTable";
import EditIcon from "@mui/icons-material/Edit";
export interface FileMenuProps {
  id: string | number;
  path: string;
  directory: string;
  name?: string;
}

function DeleteFile(
  props: FileMenuProps & { open: boolean; onClose: () => void }
) {
  const [updateState, setUpdateState] = useRecoilState(
    UpdateExplorerTableUISignal
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
          <span className="capitalize"> {t("delete")}</span> {props.name}
        </DialogTitle>
        <DialogContent>
          <div className="pt-2">
            t("Are you sure you want to delete this file?")
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

function RenameFile(
  props: FileMenuProps & { open: boolean; onClose: () => void }
) {
  const [newName, setNewName] = React.useState(props.name);
  const [updateState, setUpdateState] = useRecoilState(
    UpdateExplorerTableUISignal
  );

  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const handleClose = () => {
    props.onClose();
  };

  const handelRename = async () => {
    setGlobalLoadingAtom(true);
    let res = await requestData({
      url: "FileBrowserCmd",
      method: "POST",
      data: {
        current_directory: props.directory,
        operation_command: `mv ${props.name} ${newName}`,
      },
    });
    setGlobalLoadingAtom(false);
    if (res.ok) {
      enqueueSnackbar(t("renameSuccess"), { variant: "success" });
    } else {
      enqueueSnackbar(t("renameFailed"), { variant: "error" });
    }
    setUpdateState((s) => s + 1);
    props.onClose();
  };
  return (
    <div>
      <Dialog open={props.open} onClose={handleClose}>
        <DialogTitle>
          <span>{t("exploprer.rename")}</span> {props.name}
        </DialogTitle>
        <DialogContent>
          <div className="pt-2">
            <TextField
              id="outlined-basic"
              label="name"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handelRename}>Rename</Button>
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
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const handleRenameClose = () => {
    setOpenRename(false);
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

  return (
    <div>
      <RenameFile
        {...props}
        open={openRename}
        onClose={handleRenameClose}></RenameFile>
      <DeleteFile
        {...props}
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
        }}></DeleteFile>
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
        sx={{ "& .MuiList-padding": { paddingTop: 0, paddingBottom: 0 } }}
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
            {props.name}
          </div>
        )}
        <MenuItem className=" capitalize" onClick={handleDownload}>
          <EditIcon className="mr-2" />
          {t("exploprer.edit")}
        </MenuItem>
        <MenuItem className=" capitalize" onClick={handleDownload}>
          <FileDownloadIcon className="mr-2" />
          {t("exploprer.download")}
        </MenuItem>
        <MenuItem className="capitalize" onClick={handleRename}>
          <DriveFileRenameOutlineIcon className="mr-2" />
          {t("exploprer.rename")}
        </MenuItem>
        <MenuItem
          className=" capitalize bg-red-500 text-white hover:text-black"
          onClick={() => {
            setAnchorEl(null);
            setOpenDelete(true);
          }}>
          <DeleteIcon className="mr-2" />
          {t("exploprer.delete")}
        </MenuItem>
      </Menu>
    </div>
  );
}
