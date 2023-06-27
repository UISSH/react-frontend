//https://monaco-react.surenatoyan.com/

import { ReactNode, useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import Editor, { Monaco } from "@monaco-editor/react";
import SaveIcon from "@mui/icons-material/Save";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  TextField,
} from "@mui/material";
import { editor as MonacoEditor } from "monaco-editor/esm/vs/editor/editor.api";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { requestData } from "../../requests/http";
import { AppBarOpenAtom } from "../../store/recoilStore";
import { ShortcutItemIF } from "../../store/shortStore";
import ShortcutBook from "../overview/ShortcutBook";
import { MD5 } from "crypto-js";
import { calcMD5 } from "../../utils";

// import * as monaco from "monaco-editor";
// import { loader } from "@monaco-editor/react";
// loader.config({ monaco });

export interface MonacoEditorProps {
  onLoad?: () => string;
  onSave?: (text: string) => void;
  children?: ReactNode;
}

export default function MonacoEditorPage(props: MonacoEditorProps) {
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState<string>("");
  const lastestValue = useRef<string>("");
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const handle = useFullScreenHandle();
  const [languageID, setLanguageID] = useState<string>("plaintext");

  const [appBarOpenAtom, setAppBarOpenAtom] = useRecoilState(AppBarOpenAtom);

  const location = useLocation();
  const [shortcutData, setShortcutData] = useState<ShortcutItemIF>();

  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor>();

  const onSave = () => {
    if (location.state.type == "vim" && location.state.path) {
      console.log(lastestValue.current);
      requestData({
        url: "/api/FileBrowser/file_text_operating/",
        method: "POST",
        params: {
          abs_path: location.state.path,
        },
        data: {
          path: location.state.path,
          text: lastestValue.current,
        },
      }).then(async (res) => {
        if (res.ok) {
          enqueueSnackbar("ok", { variant: "success" });
        } else {
          enqueueSnackbar("error", { variant: "error" });
        }
      });
    }
  };

  function handleEditorDidMount(
    editor: MonacoEditor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    setLanguageID(editor.getModel()?.getLanguageId() || "plaintext");
  }

  useEffect(() => {
    if (location.state.type == "vim" && location.state.path) {
      requestData({
        url: "/api/FileBrowser/file_text_operating/",
        params: {
          abs_path: location.state.path,
        },
      }).then(async (res) => {
        if (res.ok) {
          let json = await res.json();
          lastestValue.current = json.text;
          setValue(lastestValue.current);
        } else {
          let json = await res.json();
          enqueueSnackbar(json.detail, { variant: "error" });
        }
      });
    }

    setShortcutData({
      name: (location.state.path.split("/").pop() as string) || "",
      unique: "vim-" + calcMD5(location.state.path),
      cate: "text",
      router: location,
    });
  }, [location.state]);

  return (
    <>
      <Card
        sx={{ height: "calc(100vh - 50px)", boxShadow: "none" }}
        onKeyDown={(e) => {
          if (e.key == "s" && e.ctrlKey) {
            e.preventDefault();
            onSave();
          }
        }}
      >
        <FullScreen handle={handle}>
          <CardContent sx={{ padding: 0 }}>
            <Box
              sx={{
                backgroundColor: (theme) =>
                  darkTheme ? "black" : theme.palette.grey[50],
                color: (theme) =>
                  darkTheme ? "white" : theme.palette.text.primary,
              }}
              className=" flex flex-nowrap justify-between py-2 px-2 items-center"
            >
              <div className="grow mr-8">
                <TextField
                  fullWidth
                  variant="standard"
                  size="small"
                  inputProps={{
                    style: { color: darkTheme ? "white" : "inherit" },
                  }}
                  value={location.state.path}
                ></TextField>
              </div>

              <div className="flex  flex-nowrap gap-1 content-baseline items-center">
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
                {shortcutData && (
                  <ShortcutBook {...shortcutData}></ShortcutBook>
                )}
                <IconButton size="small" color="inherit" onClick={onSave}>
                  <SaveIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => {
                    handle.active ? handle.exit() : handle.enter();
                  }}
                >
                  {handle.active ? (
                    <ZoomInMapIcon></ZoomInMapIcon>
                  ) : (
                    <ZoomOutMapIcon />
                  )}
                </IconButton>
              </div>
            </Box>

            <Box
              className="rounded-md"
              sx={{
                width: handle.active
                  ? "100%"
                  : appBarOpenAtom
                  ? "calc(100vw - 240px)"
                  : "100%",
                height: handle.active
                  ? "calc(100vh - 60px)"
                  : "calc(100vh - 100px)",
              }}
            >
              <Editor
                options={{
                  minimap: {
                    enabled: languageID == "plaintext" ? false : true,
                  },
                }}
                theme={darkTheme ? "vs-dark" : "vs-light"}
                defaultPath={location.state.path}
                value={value}
                onChange={(newValue) => {
                  lastestValue.current = newValue || " ";
                }}
                onMount={handleEditorDidMount}
              />
            </Box>
          </CardContent>
        </FullScreen>
      </Card>
    </>
  );
}
