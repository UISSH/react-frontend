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
import { Suspense, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { PureFunctionContext } from "../../Context";
import { requestData } from "../../requests/http";
import { GlobalProgressAtom } from "../../store/recoilStore";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";

const API_URL = "/api/Crontab/";

const LABEL = "layout.crontab";

interface RowIF {
  id: number;
  schedule: string;
  action: JSX.Element;
  shellscript: string;
  command: string;
  update_at: string | JSX.Element;
}
export interface CrontabTableProps {}

interface RequestDataProps {
  url: string;

  params: {
    page: string;
    ordering: string;
    page_size: string;
  };
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const onReloadTableData = useContext(PureFunctionContext);
  const { numSelected } = props;
  const [t] = useTranslation();
  const navigate = useNavigate();

  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
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
      <Suspense>
        {/* <CreateDatabaseDialog
            open={openDialog}
            setOpen={(open) => {
              setOpenDialog(open);
              handleReloadParent();
            }}></CreateDatabaseDialog> */}
      </Suspense>
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
        <ButtonGroup variant="contained">
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              navigate(`?action=update`);
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
          <IconButton
            className={globalProgress ? "animate-spin" : ""}
            color="primary"
            onClick={handleReloadParent}>
            <RefreshIcon />
          </IconButton>
        </ButtonGroup>
      </Toolbar>
    </>
  );
}
export default function CrontabTable(props: CrontabTableProps) {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const headCells = [
    {
      key: "schedule",
      numeric: false,
      disablePadding: true,
      label: "schedule",
    },
    {
      key: "command",
      numeric: true,
      disablePadding: false,
      label: "command",
    },
    {
      key: "update_at",
      numeric: true,
      disablePadding: false,
      label: "update_at",
    },
    {
      key: "action",
      numeric: true,
      disablePadding: false,
      label: "action",
    },
  ];
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const [updateState, setUpdateState] = useState(1);
  const [rowsState, setRowsState] = useState<RowIF[]>([]);
  const [paginationState, setPaginationState] = useState();
  const [pageState, setPageState] = useState(1);
  const [orederState, setOrederState] = useState("-id");
  const [pageSizeState, setPageSizeState] = useState(5);
  const [selected, setSelected] = useState<readonly string[]>([]);

  const handleAction = async (action: string) => {
    if (action === "reload") {
      setUpdateState(updateState + 1);
    }
    if (action === "delete") {
      if (selected.length > 0) {
        setGlobalProgress(true);
        for (let i = 0; i < selected.length; i++) {
          await requestData({
            url: API_URL + selected[i] + "/",
            method: "DELETE",
          });
        }
        setGlobalProgress(false);
        setUpdateState(updateState + 1);
      }
    }
  };
  const handleSetpageSize = (size: number) => {
    setPageSizeState(size);
    setUpdateState(updateState + 1);
  };

  const handleRequestSort = (order: string, property: any) => {
    setOrederState(order + property);
    setUpdateState(updateState + 1);
  };

  const transformRowData = (data: RowIF[]) => {
    return data.map((row) => {
      row.action = (
        <Button
          variant="contained"
          size="small"
          className="lowercase"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            navigate(`?action=update`, {
              state: {
                id: row.id,
                schedule: row.schedule,
                command: row.command,
                shellscript: row.shellscript,
              },
            });
          }}>
          editor
        </Button>
      );
      row.update_at = new Date(row.update_at as string).toLocaleString();
      return row;
    });
  };

  const { mutate, data } = useSWR<any>(
    {
      url: API_URL,
      params: {
        page: String(pageState),
        ordering: orederState,
        page_size: String(pageSizeState),
      },
    },
    async (props) => {
      setGlobalProgress(true);
      let data = await requestData(props);
      if (data.ok) {
        let res = await data.json();
        res = res as any;
        setRowsState(transformRowData(res.results));
        setPaginationState(res.pagination);
        setGlobalProgress(false);
        return res;
      } else {
        setGlobalProgress(false);
      }
    }
  );

  const handleSetTargetPage = (targetPage: number) => {
    setPageState(targetPage);
    setUpdateState(updateState + 1);
  };

  useEffect(() => {
    setSelected([]);
    mutate();
  }, [updateState]);

  return (
    <>
      <PureFunctionContext.Provider value={mutate}>
        <TableDjango
          onAction={handleAction}
          enhancedTableToolbar={EnhancedTableToolbar}
          selectedState={[selected, setSelected]}
          onSetPageSize={handleSetpageSize}
          onRequestSort={handleRequestSort}
          onSetPage={handleSetTargetPage}
          rows={rowsState}
          headCells={headCells}
          title={LABEL}
          pagination={paginationState}></TableDjango>
      </PureFunctionContext.Provider>
    </>
  );
}
