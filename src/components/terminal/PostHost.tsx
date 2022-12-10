import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";

import KeyIcon from "@mui/icons-material/Key";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import CardDialog from "../CardDialog";
import { HostAuth } from "./TerminalSession";

export interface PostHostProps {
  children?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  onAdd?: (name: string, hostAuth: HostAuth) => void;
}
interface IFormInput {
  name: string;
  username: string;
  hostname: string;
  port: number;
  password: string;
  private_key: string;
  private_key_password: string;
  private_key_file: File[] | undefined;
}

export default function PostHost(props: PostHostProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const [enableKeysLogin, setEnableKeysLogin] = useState(false);

  const watchPrivateKeyFile = watch("private_key_file", undefined);

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data.private_key_file);
    // read file
    if (data.private_key_file && data.private_key_file.length > 0) {
      // read file
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(e.target?.result);
        let propsData = {
          username: data.username,
          hostname: data.hostname,
          port: data.port,
          password: data.password ? data.password : "",
          private_key: e.target?.result as string,
          private_key_password: data.private_key_password,
        };
        console.log(propsData);
        props.onAdd && props.onAdd(data.name, propsData);
      };
      reader.readAsText(data.private_key_file[0]);
    }
  };

  useEffect(() => {
    reset();
  }, [props.open]);

  return (
    <>
      <CardDialog disableEscapeKeyDown open={props.open} onClose={handleClose}>
        <DialogTitle>{t("Post Host")}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className=" gap-4 grid ">
            <TextField
              {...register("name", { required: true })}
              label={"name"}
              defaultValue={"localhost"}
              fullWidth
              size="small"
            />
            <div className="flex flex-nowrap content-center items-center gap-1">
              <TextField
                {...register("username", { required: true })}
                defaultValue={"root"}
                label={"username"}
                size="small"
              />
              @
              <Tooltip
                open={!!errors.hostname}
                title={errors.hostname?.message}>
                <TextField
                  {...register("hostname", {
                    required: true,
                    pattern: {
                      value:
                        /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/gm,
                      message: "hostname must be a valid hostname",
                    },
                  })}
                  label={"hostname"}
                  defaultValue={"localhost"}
                  fullWidth
                  error={!!errors.hostname}
                  size="small"
                />
              </Tooltip>
              :
              <Tooltip open={!!errors.port} title={errors.port?.message}>
                <TextField
                  {...register("port", {
                    required: {
                      value: true,
                      message: "port is required",
                    },
                    min: {
                      value: 1,
                      message: "port must be greater than 1",
                    },
                    max: {
                      value: 65535,
                      message: "port must be less than 65535",
                    },
                  })}
                  defaultValue={22}
                  type="number"
                  label={"port"}
                  size="small"
                  error={!!errors.port}
                />
              </Tooltip>
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
                    <Tooltip
                      open={!!errors.private_key_file}
                      title={errors.private_key_file?.message}>
                      <KeyIcon
                        color={
                          !!errors.private_key_file
                            ? "error"
                            : watchPrivateKeyFile
                            ? "primary"
                            : "inherit"
                        }></KeyIcon>
                    </Tooltip>
                    <input
                      {...register("private_key_file", {
                        required: {
                          value: enableKeysLogin,
                          message: "private key file is required",
                        },
                      })}
                      type="file"
                      hidden
                    />
                  </IconButton>
                </div>
              ) : (
                <Tooltip
                  open={!!errors.password}
                  title={errors.password?.message}>
                  <TextField
                    {...register("password", {
                      required: {
                        value: !enableKeysLogin,
                        message: "password is required",
                      },
                    })}
                    defaultValue={""}
                    error={!!errors.password}
                    label={"password"}
                    type="password"
                    size="small"
                    fullWidth
                    autoComplete="new-password"></TextField>
                </Tooltip>
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
            <Button
              color="warning"
              variant="contained"
              onClick={() => {
                props.onClose && props.onClose();
              }}>
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
