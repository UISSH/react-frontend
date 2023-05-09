//https://monaco-react.surenatoyan.com/

import { ReactNode, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import Editor, { Monaco } from "@monaco-editor/react";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import {
  Box,
  Card,
  CardContent,
  FormControlLabel,
  IconButton,
  Switch,
} from "@mui/material";
import { editor as MonacoEditor } from "monaco-editor/esm/vs/editor/editor.api";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

import { AppBarOpenAtom } from "../../store/recoilStore";

export interface BashEditorProps {
  text?: string;
  onChange?: (value: string | undefined) => void;
  children?: ReactNode;
}

export default function BashEditor(props: BashEditorProps) {
  const [value, setValue] = useState<string>(props.text || "");
  const lastestValue = useRef<string>("");
  const [t] = useTranslation();
  const [darkTheme, setDarkTheme] = useState<boolean>(false);
  const handle = useFullScreenHandle();
  const [languageID, setLanguageID] = useState<string>("shell");

  const [appBarOpenAtom, setAppBarOpenAtom] = useRecoilState(AppBarOpenAtom);

  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor>();

  function handleEditorDidMount(
    editor: MonacoEditor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    setLanguageID(editor.getModel()?.getLanguageId() || "shell");
  }

  return (
    <>
      <Card
        sx={{ boxShadow: "none" }}
        onKeyDown={(e) => {
          if (e.key == "s" && e.ctrlKey) {
            e.preventDefault();
            // onSave();
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
              <div className="flex w-full justify-between">
                <FormControlLabel
                  className="ml-2"
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
                  ? "calc(100vh - 80px)"
                  : "calc(100vh - 260px)",
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
                onChange={props.onChange && props.onChange}
                onMount={handleEditorDidMount}
              />
            </Box>
          </CardContent>
        </FullScreen>
      </Card>
    </>
  );
}
