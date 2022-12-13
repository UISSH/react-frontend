//https://monaco-react.surenatoyan.com/

import { ReactNode, useEffect, useRef, useState } from "react";

import Editor, { Monaco } from "@monaco-editor/react";
import { Box, Card, CardContent, TextField } from "@mui/material";
import { editor as MonacoEditor } from "monaco-editor/esm/vs/editor/editor.api";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";
import { requestData } from "../requests/http";

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
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [darkTheme, setDarkTheme] = useState<boolean>(false);

  const location = useLocation();

  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor>();

  function handleEditorDidMount(
    editor: MonacoEditor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
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
          setValue(json.text);
        } else {
          let json = await res.json();
          enqueueSnackbar(json.detail, { variant: "error" });
        }
      });
    }
  }, [location.state]);

  const onChange = (newValue: string) => {
    console.log("change", newValue);
  };

  return (
    <>
      <Card sx={{ height: "calc(100vh - 80px)" }}>
        <CardContent sx={{ padding: 0 }}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.secondary.main,
              color: (theme) => theme.palette.text.disabled,
            }}
            className=" flex justify-between py-2 px-2">
            <div>
              <span className="p-1">{location.state.path}</span>
            </div>

            <div> 1</div>
          </Box>
          <div className=" rounded-md">
            <Editor
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              theme={darkTheme ? "vs-dark" : "vs-light"}
              defaultPath={location.state.path}
              height="calc(100vh - 120px)"
              value={value}
              onChange={(newValue) => {}}
              onMount={handleEditorDidMount}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
