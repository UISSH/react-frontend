import { Alert, AlertTitle, Box, Button } from "@mui/material";
import TerminalSession from "../terminal/TerminalSession";
import { useState } from "react";
import useSWR from "swr";

export default function InstallDocker() {
  let needInstallDockerMsg = "Docker is not installed";

  const [installDocker, setInstallDocker] = useState(false);

  return (
    <>
      <Box
        className="w-full p-2 flex  flex-col gap-2 "
        sx={{
          minHeight: "calc(100vh - 48px)",
        }}>
        <Alert
          severity="info"
          action={
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={() => {
                setInstallDocker(true);
              }}>
              install
            </Button>
          }>
          <AlertTitle>{needInstallDockerMsg}</AlertTitle>
          The docker management page needs to install the docker core to enable
          it.
        </Alert>
        {installDocker && (
          <TerminalSession
            unique={"install-docker"}
            auth={{
              hostname: "localhost",
            }}
            cmd={"curl -fsSL https://get.docker.com | bash"}></TerminalSession>
        )}
      </Box>
    </>
  );
}
