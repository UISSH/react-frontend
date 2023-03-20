import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useContext, useEffect } from "react";
import CardDialog from "../CardDialog";
import CloseIcon from "@mui/icons-material/Close";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { useSnackbar } from "notistack";
import { GlobalLoadingAtom } from "../../store/recoilStore";

import { requestData } from "../../requests/http";
import { ReloadTableDataContext } from "./ExplorerContext";

export interface RenameFSDialogProps {
  name: string;
  open: boolean;
  currentPath: string;
  onStatus: (result: "done" | "cancel") => void;
  children?: React.ReactNode;
  className?: string;
}
interface IFormInput {
  name: string;
}

export default function RenameFSDialog(props: RenameFSDialogProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const onReloadTableData = useContext(ReloadTableDataContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setGlobalLoadingAtom(true);
    // rename file or folder
    let cmd = "mv " + props.name + " " + data.name;
    requestData({
      url: "/api/FileBrowser/cmd/",
      method: "POST",
      data: {
        current_directory: props.currentPath,
        operation_command: cmd,
      },
    }).then((res) => {
      if (res.ok) {
        enqueueSnackbar(t("success"), { variant: "success" });
        onReloadTableData();
        props.onStatus("done");
      } else {
        props.onStatus("cancel");
        enqueueSnackbar(t("failed"), { variant: "error" });
      }
      setGlobalLoadingAtom(false);
    });
  };
  return (
    <>
      <CardDialog
        disableEscapeKeyDown
        open={props.open}
        onClose={() => props.onStatus("cancel")}>
        <DialogTitle
          bgcolor={(theme) => theme.palette.primary.main}
          color={(theme) => theme.palette.text.disabled}>
          <div className="flex justify-between  items-center">
            <div>{t("exploprer.rename") + " " + props.name}</div>
            <IconButton
              color="inherit"
              onClick={() => props.onStatus("cancel")}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="grid gap-2">
            <TextField
              {...register("name", {
                required: true,
                pattern: {
                  // linux file name rule
                  value: /^[a-zA-Z0-9_\-\.]+$/,
                  message: t("Invalid name"),
                },
              })}
              size="small"
              required
              error={errors.name ? true : false}
              helperText={errors.name?.message}
              label={t("common.name")}></TextField>
          </DialogContent>

          <DialogActions>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => props.onStatus("cancel")}>
              {t("cancel")}
            </Button>
            <Button variant="contained" type="submit">
              {t("ok")}
            </Button>
          </DialogActions>
        </form>
      </CardDialog>
    </>
  );
}
