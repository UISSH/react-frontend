import { useEffect, useState } from "react";
import { json } from "react-router-dom";
import { KVStorage } from "../../requests/utils";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";

export interface HostsIndexProps {
  children?: React.ReactNode;
}

interface SSHClientInfo {
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
  const [sshClient, setSshClient] = useState<SSHClientInfo>({});
  useEffect(() => {
    let kv = new KVStorage("SSH_CLIENT");
    kv.init().then((val) => {
      console.log(val);
      if (val == null) {
        setSshClient({});
      } else {
        setSshClient(JSON.parse(val));
      }
    });
  }, []);
  return (
    <>
      <Divider>Host</Divider>
      <div className="flex gap-1">
        {Object.keys(sshClient).map((item) => {
          return (
            <Button variant="contained" color="secondary">
              {item}
            </Button>
          );
        })}
      </div>
    </>
  );
}
