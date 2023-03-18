import { useState } from "react";
import SystemProccess from "../../components/overview/Proccess";
import Shortcut from "../../components/overview/Shortcut";
import SystemStatus from "../../components/overview/SystemStatus";

export default function Index() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Shortcut></Shortcut>
      <SystemStatus></SystemStatus>
    </>
  );
}
