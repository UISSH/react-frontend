import { Paper } from "@mui/material";
import { useSnackbar } from "notistack";
import { useRef } from "react";

import Dropzone from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { requestData } from "../../requests/http";
import { GlobalLoadingAtom } from "../../store/recoilStore";

export interface ExplorerDropFileUploadProps {
  children: React.ReactNode;
}

export default function ExplorerDropFileUpload(
  props: ExplorerDropFileUploadProps
) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const [searchParams, setSearchParams] = useSearchParams();

  const file = useRef<File>();

  const getCurrentDirectory = () => {
    let directory = searchParams.get("directory") + "/" || "/";
    return directory.replace(/\/\//g, "/");
  };
  const requestUpload = async () => {
    let formData = new FormData();
    if (file.current === undefined) {
      return;
    }
    formData.append("file", file.current);
    setGlobalLoadingAtom(true);

    try {
      const res = await requestData({
        url: "/api/FileBrowser/upload_file/",
        method: "POST",
        params: {
          directory: getCurrentDirectory(),
        },
        data: formData,
      });
      if (res.ok) {
        enqueueSnackbar(t("upload success"), { variant: "success" });
      } else {
        console.log("upload failed");
        enqueueSnackbar(t("upload failed"), { variant: "error" });
      }
    } catch (error) {
      console.log(error);
      // @ts-ignore
      enqueueSnackbar(error.stack, { variant: "error" });
    }
    setGlobalLoadingAtom(false);
  };

  const handleFile = async (fileArray: File[]) => {
    file.current = fileArray[0];

    await requestUpload();
  };

  return (
    <Dropzone noClick onDrop={(acceptedFiles) => handleFile(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <Paper
          sx={{
            boxShadow: "none",
          }}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {props.children}
          </div>
        </Paper>
      )}
    </Dropzone>
  );
}
