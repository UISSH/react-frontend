import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Input,
  Switch,
  TextField,
} from "@mui/material";

import KeyIcon from "@mui/icons-material/Key";
import { t } from "i18next";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrorsImpl,
  FieldValues,
  SubmitHandler,
  UseControllerProps,
  useForm,
} from "react-hook-form";

import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import CardDialog from "../CardDialog";

export interface PostHostProps {
  children?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
}
interface IFormInput {
  name: string;
  username: string;
  hostname: string;
  port: number;
  password: string;
  private_key: string;
  private_key_password: string;
}

export default function PostHost(props: PostHostProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const [open, setOpen] = useState(props.open);

  const [enableKeysLogin, setEnableKeysLogin] = useState(false);

  const handleClose = () => {
    setOpen(false);
    props.onClose && props.onClose();
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    alert(JSON.stringify(data));
  };

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <>
      <CardDialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>{t("Post Host")}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className=" gap-4 grid ">
            <TextField
              {...register("name")}
              label={"name"}
              defaultValue={"localhost"}
              fullWidth
              size="small"
            />
            <div className="flex flex-nowrap content-center items-center gap-1">
              <TextField
                {...register("username")}
                defaultValue={"root"}
                label={"username"}
                size="small"
              />
              @
              <TextField
                {...register("hostname")}
                label={"hostname"}
                defaultValue={"localhost"}
                fullWidth
                size="small"
              />
              :
              <TextField
                {...register("port")}
                defaultValue={22}
                type="number"
                label={"port"}
                size="small"
              />
            </div>
            <div>
              {enableKeysLogin ? (
                <div className="flex justify-between gap-4">
                  <TextField
                    {...register("private_key_password")}
                    label={"key password"}
                    type="password"
                    size="small"
                    fullWidth
                    autoComplete="new-password"></TextField>
                  <IconButton component="label">
                    <KeyIcon></KeyIcon>
                    <input type="file" hidden />
                  </IconButton>
                </div>
              ) : (
                <TextField
                  {...register("password")}
                  label={"password"}
                  type="password"
                  size="small"
                  fullWidth
                  autoComplete="new-password"></TextField>
              )}
            </div>
            <div className="flex justify-end">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      value={enableKeysLogin}
                      onChange={(e) => setEnableKeysLogin(e.target.checked)}
                    />
                  }
                  label="Enable Keys Login"
                />
              </FormGroup>
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="inherit" variant="contained">
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
