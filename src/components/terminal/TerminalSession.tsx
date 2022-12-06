import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import { Box, Divider } from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { getWSGateway } from "../../requests/utils";

export interface HostAuth {
  hostname: string;
  port: number;
  username: string;
  password: string;
  private_key: string;
  private_key_password: string;
}

export interface TerminalSessionProps {
  unique: string;
  auth: HostAuth;
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
  const termRef = useRef<Terminal>();
  const [pingDelay, setPingDelay] = useState<number>(0);
  const [webSocket, setWebSocket] = useState<WebSocket>();
  let webSocketUrl = getWSGateway(`terminal/${props.unique.replace(/-/g, "")}`);
  const [connectStatus, setConnectStatus] = useState(true);
  const currentWorkDir = useRef<string>("");
  const theme = useTheme();

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
  useEffect(() => {
    let terminalSize = {
      cols: 80,
      rows: 80,
    };
    let sendTime = new Date().getTime();

    console.log("TerminalSession mount");
    const fitAddon = new FitAddon();
    let element = document.getElementById(props.unique) as HTMLElement;
    termRef.current = new Terminal({
      fontFamily: '"Cascadia Code", Menlo, monospace',
      theme: materialTheme,
      cursorBlink: true,
    }) as Terminal;
    let term = termRef.current;
    term.loadAddon(fitAddon);
    term.open(element);

    term.onResize((size) => {
      terminalSize.cols = size.cols;
      terminalSize.rows = size.rows;
    });

    fitAddon.fit();

    let terminalSocket = new WebSocket(webSocketUrl);
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
      setPingDelay(new Date().getTime() - sendTime);
      const data = JSON.parse(e.data);
      if (data.code === 201) {
        terminalSocket.send(
          JSON.stringify({
            message: `stty cols ${terminalSize.cols} rows ${terminalSize.rows}  \r`,
          })
        );
        term?.clear();
      } else {
      }
      if (data.hasOwnProperty("work_dir")) {
        currentWorkDir.current = data.work_dir;
        if (
          !currentWorkDir.current.startsWith("/") ||
          currentWorkDir.current.includes(" ")
        ) {
          // setTimeout(getWorkDir, 1000);
        } else {
          //requestUploadFile();
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

    setWebSocket(terminalSocket);
    return () => {
      term.dispose();
      terminalSocket.close();
      console.log("TerminalSession unmount");
    };
  }, [props.auth]);
  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.secondary,
        }}
        className=" flex justify-between py-1 px-2">
        <div>
          {props.auth.username}@{props.auth.hostname}:{props.auth.port}
        </div>
        <div className=" flex gap-2">
          <div> {pingDelay} ms</div>
          {connectStatus ? (
            <OnlinePredictionIcon
              color="error"
              className="animate-pulse"></OnlinePredictionIcon>
          ) : (
            <OnlinePredictionIcon color="error"></OnlinePredictionIcon>
          )}
        </div>
      </Box>
      <Divider />
      <Box
        className=" pl-2 pt-2"
        sx={{
          height: "calc(100vh - 220px)",
          backgroundColor: theme.palette.background.default,
        }}>
        <div className="w-full h-full" id={props.unique}></div>
      </Box>
    </>
  );
}
