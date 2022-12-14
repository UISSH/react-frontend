//https://monaco-react.surenatoyan.com/

import { ReactNode, useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import Editor, { Monaco } from "@monaco-editor/react";
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
import SaveIcon from "@mui/icons-material/Save";
import { requestData } from "../requests/http";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import ZoomInMapIcon from "@mui/icons-material/ZoomInMap";
import { useRecoilState } from "recoil";
import { AppBarOpenAtom } from "../store/recoilStore";
import FileEditor from "../components/explorer/FileEditor";
import SnippetEditor from "../components/terminal/SnippetEditor";

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
  const [editorType, setEditorType] = useState<string>("snippet");

  const location = useLocation();

  useEffect(() => {
    let editorType = location.state?.type || "snippet";
    if (editorType == "vim" && location.state.path) {
      setEditorType("vim");
    }
  }, [location.state]);

  return (
    <>
      {editorType == "vim" ? (
        <FileEditor />
      ) : (
        <SnippetEditor>snippet</SnippetEditor>
      )}
    </>
  );
}
