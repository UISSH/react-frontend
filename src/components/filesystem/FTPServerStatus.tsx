import { CloseOutlined } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { requestData } from "../../requests/http";
import { getApiGateway } from "../../requests/utils";
import CardDialog from "../CardDialog";
export interface FTPServerStatusProps {
  className?: string;
  renderCount: number;
  onChange?: (value: { installed: boolean; run_status: boolean }) => void;
}

export default function FTPServerStatus(props: FTPServerStatusProps) {
  const [t] = useTranslation();
  const [openDialog, setOpenDialog] = useState(true);
  const [installLoading, setInstallLoading] = useState(false);
  const { data, mutate, isLoading } = useSWR<{
    installed: boolean;
    run_status: boolean;
  }>("/api/FtpServer/ping/", async (url) => {
    let data = await requestData({
      url: url,
    });
    let dataJson = await data.json();
    if (props.onChange) {
      props.onChange(dataJson);
    }
    return dataJson;
  });

  useEffect(() => {
    mutate();
  }, [props.renderCount]);

  if (data) {
    return (
      <>
        {data.installed ? (
          <div className="flex gap-2 items-center">
            <CircleIcon
              sx={{ fontSize: 16 }}
              color={data.run_status ? "primary" : "error"}
            ></CircleIcon>
            {getApiGateway().replace("https", "ftp").replace("http", "ftp")}
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <Alert
              onClick={() => {
                setOpenDialog(true);
              }}
              severity="info"
              className="cursor-pointer"
            >
              {t(
                "filesystem.you-need-to-install-an-ftp-server-to-enable-this-feature"
              )}
            </Alert>
            <CardDialog open={openDialog}>
              <CardHeader
                sx={{
                  color: "primary.contrastText",
                  backgroundColor: "primary.main",
                }}
                title={t("filesystem.install")}
                action={
                  <IconButton
                    color="inherit"
                    onClick={(e) => {
                      setOpenDialog(false);
                    }}
                  >
                    <CloseOutlined></CloseOutlined>
                  </IconButton>
                }
              ></CardHeader>
              <CardContent>https://github.com/UISSH/ftp-server</CardContent>
              <CardActions className="flex gap-1 justify-end">
                <LoadingButton
                  loading={installLoading}
                  onClick={() => {
                    setInstallLoading(true);
                    requestData({
                      url: "/api/FtpServer/install/",
                      method: "POST",
                    }).then((res) => {
                      setInstallLoading(false);
                      setOpenDialog(false);
                      setTimeout(() => {
                        mutate();
                      }, 2000);
                    });
                  }}
                  variant="contained"
                >
                  install
                </LoadingButton>
              </CardActions>
            </CardDialog>
          </div>
        )}
      </>
    );
  } else {
    return <></>;
  }
}
