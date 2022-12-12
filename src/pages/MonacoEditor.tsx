import { ReactNode, useEffect, useState } from "react";

import Editor from "@monaco-editor/react";
import { Box, Card, CardContent } from "@mui/material";

import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";
import { requestData } from "../requests/http";

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

  const location = useLocation();

  const editorDidMount = (editor: any, monaco: any) => {
    console.log("editorDidMount", editor);
    editor.focus();
  };

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
            <div>{location.state.path}</div>
          </Box>
          <div className=" rounded-md">
            <Editor
              height="calc(100vh - 120px)"
              defaultLanguage="python"
              defaultValue={value}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
