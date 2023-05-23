import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  alpha,
  Button,
  ButtonGroup,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";

import { useSnackbar } from "notistack";
import { PureFunctionContext } from "../../Context";
import { requestData } from "../../requests/http";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
import LinearBuffer from "../LinearBuffer";

const LABEL = "layout.docker";

interface RowIF {
  cgroup_namespace: string;
  command: string;
  config_entrypoint: string;
  created: string;
  env_variables: string;
  finished_at: string;
  id: string;
  image: string;
  image_id: string;
  ipc_namespace: string;
  mnt_namespace: string;
  name: string;
  net_namespace: string;
  path: string;
  pid: string;
  pid_namespace: string;
  privileged: string;
  readonly_rootfs: string;
  security_options: string;
  started_at: string;
  state: string;
  status: string;
  user_namespace: string;
  uts_namespace: string;
}
export interface DemoTableProps {}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const onReloadTableData = useContext(PureFunctionContext);

  const { numSelected } = props;
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
          className="flex-nowarp"
          variant="contained"
          aria-label="outlined primary button group">
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenDialog(true);
            }}>
            {t("common.add")}
          </Button>

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
export default function DemoTable(props: DemoTableProps) {
  const [t] = useTranslation();
  const headCells = [
    {
      key: "id",
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
      key: "command",
      numeric: true,
      disablePadding: false,
      label: "command",
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

  const handleAction = (action: string) => {
    if (action === "reload") {
      mutate();
    }
  };

  const transformRowData = (data: RowIF[]) => {
    return data.map((row) => {
      row.id = row.id.slice(0, 12);
      return row;
    });
  };

  const { mutate, data, isLoading } = useSWR<RowIF[]>(
    {
      url: "/api/Operating/excute_command_sync/",
      method: "POST",
      data: {
        command: 'osqueryi "select * from docker_containers;" --json',
        cwd: "/tmp/",
      },
    },
    async (props) => {
      setSelected([]);
      let data = await requestData(props);
      if (data.ok) {
        let res = await data.json();

        res = JSON.parse(res.msg);

        return transformRowData(res);
      } else {
        enqueueSnackbar(t("common.error"), {
          variant: "error",
        });
        return [];
      }
    }
  );

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
