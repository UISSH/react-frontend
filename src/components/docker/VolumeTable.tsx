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
import { requestOsqueryData } from "../../requests/http";
import { formatBytes } from "../../utils";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
import LinearBuffer from "../LinearBuffer";
import { VolumeRowIF } from "./schema";

interface RowIF extends VolumeRowIF {
  id: number;
}

const LABEL = "docker.volume";

export interface VolumeTableProps {}

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
export default function ContainerTable(props: VolumeTableProps) {
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
      key: "driver",
      numeric: true,
      disablePadding: false,
      label: "driver",
    },
    {
      key: "mount_point",
      numeric: true,
      disablePadding: false,
      label: "mount_point",
    },
    {
      key: "type",
      numeric: true,
      disablePadding: false,
      label: "type",
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
    let c = 0;
    return data.map((row) => {
      row.id = ++c;
      row.nameJSX = <Button>{row.name}</Button>;
      return row;
    });
  };

  const { mutate, data, isLoading, error } = useSWR<RowIF[]>(
    "select * from docker_volumes;",
    async (sql) => {
      setSelected([]);
      let data = await requestOsqueryData(sql);
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
    console.log(error);
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