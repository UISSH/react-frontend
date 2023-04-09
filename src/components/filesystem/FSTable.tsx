import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import {
  Alert,
  alpha,
  Box,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { requestData } from "../../requests/http";
import { GlobalProgressAtom } from "../../store/recoilStore";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
import AddDialog from "./AddDialog";
import FTPServerStatus from "./FTPServerStatus";

const API_URL = "/api/FtpServer/";

const LABEL = "layout.filesystem";

interface RowIF {
  id: number;
  create_at: string;
  update_at: string;
  username: string;
  password: string;
  file_system: string;
  params: string;
}
export interface FSTableProps {}

interface RequestDataProps {
  url: string;
  params: {
    page: string;
    ordering: string;
    page_size: string;
  };
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  const [t] = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const [renderCount, setRenderCount] = useState(0);
  const [FTPServerStatusData, setFTPServerStatusData] = useState<{
    installed: boolean;
    run_status: boolean;
  }>({ installed: false, run_status: false });
  const handleDelete = () => {
    if (props.onAction) {
      props.onAction("delete");
    }
  };

  const handleReloadParent = () => {
    if (props.onAction) {
      props.onAction("reload");
      setRenderCount(renderCount + 1);
    }
  };

  const handleSyncAccount = () => {
    requestData({
      url: API_URL + "sync_account/",
      method: "POST",
    }).then((res) => {
      handleReloadParent();
    });
  };

  const handleControlFTPServer = () => {
    if (FTPServerStatusData.run_status) {
      setGlobalProgress(true);
      requestData({
        url: API_URL + "stop_service/",
        method: "POST",
      }).then((res) => {
        setGlobalProgress(false);
        handleReloadParent();
      });
    } else {
      setGlobalProgress(true);
      requestData({
        url: API_URL + "start_service/",
        method: "POST",
      }).then((res) => {
        setGlobalProgress(false);
        handleReloadParent();
      });
    }
  };
  return (
    <>
      <AddDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          handleReloadParent();
        }}></AddDialog>

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
        {
          <div className="flex flex-1 w-full">
            <Typography
              className={numSelected > 0 ? "visible" : "invisible  w-0 h-0"}
              sx={{ flex: numSelected > 0 ? "1 1 100%" : "0 0 0%" }}
              color="inherit"
              variant="subtitle1"
              component="div">
              {numSelected} {t(LABEL)}
            </Typography>

            <Box
              className={numSelected <= 0 ? "visible" : "invisible w-0 h-0"}
              sx={{ flex: numSelected <= 0 ? "1 1 100%" : "0 0 0%" }}>
              <FTPServerStatus
                renderCount={renderCount}
                onChange={(value) => {
                  setFTPServerStatusData(value);
                }}></FTPServerStatus>
            </Box>
          </div>
        }

        <div className=" bg-white">
          <ButtonGroup
            variant="contained"
            color="inherit"
            size="small"
            aria-label="outlined primary button group">
            <Tooltip title={t("add")}>
              <IconButton
                color="primary"
                onClick={() => {
                  setOpenDialog(true);
                }}>
                <AddIcon></AddIcon>
              </IconButton>
            </Tooltip>

            {numSelected > 0 ? (
              <Tooltip title={t("common.delete")}>
                <IconButton color="error" onClick={handleDelete}>
                  <DeleteIcon></DeleteIcon>
                </IconButton>
              </Tooltip>
            ) : (
              <div></div>
            )}
            <Tooltip title="sync">
              <IconButton onClick={handleSyncAccount}>
                <SyncIcon color="primary"></SyncIcon>
              </IconButton>
            </Tooltip>
            <Tooltip
              title={FTPServerStatusData.run_status ? "turn off" : "turn on"}>
              <IconButton onClick={handleControlFTPServer}>
                {FTPServerStatusData.run_status && (
                  <StopCircleIcon color="primary"></StopCircleIcon>
                )}

                {!FTPServerStatusData.run_status && (
                  <PlayCircleFilledIcon color="primary"></PlayCircleFilledIcon>
                )}
              </IconButton>
            </Tooltip>

            <IconButton
              className={globalProgress ? "animate-spin" : ""}
              color="primary"
              onClick={handleReloadParent}>
              <RefreshIcon />
            </IconButton>
          </ButtonGroup>
        </div>
      </Toolbar>
    </>
  );
}
export default function FSTable(props: FSTableProps) {
  const [t] = useTranslation();
  const headCells = [
    {
      key: "username",
      numeric: false,
      disablePadding: true,
      label: "Username",
    },
    {
      key: "password",
      numeric: true,
      disablePadding: false,
      label: "Password",
    },
    {
      key: "file_system",
      numeric: true,
      disablePadding: false,
      label: "File System",
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

  const handleAction = (action: string) => {
    if (action === "reload") {
      setUpdateState(updateState + 1);
    } else if (action === "delete") {
      setGlobalProgress(true);
      selected.forEach(async (id) => {
        await requestData({
          url: API_URL + id + "/",
          method: "DELETE",
        });
      });
      requestData({
        url: API_URL + "sync_account/",
        method: "POST",
      }).then((res) => {
        setUpdateState(updateState + 1);
        setGlobalProgress(false);
      });
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
  let requestDataProps: RequestDataProps = {
    url: API_URL,
    params: {
      page: String(pageState),
      ordering: orederState,
      page_size: String(pageSizeState),
    },
  };

  const transformRowData = (data: RowIF[]) => {
    return data.map((row) => {
      /* custom row field */
      /* row.password = (
              <PasswordField
                password={row.password}
                readOnly={true}></PasswordField>
            ); */
      /* custom row field */
      return row;
    });
  };

  const { mutate } = useSWR(requestDataProps, (props) => {
    setGlobalProgress(true);
    requestData(props)
      .then((res) => res.json())
      .then((data) => {
        setRowsState(transformRowData(data.results));
        setPaginationState(data.pagination);
      })
      .finally(() => {
        setGlobalProgress(false);
      });
  });

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

      <Alert severity="info">{t("filesystem.ftp-alert")}</Alert>
    </>
  );
}
