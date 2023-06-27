import { Alert, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ParamsIF {
  bucket: string;
  access_key_id: string;
  secret_access_key: string;
}
export interface S3ParamsProps {
  children?: React.ReactNode;
  className?: string;
  onChange?: (params: ParamsIF) => void;
}

export default function S3Params(props: S3ParamsProps) {
  const [t] = useTranslation();

  const { className, onChange } = props;
  const [params, setParams] = useState<ParamsIF>({
    bucket: "",
    access_key_id: "",
    secret_access_key: "",
  });
  return (
    <>
      <Alert severity="info">{t("filesystem.s3Params-info")}</Alert>

      <TextField
        label="Bucket"
        value={params.bucket}
        size="small"
        onChange={(e) => {
          setParams({ ...params, bucket: e.target.value });
          onChange && onChange({ ...params, bucket: e.target.value });
        }}
      ></TextField>
      <TextField
        label="Access Key ID"
        value={params.access_key_id}
        size="small"
        onChange={(e) => {
          setParams({ ...params, access_key_id: e.target.value });
          onChange && onChange({ ...params, access_key_id: e.target.value });
        }}
      ></TextField>
      <TextField
        label="Secret Access Key"
        value={params.secret_access_key}
        size="small"
        onChange={(e) => {
          setParams({ ...params, secret_access_key: e.target.value });
          onChange &&
            onChange({ ...params, secret_access_key: e.target.value });
        }}
      ></TextField>
    </>
  );
}
