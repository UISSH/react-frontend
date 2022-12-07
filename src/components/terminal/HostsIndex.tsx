import { Divider } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { HostAuth } from "./TerminalSession";

export interface HostsIndexProps {
  sshClientInfo: SSHClientInfo;
  children?: React.ReactNode;
  onClick?: (name: string, hostAuth: HostAuth) => void;
}

export interface SSHClientInfo {
  [name: string]: SSHClient;
}

interface SSHClient {
  name: string;
  port: number;
  hostname: string;
  username: string;
  password: string;
  keyLogin: boolean;
  private_key: string;
  private_key_password: string;
}

export default function HostsIndex(props: HostsIndexProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  useEffect(() => {
    console.log("HostsIndex mount");
  }, []);
  return (
    <>
      <Divider>{t("terminal.host")}</Divider>
      <div className="flex gap-1">
        {props.sshClientInfo &&
          Object.keys(props.sshClientInfo).map((item) => {
            return (
              <Button
                onClick={() => {
                  let auth: HostAuth = {
                    hostname: props.sshClientInfo[item].hostname,
                    port: props.sshClientInfo[item].port,
                    username: props.sshClientInfo[item].username,
                    password: props.sshClientInfo[item].password,
                    private_key: props.sshClientInfo[item].private_key,
                    private_key_password:
                      props.sshClientInfo[item].private_key_password,
                  };
                  props.onClick && props.onClick(item, auth);
                }}
                key={props.sshClientInfo[item].hostname}
                variant="contained"
                color="secondary">
                {item}
              </Button>
            );
          })}
      </div>

      <Divider>{t("terminal.snippet")}</Divider>
    </>
  );
}
