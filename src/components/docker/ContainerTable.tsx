import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import RefreshIcon from "@mui/icons-material/Refresh";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import SyncIcon from "@mui/icons-material/Sync";
import {
  alpha,
  Button,
  ButtonGroup,
  ContainerProps,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { PureFunctionContext } from "../../Context";
import { requestData } from "../../requests/http";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
import LinearBuffer from "../LinearBuffer";
import { ContainerIF, ContainersIF } from "./schema";
import ContainerPort from "./ContainerPort";
const LABEL = "docker.container";
export interface ContainerTableProps {}

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
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenDialog(true);
            }}>
            {t("common.add")}
          </Button>
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
      row.id_name = (
        <Tooltip title={row.id}>
          <Button>{row.id.slice(0, 12)}</Button>
        </Tooltip>
      );
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
