import { Button, Alert, Paper } from "@mui/material";
import { useSnackbar } from "notistack";

import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { requestData, RequestDataProps } from "../requests/http";
import { GlobalLoadingAtom, GlobalProgressAtom } from "../store/recoilStore";

export interface DropFileUploadProps {
  requestDataProps: RequestDataProps;
  children: React.ReactNode;
}

export default function DropFileUpload(props: DropFileUploadProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const requestUpload = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    setGlobalLoadingAtom(true);
    const res = await requestData({
      ...props.requestDataProps,
      data: formData,
    });
    if (res.ok) {
      console.log("upload success");
      enqueueSnackbar(t("upload success"), { variant: "success" });
    } else {
      console.log("upload failed");
      enqueueSnackbar(t("upload failed"), { variant: "error" });
    }
    setGlobalLoadingAtom(false);
  };
  return (
    <Dropzone noClick onDrop={(acceptedFiles) => requestUpload(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <Paper>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {props.children}
          </div>
        </Paper>
      )}
    </Dropzone>
  );
}
