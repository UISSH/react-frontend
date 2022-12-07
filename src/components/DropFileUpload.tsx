import { Paper } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useRef } from "react";

import Dropzone from "react-dropzone";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { requestData, RequestDataProps } from "../requests/http";
import { GlobalLoadingAtom } from "../store/recoilStore";

export interface DropFileUploadProps {
  requestDataProps: RequestDataProps;
  children: React.ReactNode;
  formData?: FormData;

  uploadSignal?: Boolean;
  handleUploadSignal?: (signal: boolean) => void;
  onReciveFile?: (fileArray: File) => void;
}

export default function DropFileUpload(props: DropFileUploadProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const file = useRef<File>();
  const requestUpload = async () => {
    let formData = new FormData();
    if (props.formData === undefined) {
      if (file.current === undefined) {
        return;
      }
      formData.append("file", file.current);
    } else {
      formData = props.formData;
    }

    setGlobalLoadingAtom(true);

    try {
      const res = await requestData({
        ...props.requestDataProps,

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
    props.handleUploadSignal && props.handleUploadSignal(false);
  };

  const handleFile = async (fileArray: File[]) => {
    file.current = fileArray[0];

    if (props.uploadSignal === undefined || props.uploadSignal === true) {
      await requestUpload();
    }

    if (props.onReciveFile) {
      props.onReciveFile(file.current);
    }
  };

  useEffect(() => {
    console.log("uploadSignal", props.uploadSignal);
    if (props.uploadSignal === true) {
      requestUpload();
    }
    return () => {
      props.uploadSignal;
    };
  }, [props.uploadSignal]);

  return (
    <Dropzone noClick onDrop={(acceptedFiles) => handleFile(acceptedFiles)}>
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
