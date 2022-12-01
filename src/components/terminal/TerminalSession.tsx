export interface HostAuth {
  host: string;
  port: number;
  username: string;
  password: string;
  privateKey: string;
  passphrase: string;
}

export interface TerminalSessionProps {
  hostAuth: HostAuth;
  children?: React.ReactNode;
}

export default function TerminalSession(props: TerminalSessionProps) {
  return <></>;
}
