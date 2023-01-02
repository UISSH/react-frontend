import { useState } from "react";
import AceEditor from "react-ace";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-monokai";
import SaveIcon from "@mui/icons-material/Save";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { requestData } from "../../requests/http";
import LazyMode from "../acemode/LazyAceEditor";

export interface NginxConfigEditorProps {
  id: string;
  text: string;
}

export default function NginxConfigEditor(props: NginxConfigEditorProps) {
  const [value, setValue] = useState<string>();
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const handle = useFullScreenHandle();

  const { data, error, isLoading, mutate } = useSWR(
    `/api/Website/${props.id}/?vtab=nginx`,
    async (url) => {
      const res = await requestData({
        url: url,
      });
      if (!res.ok) {
        enqueueSnackbar(t("error"), { variant: "error" });
      } else {
        let resJson = await res.json();
        setValue(resJson.valid_web_server_config);
        return resJson.valid_web_server_config;
      }
    }
  );

  const onLoad = () => {};

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  const onSave = () => {
    console.log(value);
    requestData({
      url: `/api/Website/${props.id}/update_web_config/`,
      method: "POST",
      data: {
        web_server_config: value,
      },
    }).then(async (res) => {
      if (res.ok) {
        enqueueSnackbar(t("success"), { variant: "success" });
        mutate();
      } else {
        let resJson = await res.json();
        console.log(resJson);
        if ("web_server_config" in resJson) {
          enqueueSnackbar(resJson.web_server_config as string, {
            variant: "error",
          });
        } else {
          enqueueSnackbar(t("error"), { variant: "error" });
        }
      }
    });
  };
  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <Card
          sx={{
            height: "calc(100vh - 100px)",
            borderRadius: 0,
          }}
          onKeyDown={(e) => {
            if (e.key == "s" && e.ctrlKey) {
              e.preventDefault();
              onSave();
            }
          }}>
          <FullScreen handle={handle}>
            <CardContent sx={{ padding: 0 }}>
              <Box
                sx={{
                  backgroundColor: (theme) =>
                    darkTheme ? "black" : theme.palette.secondary.main,
                  color: (theme) =>
                    darkTheme ? "white" : theme.palette.primary.contrastText,
                }}
                className=" flex flex-nowrap justify-end py-2 px-2 items-center">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        value={darkTheme}
                        onChange={() => {
                          setDarkTheme(!darkTheme);
                        }}
                      />
                    }
                    label="Dark"
                  />
                </FormGroup>
                <IconButton size="small" color="inherit" onClick={onSave}>
                  <SaveIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => {
                    handle.active ? handle.exit() : handle.enter();
                  }}>
                  {handle.active ? (
                    <ZoomInMapIcon></ZoomInMapIcon>
                  ) : (
                    <ZoomOutMapIcon />
                  )}
                </IconButton>
              </Box>

              <Box
                sx={{
                  padding: 0,
                  height: handle.active
                    ? "calc(100vh - 60px)"
                    : "calc(100vh - 150px)",
                }}>
                <LazyMode mode={"nginx"}>
                  <AceEditor
                    value={value}
                    width="100%"
                    height={
                      handle.active
                        ? "calc(100vh - 60px)"
                        : "calc(100vh - 150px)"
                    }
                    mode="nginx"
                    onLoad={onLoad}
                    onChange={onChange}
                    fontSize={14}
                    theme={darkTheme ? "monokai" : "tomorrow"}
                    showPrintMargin={false}
                    showGutter={true}
                    highlightActiveLine={true}
                  />
                </LazyMode>
              </Box>
            </CardContent>
          </FullScreen>
        </Card>
      )}
    </>
  );
}
