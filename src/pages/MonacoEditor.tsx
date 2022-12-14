//https://monaco-react.surenatoyan.com/

import { ReactNode, useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import FileEditor from "../components/explorer/FileEditor";
import SnippetEditor from "../components/terminal/SnippetEditor";

import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
loader.config({ monaco });

export interface MonacoEditorProps {
  onLoad?: () => string;
  onSave?: (text: string) => void;
  children?: ReactNode;
}

export default function MonacoEditorPage(props: MonacoEditorProps) {
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
