//https://monaco-react.surenatoyan.com/

import { ReactNode, useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import Editor, { Monaco } from "@monaco-editor/react";
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
  TextField,
} from "@mui/material";
import { editor as MonacoEditor } from "monaco-editor/esm/vs/editor/editor.api";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { TERMINAL_SNIPPET_PREFIX } from "../../constant";
import { createKV, getKV, updateKV } from "../../requests/kvstorage";
import { AppBarOpenAtom, GlobalLoadingAtom } from "../../store/recoilStore";

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
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const handle = useFullScreenHandle();
  const [languageID, setLanguageID] = useState<string>("plaintext");

  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const [appBarOpenAtom, setAppBarOpenAtom] = useRecoilState(AppBarOpenAtom);
  const [newSnippet, setNewSnippet] = useState<boolean>();
  const [snippetName, setSnippetName] = useState<string>("");
  const [snippetError, setSnippetError] = useState<string | null>();

  const location = useLocation();

  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor>();

  useEffect(() => {
    console.log(location.state);
    setSnippetName(location.state.name);
    setNewSnippet(location.state.newSnippet);
  }, [location.state]);
  const { mutate } = useSWR(location, (_location) => {
    if (_location.state.newSnippet) {
      setSnippetName("");
      setValue("");
    } else {
      if (!_location.state.name) return;
      getKV(`${TERMINAL_SNIPPET_PREFIX}${location.state.name}`)
        .then((res) => res.json())
        .then((res) => {
          setValue(res.value);
        });
    }
  });

  // vaildate snippet name
  const validateSnippetName = (name: string | null | undefined) => {
    if (!name || name.trim() === "") {
      setSnippetError(t("terminal.snippetNameRequired"));
      return false;
    }
    // 只能包含英文数字下划线
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setSnippetError(t("terminal.snippetNameInvalid"));
      return false;
    }

    return true;
  };

  const onSave = () => {
    if (!validateSnippetName(snippetName)) {
      return;
    }
    let requestInstance;
    if (newSnippet) {
      requestInstance = createKV(
        TERMINAL_SNIPPET_PREFIX + snippetName,
        lastestValue.current
      );
    } else {
      requestInstance = updateKV(
        TERMINAL_SNIPPET_PREFIX + snippetName,
        lastestValue.current
      );
    }
    requestInstance.then((res) => {
      if (res.ok) {
        enqueueSnackbar(t("terminal.snippetSaved"), {
          variant: "success",
        });
        setNewSnippet(false);
      } else {
        enqueueSnackbar(t("terminal.snippetSaveFailed"), {
          variant: "error",
        });
      }
    });
  };

  function handleEditorDidMount(
    editor: MonacoEditor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    setLanguageID(editor.getModel()?.getLanguageId() || "plaintext");
  }

  return (
    <>
      <Card
        sx={{ height: "calc(100vh - 65px)" }}
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
                  darkTheme ? "black" : theme.palette.grey[50],
                color: (theme) =>
                  darkTheme ? "white" : theme.palette.text.primary,
              }}
              className=" flex justify-between py-2 px-2 items-center">
              <div>
                <span className="p-1">
                  <TextField
                    size="small"
                    label={t("terminal.snippetName")}
                    helperText={snippetError}
                    variant="standard"
                    error={!!snippetError}
                    required
                    value={snippetName}
                    onChange={(e) => {
                      setSnippetName(e.target.value);
                    }}></TextField>
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
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
                  : "calc(100vh - 120px)",
              }}>
              <Editor
                options={{
                  minimap: {
                    enabled: true,
                  },
                }}
                theme={darkTheme ? "vs-dark" : "vs-light"}
                defaultPath={"/test.sh"}
                value={value}
                onChange={(newValue) => {
                  console.log(newValue || "");

                  lastestValue.current = newValue || "";
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
