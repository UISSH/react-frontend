import BrowserUpdatedOutlinedIcon from "@mui/icons-material/BrowserUpdatedOutlined";
import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { requestData } from "../requests/http";
import { GlobalLoadingAtom } from "../store/recoilStore";

interface VersionProps {
  children?: React.ReactNode;
  className?: string;
}

interface DialogUpdateProps {
  open: boolean;
  version: string;
  onClose?: () => void;
}
export function DialogUpdate(props: DialogUpdateProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const handleUpgrade = async () => {
    setGlobalLoadingAtom(true);
    let msg = `Updating ..., please wait a moment`;
    enqueueSnackbar(msg, {
      key: "update",
      variant: "info",
      persist: true,
    });

    setTimeout(() => {
      requestData({
        method: "POST",
        url: "/api/version/",
      });
    }, 1000);

    let intervalID = setInterval(async () => {
      let res = await requestData({
        method: "GET",
        url: "/api/version/",
      });
      let resJson = await res.json();
      if (!resJson.can_updated) {
        clearInterval(intervalID);
        setGlobalLoadingAtom(false);
        closeSnackbar("update");
        enqueueSnackbar("Update successfully", { variant: "success" });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }, 15000);

    props.onClose && props.onClose();
  };

  return (
    <Dialog onClose={props.onClose} open={props.open}>
      <DialogTitle>Update</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className="mt-2">
          New version {props.version} is available. Please upgrade to enjoy the
          latest features and improvements.
        </DialogContentText>
        <DialogContentText
          id="alert-dialog-description"
          className="mt-2 text-right">
          visit the{" "}
          <Button
            type="a"
            target="_blank"
            href={`https://github.com/UISSH/backend/releases/tag/${props.version}`}>
            Changelog
          </Button>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUpgrade}>Upgrade</Button>
        <Button onClick={props.onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function Version(props: VersionProps) {
  const version = JSON.parse(
    sessionStorage.getItem("version") || '{"can_updated":false}'
  );

  const [open, setOpen] = useState(false);
  if (version && version.can_updated) {
    return (
      <>
        <DialogUpdate
          open={open}
          version={version.latest_version}
          onClose={() => {
            setOpen(false);
          }}></DialogUpdate>
        <Tooltip title="New version is available">
          <Badge color="info" variant="dot">
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setOpen(true)}>
              <BrowserUpdatedOutlinedIcon></BrowserUpdatedOutlinedIcon>
            </IconButton>
          </Badge>
        </Tooltip>
      </>
    );
  } else {
    return <>{props.children}</>;
  }
}
