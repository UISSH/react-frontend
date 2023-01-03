import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
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
import { PanoramaSharp } from "@mui/icons-material";

export interface AddProps {
  children?: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  onOk?: () => void;
}
interface IFormInput {
  username: string;
  password: string;
}
const defaultValues = {
  s3: {
    endpoint: "https://s3.amazonaws.com",
    region: "eu-west-1",
    bucket: "my-bucket",
    access_key_id: "AKIA....",
    secret_access_key: "IDxd....",
    disable_ssl: "false",
    path_style: "false",
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
  const [params, setParams] = useState<string>(
    JSON.stringify(defaultValues.os)
  );

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
    console.log({ ...data, file_system: fileSystemType, params: params });
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
                    message: "username is required",
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
                  required: { value: true, message: "password is required" },
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
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="file-system-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={fileSystemType}
                  onChange={(e) => {
                    let value = e.target.value as "os" | "s3";
                    setFileSystemType(value);
                    setParams(JSON.stringify(defaultValues[value], null, 2));
                  }}>
                  <FormControlLabel
                    value="os"
                    control={<Radio />}
                    label="Local"
                  />
                  <FormControlLabel value="s3" control={<Radio />} label="S3" />
                </RadioGroup>
              </FormControl>
              {
                <TextField
                  variant="standard"
                  className="p-0"
                  inputProps={{ style: { fontSize: "0.8rem" } }}
                  value={params}
                  onChange={(e) => {
                    setParams(e.target.value);
                  }}
                  multiline
                  rows={5}></TextField>
              }
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
