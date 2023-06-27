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
import { PureFunctionContext } from "../../Context";

export interface FileNameDialogProps {
  name?: string;
  open: boolean;
  fileType: "file" | "folder";
  currentPath: string;
  action: "create" | "rename";
  onStatus: (result: "done" | "cancel") => void;
  children?: React.ReactNode;
  className?: string;
}

interface IFormInput {
  name: string;
  newName?: string;
}

export default function FileNameDialog(props: FileNameDialogProps) {
  useEffect(() => {}, [open]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const actionText = props.action === "create" ? "new" : "rename";
  const fileTypeText = props.fileType === "file" ? "file" : "folder";
  const nameText = props.name ? props.name : fileTypeText;
  const onReloadTableData = useContext(PureFunctionContext);
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    createNew(data.name);
  };

  const createNew = (name: string) => {
    let cmd = props.fileType === "file" ? "touch" : "mkdir";
    cmd += " " + name;
    setGlobalLoadingAtom(true);
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
        onClose={() => props.onStatus("cancel")}
      >
        <DialogTitle
          bgcolor={(theme) => theme.palette.primary.main}
          color={(theme) => theme.palette.text.disabled}
        >
          <div className="flex justify-between  items-center">
            <div className="capitalize">
              {t("exploprer." + actionText) + t("common." + nameText)}
            </div>
            <IconButton
              color="inherit"
              onClick={() => props.onStatus("cancel")}
            >
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
              label={t("common.name")}
            ></TextField>
          </DialogContent>

          <DialogActions>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => props.onStatus("cancel")}
            >
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
