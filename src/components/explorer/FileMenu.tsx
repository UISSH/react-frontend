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

export interface FileMenuProps {
  id: string | number;
  path: string;
  directory: string;
  name?: string;
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
        <DialogTitle>Rename {props.name}</DialogTitle>
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
        <MenuItem onClick={handleDownload}>Download</MenuItem>
        <MenuItem onClick={handleRename}>Rename</MenuItem>
      </Menu>
    </div>
  );
}
