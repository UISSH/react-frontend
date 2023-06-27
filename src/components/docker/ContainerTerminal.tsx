import { Dialog } from "@mui/material";
import TerminalLocalSerssionDialog from "../terminal/TerminalLocalSerssionDialog";

interface ContainerTerminalProps {
  containerId: string;
  open: boolean;
  onClose: () => void;
}

export default function ContainerTerminal(props: ContainerTerminalProps) {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="xl"></Dialog>
  );
}
