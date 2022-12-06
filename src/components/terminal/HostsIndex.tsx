import { Divider } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect } from "react";
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
  useEffect(() => {
    console.log("HostsIndex mount");
  }, []);
  return (
    <>
      <Divider>Host</Divider>
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
    </>
  );
}
