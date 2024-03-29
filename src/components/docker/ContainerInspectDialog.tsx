import { CloseOutlined } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import useSWR, { mutate } from "swr";
import { requestData } from "../../requests/http";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { ContainerIF, ContainerInspectIF } from "./schema";

interface ContainerInspectProps {
  open: boolean;
  containerId: string;
  onClose: () => void;
}
export function ContainerInspectDialog(props: ContainerInspectProps) {
  if (!props.open) {
    return <></>;
  }

  const [t] = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  // const data = {schedule: location.state?.schedule,command: location.state?.command,}
  // navigate(`?action=update`, { state: {id: row.id,schedule: row.schedule,command: row.command,shellscript: row.shellscript,},});

  const [restartPolicy, setRestartPolicy] = useState<string>("no");

  if (!props.open) {
    return <div></div>;
  }

  // Add timestamp to avoid cache

  const { data, isLoading, error } = useSWR<{
    inspect: ContainerInspectIF;
    container: ContainerIF;
  }>(props.containerId, async (id) => {
    let inspectRes = await requestData({
      url: `/api/DockerContainer/${id}/inspect/`,
      method: "GET",
    });

    let containerRes = await requestData({
      url: `/api/DockerContainer/${id}/`,
      method: "GET",
    });

    let resJson = {
      inspect: await inspectRes.json(),
      container: await containerRes.json(),
    };
    let v = resJson?.inspect.hostConfig.restartPolicy.name
      ? resJson?.inspect.hostConfig.restartPolicy.name
      : "no";
    setRestartPolicy(v);
    return resJson;
  });

  if (isLoading) {
    return (
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogContent>loading ...</DialogContent>
      </Dialog>
    );
  }

  const handleRestartPolicyChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGlobalLoadingAtom(true);
    let res = await requestData({
      url: `/api/DockerContainer/${props.containerId}/set_restart_policy/`,
      method: "POST",
      data: {
        name: e.target.value,
        maximum_retry_count: 3,
      },
    });
    if (res.ok) {
      mutate(props.containerId);
    } else {
      enqueueSnackbar("set restart policy failed", { variant: "error" });
    }
    setGlobalLoadingAtom(false);
  };

  return (
    <Dialog fullScreen open={props.open} onClose={props.onClose}>
      <DialogTitle className="flex justify-between items-center">
        <div>
          <Typography variant="h6">Container Inspect</Typography>
        </div>
        <IconButton
          sx={{
            color: (theme) => theme.palette.primary.contrastText,
          }}
          onClick={props.onClose}
        >
          <CloseOutlined></CloseOutlined>
        </IconButton>
      </DialogTitle>
      <DialogContent className="flex flex-col gap-2">
        <Typography variant="subtitle1" className="my-2">
          Restart Policy
        </Typography>

        <div className="flex flex-col gap-2 ">
          <TextField
            label="policy"
            size="small"
            InputProps={{ readOnly: true }}
            helperText="https://docs.docker.com/config/containers/start-containers-automatically/#use-a-restart-policy"
            value={restartPolicy}
          ></TextField>

          <div>
            <RadioGroup
              onChange={handleRestartPolicyChange}
              row
              aria-labelledby="restart-policy-radio-buttons-group-label"
              value={restartPolicy}
              name="restart-policy-radio-buttons-group"
            >
              <FormControlLabel value="no" control={<Radio />} label="no" />
              <FormControlLabel
                value="always"
                control={<Radio />}
                label="always"
              />
              <FormControlLabel
                value="unless-stopped"
                control={<Radio />}
                label="unless-stopped	"
              />
            </RadioGroup>
          </div>
        </div>

        <Typography variant="subtitle1" className="my-2">
          Environment
        </Typography>
        <div className="flex flex-col gap-2">
          {data?.inspect.config.env.map((item, index) => {
            return (
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                size="small"
                key={index}
                value={item}
              ></TextField>
            );
          })}
        </div>

        <Typography variant="subtitle1" className="my-2">
          Mounts
        </Typography>
        <div className="flex flex-col gap-2 w-ful">
          {data?.inspect.mounts.map((item, index) => {
            return (
              <div key={index} className="flex gap-2">
                <TextField
                  InputProps={{ readOnly: true }}
                  label="host"
                  fullWidth
                  size="small"
                  value={item.source}
                ></TextField>
                <TextField
                  InputProps={{ readOnly: true }}
                  label="container"
                  fullWidth
                  size="small"
                  value={item.destination}
                ></TextField>
              </div>
            );
          })}
        </div>

        <Typography variant="subtitle1" className="my-2">
          Ports
        </Typography>
        <div className="flex flex-col gap-2">
          {data?.inspect.networkSettings.ports &&
            Object.keys(data?.inspect.networkSettings.ports).map(
              (item, index) => {
                return (
                  <div key={index} className="flex flex-col gap-4">
                    {data?.inspect.networkSettings.ports[item].map(
                      (port, index) => {
                        return (
                          <div key={`${port}${index}`} className="flex gap-2">
                            <TextField
                              fullWidth
                              label="container"
                              size="small"
                              value={item}
                              InputProps={{ readOnly: true }}
                            ></TextField>
                            {port.hostIp && (
                              <TextField
                                InputProps={{ readOnly: true }}
                                fullWidth
                                label="host ip"
                                size="small"
                                value={port.hostIp}
                              ></TextField>
                            )}
                            <TextField
                              InputProps={{ readOnly: true }}
                              fullWidth
                              label="host port"
                              size="small"
                              value={port.hostPort}
                            ></TextField>
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              }
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
