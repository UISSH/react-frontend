import { Dialog } from "@mui/material";
import TerminalSession from "./TerminalSession";

interface TerminalLocalSerssionDialogProps {
    containerId: string;
    open: boolean;
    cmd?: string;
    onClose: () => void;

}

export default function TerminalLocalSerssionDialog(props: TerminalLocalSerssionDialogProps) {
    if (!props.open) {
        return <div></div>
    }

    return (
        <Dialog open={props.open} onClose={props.onClose} maxWidth="xl">
            <TerminalSession unique={props.containerId} auth={{
                hostname: "localhost"
            }} cmd={"docker exec -it " + props.containerId + " /bin/sh"}></TerminalSession>
        </Dialog >
    )

}