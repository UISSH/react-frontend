import { ReactNode, useEffect, useState } from "react";

import AceEditor from "react-ace";

import { Box, Card, CardContent } from "@mui/material";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-github";
import { useLocation, useNavigation, useSearchParams } from "react-router-dom";
import LazyMode, { ModeAceType } from "../components/acemode/LazyAceEditor";
import ModeAce from "../components/acemode/ModeAce";
import { fetchData, requestData } from "../requests/http";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../store/recoilStore";

export interface TextEditingProps {
  onLoad?: () => string;
  onSave?: (text: string) => void;
  children?: ReactNode;
}

export default function TextEditing(props: TextEditingProps) {
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState<string>("");
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const location = useLocation();

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

    console.log(location.state);
  };

  useEffect(() => {
    if (location.state.type == "vim") {
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
              color: (theme) => theme.palette.text.primary,
            }}
            className=" flex justify-between py-2 px-2">
            <div>mode:{aceMode}</div>
          </Box>
          <div className=" rounded-md">
            <LazyMode mode={aceMode}>
              <AceEditor
                value={value}
                width="100%"
                height="calc(100vh - 120px)"
                mode={aceMode.toLowerCase()}
                theme="github"
                onLoad={onLoad}
                onChange={onChange}
                fontSize={14}
                showPrintMargin={false}
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
