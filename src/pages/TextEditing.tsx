import { ReactNode, useState } from "react";

import AceEditor from "react-ace";

import { Box, Card, CardContent } from "@mui/material";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-github";
import { useSearchParams } from "react-router-dom";
import LazyMode, { ModeAceType } from "../components/acemode/Index";
import ModeAce from "../components/acemode/ModeAce";

export interface TextEditingProps {
  onLoad?: () => string;
  onSave?: (text: string) => void;
  children?: ReactNode;
}

export default function TextEditing(props: TextEditingProps) {
  const [searchParams] = useSearchParams();
  let mode = searchParams.get("mode");
  if (mode === null) {
    mode = "plain_text";
  }

  if (!Object.keys(ModeAce).includes(mode)) {
    mode = "plain_text";
  } else {
    mode = mode.toLowerCase();
  }

  const [aceMode, setAceMode] = useState<ModeAceType>(mode as ModeAceType);
  const onLoad = () => {
    console.log("i've loaded");
    if (props.onLoad) {
      props.onLoad();
    }
  };

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
              color: (theme) => theme.palette.text.primary,
            }}
            className=" flex justify-between py-2 px-2">
            <div>mode:{aceMode}</div>
          </Box>
          <div className=" rounded-md">
            <LazyMode mode={aceMode}>
              <AceEditor
                value={props.onLoad ? props.onLoad() : ""}
                width="100%"
                height="calc(100vh - 120px)"
                placeholder="Placeholder Text"
                mode={aceMode.toLowerCase()}
                theme="github"
                name="blah2"
                onLoad={onLoad}
                onChange={onChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </LazyMode>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
