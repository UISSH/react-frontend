import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import RefreshIcon from "@mui/icons-material/Refresh";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import SyncIcon from "@mui/icons-material/Sync";
import TerminalIcon from '@mui/icons-material/Terminal';
import {
  alpha,
  Button,
  ButtonGroup,
  ContainerProps,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { PureFunctionContext } from "../../Context";
import { requestData } from "../../requests/http";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
import LinearBuffer from "../LinearBuffer";
import TerminalLocalSerssionDialog from "../terminal/TerminalLocalSerssionDialog";
import { ContainerInspectDialog } from "./ContainerInspectDialog";
import ContainerLogs from "./ContainerLog";
import ContainerPort from "./ContainerPort";
import { ContainerIF } from "./schema";

import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContainerStatsDialog from "./ContainerStatsDialog";

function ChartSimpleIcon() {
  return <FontAwesomeIcon icon={faChartSimple} />;
}

const LABEL = "docker.container";


interface DialogState {
  open: boolean;
  containerId: string;
}



export interface ContainerTableProps { }

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const onReloadTableData = useContext(PureFunctionContext);

  const { numSelected, selected } = props;
  const [t] = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = () => {
    if (props.onAction) {
      props.onAction("delete");
    }
  };

  const handleReloadParent = () => {
    onReloadTableData && onReloadTableData();
  };

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 50%" }}
            color="inherit"
            variant="subtitle1"
            component="div">
            {numSelected} {t(LABEL)}
          </Typography>
        ) : (
          <Typography
            className="capitalize"
            sx={{ flex: "1 1 50%" }}
            variant="h6"
            id="tableTitle"
            component="div">
            {t(LABEL)}
          </Typography>
        )}
        <ButtonGroup
          className="flex-nowarp bg-white"
          variant="contained"
          aria-label="outlined primary button group">

          {numSelected == 1 && (
            <ButtonGroup
              className="flex-nowarp bg-white"
              variant="contained"
              color="inherit">
              <div className="px-2 gap-1 flex">
                <Tooltip title={"turn on"}>
                  <IconButton
                    onClick={() => {
                      props.onAction && props.onAction("start");
                    }}>
                    <PlayCircleFilledIcon color="primary"></PlayCircleFilledIcon>
                  </IconButton>
                </Tooltip>
                <Tooltip title={"turn off"}>
                  <IconButton
                    onClick={() => {
                      props.onAction && props.onAction("stop");
                    }}>
                    <StopCircleIcon color="primary"></StopCircleIcon>
                  </IconButton>
                </Tooltip>

                <Tooltip title="restart">
                  <IconButton
                    onClick={() => {
                      props.onAction && props.onAction("restart");
                    }}>
                    <SyncIcon color="primary"></SyncIcon>
                  </IconButton>
                </Tooltip>
              </div>
            </ButtonGroup>
          )}
          {numSelected > 0 ? (
            <Button
              color="error"
              className="flex flex-nowrap"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}>
              <div className="whitespace-nowrap">{t("common.delete")}</div>
            </Button>
          ) : (
            <div></div>
          )}
          <div className="px-2 gap-1 flex">
            <IconButton color="primary" onClick={handleReloadParent}>
              <RefreshIcon />
            </IconButton>
          </div>
        </ButtonGroup>
      </Toolbar>
    </>
  );
}
export default function ContainerTable(props: ContainerProps) {
  const [t] = useTranslation();
  const headCells = [
    {
      key: "id_name",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      key: "name",
      numeric: true,
      disablePadding: false,
      label: "name",
    },

    {
      key: "image",
      numeric: true,
      disablePadding: false,
      label: "image",
    },
    {
      key: "state",
      numeric: true,
      disablePadding: false,
      label: "state",
    },
    {
      key: "port",
      numeric: true,
      disablePadding: false,
      label: "port",
    },
    {
      key: "status",
      numeric: true,
      disablePadding: false,
      label: "status",
    },
    {
      key: "created",
      numeric: true,
      disablePadding: false,
      label: "created",
    },
  ];



  const { enqueueSnackbar } = useSnackbar();

  const [logsDialog, setLogsDialog] = useState<DialogState>({ open: false, containerId: "" })

  const [containerInspectDialog, setContainerInspectDialog] = useState<DialogState>({ open: false, containerId: "" })

  const [terminalDialog, setTerminalDialog] = useState<DialogState>({ open: false, containerId: "" })

  const [containerStats, setContainerStats] = useState<DialogState>({ open: false, containerId: "" })

  const [selected, setSelected] = useState<readonly string[]>([]);
  const executeCommand = async (command: string) => {
    let data = {
      url: "/api/Operating/excute_command_sync/",
      method: "POST" as const,
      data: {
        command: command,
        cwd: "/tmp/",
      },
    };
    let res = await requestData(data);

    if (!res.ok) {
      enqueueSnackbar(res.status, { variant: "error" });
    }

    let resJson = await res.json();
    if (resJson.result.result_text === "SUCCESS") {
      enqueueSnackbar("success", { variant: "success" });
    } else {
      enqueueSnackbar(resJson.msg, { variant: "error" });
    }
  };

  const handleResetDialog = (setFN: Dispatch<SetStateAction<DialogState>>) => {
    setFN({ open: false, containerId: "" })
  }

  const handleAction = async (action: string) => {
    if (action === "reload") {
      mutate();
    }
    if (action === "start") {
      for (let i = 0; i < selected.length; i++) {
        await executeCommand(`docker start ${selected[i]}`);
      }
    } else if (action === "stop") {
      for (let i = 0; i < selected.length; i++) {
        await executeCommand(`docker stop ${selected[i]}`);
      }
    } else if (action === "restart") {
      for (let i = 0; i < selected.length; i++) {
        await executeCommand(`docker restart ${selected[i]}`);
      }
    } else if (action === "delete") {
      for (let i = 0; i < selected.length; i++) {
        await executeCommand(`docker rm ${selected[i]} --force`);
      }
    }
    mutate();
  };

  const transformRowData = (data: ContainerIF[]) => {
    return data.map((row) => {
      row.name = row.names.pop()?.replace("/", "") || "";
      row.name = (
        <div className="flex  flex-nowrap gap-1 items-center justify-end">
          <div>{row.name}</div>

          <IconButton disabled={
            row.state === "running" ? false : true
          } color="primary" onClick={(e) => {
            e.stopPropagation()
            setTerminalDialog({
              open: true,
              containerId: row.id
            })
          }}>
            <TerminalIcon ></TerminalIcon>
          </IconButton>


        </div>
      )
      row.id_name = (
        <div className="flex  flex-nowrap gap-1">
          <Tooltip title={row.id}>
            <Button onClick={(e) => {
              e.stopPropagation()
              setContainerInspectDialog({
                open: true,
                containerId: row.id
              })
            }}>{row.id.slice(0, 12)}</Button>
          </Tooltip>

        </div>
      );
      row.state = (
        <div className="flex  flex-nowrap gap-1 items-center justify-end">
          <div>{row.state}</div>


          <Button className="capitalize" size="small" variant="contained" onClick={(e) => {
            e.stopPropagation()
            setLogsDialog({
              open: true,
              containerId: row.id
            })
          }}>
            Logs
          </Button>

          <Tooltip title="view container stats">
            <IconButton color="primary" onClick={(e) => {
              e.stopPropagation()
              setContainerStats({
                open: true,
                containerId: row.id
              })
            }}>
              <ChartSimpleIcon></ChartSimpleIcon>
            </IconButton></Tooltip>
        </div>

      )
      row.port = <ContainerPort row={row}></ContainerPort>;
      row.created = new Date((row.created as number) * 1000).toLocaleString();
      return row;
    });
  };

  const { mutate, data, isLoading, error } = useSWR<ContainerIF[]>(
    "/api/DockerContainer/",
    async (url) => {
      setSelected([]);
      let data = await requestData({
        url: url,
        method: "GET",
      });
      if (data.ok) {
        let res = await data.json();
        return transformRowData(res.results);
      } else {
        enqueueSnackbar(t("common.error"), {
          variant: "error",
        });
        return [];
      }
    }
  );

  if (error) {
    let msg =
      "oops, something went wrong! please open the console to see the error message";
    enqueueSnackbar(msg, {
      variant: "error",
    });
  }

  const handleSetTargetPage = (targetPage: number) => {
    mutate();
  };

  if (isLoading || !data) {
    return <LinearBuffer></LinearBuffer>;
  }
  return (
    <>
      <PureFunctionContext.Provider value={mutate}>

        {terminalDialog.containerId &&
          <TerminalLocalSerssionDialog
            containerId={terminalDialog.containerId}
            open={terminalDialog.open}
            onClose={() => handleResetDialog(setTerminalDialog)}
            cmd={"docker exec -it " + terminalDialog.containerId + " /bin/sh"}
          />}

        {logsDialog.containerId &&
          <ContainerLogs
            containerId={logsDialog.containerId}
            open={logsDialog.open}
            onClose={() => handleResetDialog(setLogsDialog)}
          />
        }

        {containerInspectDialog.containerId &&
          <ContainerInspectDialog
            containerId={containerInspectDialog.containerId}
            open={containerInspectDialog.open}
            onClose={() => handleResetDialog(setContainerInspectDialog)}
          />
        }

        {containerStats.containerId &&
          <ContainerStatsDialog
            containerId={containerStats.containerId}
            open={containerStats.open}
            onClose={() => handleResetDialog(setContainerStats)}
          />}

        <TableDjango
          onAction={handleAction}
          enhancedTableToolbar={EnhancedTableToolbar}
          selectedState={[selected, setSelected]}
          onSetPage={handleSetTargetPage}
          rows={data}
          headCells={headCells}
          title={LABEL}></TableDjango>
      </PureFunctionContext.Provider>
    </>
  );
}
