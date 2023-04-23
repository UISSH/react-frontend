import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { requestData } from "../../requests/http";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import CardDialog from "../CardDialog";
import S3Params from "./S3Params";

export interface AddProps {
  children?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  onOk?: () => void;
}
interface IFormInput {
  username: string;
  password: string;
  basePath?: string;
}
const defaultValues = {
  s3: {
    // endpoint: "https://s3.amazonaws.com",
    // region: "eu-west-1",
    bucket: " ",
    access_key_id: " ",
    secret_access_key: " ",
    // disable_ssl: "false",
    // path_style: "false",
  },
  os: {
    basePath: "/tmp",
  },
};

export default function PostHost(props: AddProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const [fileSystemType, setFileSystemType] = useState<"os" | "s3">("os");
  const [params, setParams] = useState({});

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const handleClose = () => {
    props.onClose && props.onClose();
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    let basePath = data.basePath;

    delete data["basePath"];

    let paramsText = JSON.stringify({ ...params, basePath: basePath });
    let playload = { ...data, file_system: fileSystemType, params: paramsText };
    console.log(playload);
    setGlobalLoadingAtom(true);
    requestData({
      url: "/api/FtpServer/",
      method: "POST",
      data: playload,
    }).then(async (res) => {
      if (res.status === 201) {
        enqueueSnackbar(t("filesystem.add-success"), {
          variant: "success",
        });
        await requestData({
          url: "/api/FtpServer/sync_account/",
          method: "POST",
        });

        props.onOk && props.onOk();
        props.onClose && props.onClose();
      } else {
        enqueueSnackbar(t("filesystem.add-failed"), {
          variant: "error",
        });
      }
      setGlobalLoadingAtom(false);
    });
  };

  useEffect(() => {
    reset();
  }, [props.open]);

  return (
    <>
      <CardDialog disableEscapeKeyDown open={props.open} onClose={handleClose}>
        <DialogTitle>{t("Add FTP Account")}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="gap-2 grid ">
            <div>
              <Divider>{t("filesystem.ftp-account")}</Divider>
            </div>
            <div className="gap-4 grid">
              <TextField
                {...register("username", {
                  required: {
                    value: true,
                    message: t("filesystem.username-is-required"),
                  },
                })}
                label={t("filesystem.username")}
                fullWidth
                helperText={errors.username?.message}
                error={!!errors.username}
                size="small"
              />
              <TextField
                {...register("password", {
                  required: {
                    value: true,
                    message: t("filesystem.password-is-required"),
                  },
                })}
                label={t("filesystem.password")}
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                size="small"
              />

              <div>
                <Divider>{t("filesystem.file-system-settings")}</Divider>
              </div>
              <FormControl className="gap-1">
                <TextField
                  {...register("basePath", {
                    required: {
                      value: true,
                      message: t("filesystem.base-path-is-required"),
                    },
                  })}
                  fullWidth
                  error={!!errors.basePath}
                  helperText={errors.basePath?.message}
                  placeholder="/tmp"
                  size="small"
                  label={t("filesystem.ftp-folder")}></TextField>
                <RadioGroup
                  row
                  aria-labelledby="file-system-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={fileSystemType}
                  onChange={(e) => {
                    let value = e.target.value as "os" | "s3";
                    setFileSystemType(value);
                  }}>
                  <FormControlLabel
                    value="os"
                    control={<Radio />}
                    label="Local"
                  />
                  <FormControlLabel value="s3" control={<Radio />} label="S3" />
                </RadioGroup>
              </FormControl>
              {fileSystemType === "s3" && (
                <S3Params
                  onChange={(params) => {
                    setParams(params);
                  }}></S3Params>
              )}
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
