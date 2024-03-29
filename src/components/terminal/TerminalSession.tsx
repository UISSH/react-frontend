import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import { Box, Divider } from "@mui/material";
import { WebglAddon } from "xterm-addon-webgl";

import { useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { TerminalDestoryTabAtom } from "../../pages/IndexLayout/Terminal";
import { getWSGateway } from "../../requests/utils";
import {
  GlobalLoadingAtom,
  TerminalGlobalCommandDispatchAtom,
} from "../../store/recoilStore";
import DropFileUpload from "../DropFileUpload";
import { SelectedTerminalTabUniqueAtom } from "./FooterBar";

export interface HostAuth {
  hostname: string;
  port?: number;
  username?: string;
  password?: string;
  private_key?: string;
  private_key_password?: string;
}

export interface TerminalSessionProps {
  unique: string;
  auth: HostAuth;
  cmd?: string;
  children?: React.ReactNode;
}

const basicTheme = {
  foreground: "#eff0eb",
  background: "#282a36",
  selection: "#97979b33",
  black: "#282a36",
  brightBlack: "#686868",
  red: "#ff5c57",
  brightRed: "#ff5c57",
  green: "#5af78e",
  brightGreen: "#5af78e",
  yellow: "#f3f99d",
  brightYellow: "#f3f99d",
  blue: "#57c7ff",
  brightBlue: "#57c7ff",
  magenta: "#ff6ac1",
  brightMagenta: "#ff6ac1",
  cyan: "#9aedfe",
  brightCyan: "#9aedfe",
  white: "#f1f1f0",
  brightWhite: "#eff0eb",
};

export default function TerminalSession(props: TerminalSessionProps) {
  const destoryTabs = useRecoilValue(TerminalDestoryTabAtom);
  const [terminalGlobalCommandDispatch, _] = useRecoilState(
    TerminalGlobalCommandDispatchAtom
  );

  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const terminalGlobalCommandUUID = useRef<string>();
  const [selectedTabs, setSelectedTabs] = useRecoilState(
    SelectedTerminalTabUniqueAtom
  );

  const termRef = useRef<Terminal>();
  const [pingDelay, setPingDelay] = useState<number>(0);
  const webSocketRef = useRef<WebSocket>();
  const fileRef = useRef<File>();
  let terminalSizeRef = useRef({
    cols: 80,
    rows: 80,
  });
  const [dropFileUploadProps, setDropFileUploadProps] = useState<{
    formData?: FormData;

    uploadSignal?: boolean;
  }>({ formData: new FormData(), uploadSignal: false });

  let webSocketUrl = getWSGateway(`terminal/${props.unique.replace(/-/g, "")}`);
  const [connectStatus, setConnectStatus] = useState(true);
  const theme = useTheme();
  const fitAddon = useRef(new FitAddon());
  const materialTheme = {
    foreground: theme.palette.text.primary,
    background: theme.palette.background.paper,
    selection: "#97979b33",
    cursor: theme.palette.primary.main,
    cursorAccent: theme.palette.secondary.main,
    selectionBackground: theme.palette.warning.main,
    selectionForeground: theme.palette.text.primary,
    selectionInactiveBackground: theme.palette.warning.main,
  };

  function getCurrentTerminalDir() {
    setGlobalLoadingAtom(true);
    webSocketRef.current?.send(
      JSON.stringify({
        message: "",
        method: "get_work_dir",
      })
    );
  }

  useEffect(() => {
    if (
      terminalGlobalCommandUUID.current !==
        terminalGlobalCommandDispatch.uuid &&
      terminalGlobalCommandDispatch.uniques.includes(props.unique) &&
      webSocketRef.current?.readyState === 1
    ) {
      webSocketRef.current?.send(
        JSON.stringify({
          message: terminalGlobalCommandDispatch.command + " \r",
        })
      );
      terminalGlobalCommandUUID.current = terminalGlobalCommandDispatch.uuid;
    }
  });

  useEffect(() => {
    let sendTime = new Date().getTime();

    let terminalSocket = new WebSocket(webSocketUrl);
    let terminalSize = terminalSizeRef.current;
    let element = document.getElementById(props.unique) as HTMLElement;
    termRef.current = new Terminal({
      scrollOnUserInput: false,
      fontFamily: '"Cascadia Code", Menlo, monospace',
      theme: materialTheme,
      cursorBlink: true,
      windowsPty: {
        backend: "conpty",
        buildNumber: 19000,
      },
    }) as Terminal;
    let term = termRef.current;
    term.loadAddon(fitAddon.current);
    term.loadAddon(new WebglAddon());

    term.open(element);

    term.onResize((size) => {
      terminalSize.cols = size.cols;
      terminalSize.rows = size.rows;
    });

    fitAddon.current.fit();

    webSocketRef.current = terminalSocket;

    terminalSocket.addEventListener("error", function (event) {
      term?.writeln("The WebSocket connection could not be established.");
    });
    terminalSocket.onopen = function (e) {
      terminalSocket.send(JSON.stringify(props.auth));
      setConnectStatus(true);
    };
    terminalSocket.onclose = function (e) {
      term?.writeln("\r\nThe websocket connection was closed.");
      setConnectStatus(false);
    };

    terminalSocket.onmessage = function (e) {
      let nowTime = new Date().getTime();
      if (nowTime - sendTime !== nowTime) {
        setPingDelay(new Date().getTime() - sendTime);
      }

      sendTime = 0;
      const data = JSON.parse(e.data);
      if (data.code === 201) {
        terminalSocket.send(
          JSON.stringify({
            message: `stty cols ${terminalSize.cols} rows ${terminalSize.rows}  \r`,
          })
        );

        if (props.cmd) {
          terminalSocket.send(
            JSON.stringify({
              message: `${props.cmd} \r clear \r`,
            })
          );
        }

        term?.clear();
      } else {
      }
      if (data.hasOwnProperty("work_dir")) {
        if (!data.work_dir.startsWith("/") || data.work_dir.includes(" ")) {
          setTimeout(getCurrentTerminalDir, 1000);
        } else {
          let target_path = data.work_dir + "/" + fileRef.current?.name;

          let formData = new FormData();
          formData.append("auth", JSON.stringify(props.auth));
          formData.append("target_path", target_path);
          fileRef.current && formData.append("file", fileRef.current);

          setDropFileUploadProps({
            formData: formData,
            uploadSignal: true,
          });
        }
      } else {
        term?.write(data.message);
      }
    };

    term?.onData((data) => {
      sendTime = new Date().getTime();
      terminalSocket.send(
        JSON.stringify({
          message: data,
        })
      );
    });

    return () => {
      term.dispose();
      terminalSocket.close();
      webSocketRef.current?.close();
    };
  }, [props.auth]);

  useEffect(() => {
    if (destoryTabs.includes(props.unique)) {
      termRef.current?.dispose();
      webSocketRef.current?.close();
    }
  }, [destoryTabs]);

  return (
    <>
      <DropFileUpload
        uploadSignal={dropFileUploadProps.uploadSignal}
        handleUploadSignal={(signal: boolean) => {
          setDropFileUploadProps({
            uploadSignal: signal,
          });
        }}
        formData={dropFileUploadProps.formData}
        onReciveFile={(file) => {
          setDropFileUploadProps({
            uploadSignal: false,
          });

          fileRef.current = file;
          getCurrentTerminalDir();
        }}
        requestDataProps={{
          url: "/api/Terminal/upload_file/",
          method: "POST",
        }}>
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.secondary,
          }}
          className="flex justify-between py-1 px-2">
          <div>
            {props.auth.username}@{props.auth.hostname}:{props.auth.port}
          </div>
          <div className="flex gap-2">
            <div> {pingDelay} ms</div>
            {connectStatus ? (
              <OnlinePredictionIcon
                color="success"
                className="animate-pulse"></OnlinePredictionIcon>
            ) : (
              <OnlinePredictionIcon color="error"></OnlinePredictionIcon>
            )}
          </div>
        </Box>
        <Divider />
        <Box
          className="pl-2 pt-2"
          sx={{
            height: "calc(100vh - 195px)",
            backgroundColor: theme.palette.background.default,
          }}>
          <div className="w-full h-full" id={props.unique}></div>
        </Box>
      </DropFileUpload>
    </>
  );
}
