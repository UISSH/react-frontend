import { Button, Alert, Paper } from "@mui/material";

import { useState } from "react";
import Dropzone from "react-dropzone";
import { requestData } from "../requests/http";

export interface DropFileUploadProps {
  children: React.ReactNode;
}

export default function DropFileUpload(props: DropFileUploadProps) {
  const requestUpload = async (files: File[]) => {
    console.log(files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
    const res = await requestData({
      url: "/api/FileBrowser/upload_file",
      params: {
        directory: "/tmp",
      },
      data: formData,
    });
    if (res.ok) {
      console.log("upload success");
    } else {
      console.log("upload failed");
    }
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
