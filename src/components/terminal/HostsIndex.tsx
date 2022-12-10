import AddIcon from "@mui/icons-material/AddCircle";
import { Divider, IconButton, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { KVStorage } from "../../requests/utils";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import PostHost from "./PostHost";
import { HostAuth } from "./TerminalSession";

export interface HostsIndexProps {
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
  private_key: string;
  private_key_password: string;
}

export default function HostsIndex(props: HostsIndexProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [sshClient, setSshClient] = useState<SSHClientInfo>({});
  const sshClientKV = useRef<KVStorage>();

  const [postHostOpen, setPostHostOpen] = useState(false);
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  useEffect(() => {
    console.log("HostsIndex mount");
  }, []);

  function saveSSHClient() {
    sshClientKV.current?.setItem(JSON.stringify(sshClient));
  }

  useEffect(() => {
    if (postHostOpen == false) {
      if (!sshClientKV.current) {
        let kv = new KVStorage("SSH_CLIENT");
        sshClientKV.current = kv;
      }
      console.info("load ssh client");
      sshClientKV.current.init().then((val) => {
        if (val == null) {
          setSshClient({});
        } else {
          setSshClient(JSON.parse(val));
        }
      });
    }
  }, [postHostOpen]);
  return (
    <>
      <div>
        <Divider className="py-2">{t("terminal.host")}</Divider>
        <div className="flex gap-1">
          {sshClient &&
            Object.keys(sshClient).map((item) => {
              return (
                <Button
                  onClick={() => {
                    let auth: HostAuth = {
                      hostname: sshClient[item].hostname,
                      port: sshClient[item].port,
                      username: sshClient[item].username,
                      password: sshClient[item].password,
                      private_key: sshClient[item].private_key,
                      private_key_password:
                        sshClient[item].private_key_password,
                    };
                    props.onClick && props.onClick(item, auth);
                  }}
                  key={sshClient[item].hostname}
                  variant="contained"
                  color="secondary">
                  {item}
                </Button>
              );
            })}

          <Tooltip title={t("terminal.addhost")}>
            <IconButton
              color="primary"
              onClick={() => {
                setPostHostOpen(true);
              }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>

        <Divider className="py-2">{t("terminal.snippet")}</Divider>
        <PostHost
          open={postHostOpen}
          onAdd={(name, hostAuth) => {
            sshClient[name] = {
              name: name,
              ...hostAuth,
            };
            saveSSHClient();
            setPostHostOpen(false);
          }}
          onClose={() => {
            setPostHostOpen(false);
          }}></PostHost>
      </div>
    </>
  );
}
