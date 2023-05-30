import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { ContainerIF } from "./schema";

interface ContainerProps {
  row: ContainerIF;
}
export default function ContainerPort(props: ContainerProps) {
  const ipv4Port = props.row.ports[0];

  if (ipv4Port == null) {
    return <div></div>;
  }
  return (
    <div className="flex justify-end items-center">
      {ipv4Port.privatePort} {<ArrowRightAltIcon></ArrowRightAltIcon>}
      {ipv4Port.publicPort}
    </div>
  );
}
