import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Shortcut from "../../components/overview/Shortcut";
import SystemStatus from "../../components/overview/SystemStatus";

export default function Index() {
  const navigate = useNavigate();
  return (
    <>
      {/* <Button
        onClick={() => {
          navigate("/dash/terminal", {
            state: {
              name: "uissh",
            },
          });
        }}>
        test
      </Button> */}
      <Shortcut></Shortcut>
      <SystemStatus></SystemStatus>
    </>
  );
}
