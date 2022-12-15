//https://monaco-react.surenatoyan.com/

import { ReactNode, useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import FileEditor from "../components/explorer/FileEditor";
import SnippetEditor from "../components/terminal/SnippetEditor";

import { loader } from "@monaco-editor/react";

let ChinaOptimization = true;

const ChinaOptimizationVs =
  "https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/monaco-editor/0.33.0-dev.20220228/min/vs";

if (ChinaOptimization) {
  loader.config({
    paths: { vs: ChinaOptimizationVs },
  });
}

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
