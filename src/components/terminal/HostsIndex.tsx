import { useEffect, useRef, useState } from "react";
import { json } from "react-router-dom";
import { KVStorage } from "../../requests/utils";
import Button from "@mui/material/Button";
import { Divider } from "@mui/material";

export interface HostsIndexProps {
  sshClientInfo: SSHClientInfo;
  children?: React.ReactNode;
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
  return (
    <>
      <Divider>Host</Divider>
      <div className="flex gap-1">
        {props.sshClientInfo &&
          Object.keys(props.sshClientInfo).map((item) => {
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
