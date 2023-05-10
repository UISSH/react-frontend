import AddIcon from "@mui/icons-material/Add";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  alpha,
  Button,
  ButtonGroup,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { OperatingResIF } from "../../constant";
import { requestData } from "../../requests/http";
import { getApiGateway } from "../../requests/utils";
import { GlobalLoadingAtom, GlobalProgressAtom } from "../../store/recoilStore";
import { formatBytes } from "../../utils";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
const API_URL = "/api/FileBrowser/query/";

const LABEL = "database.backup";

interface RowIF {
  id: number;
  path: string;
  directory: string;
  filename: string;
  inode: string;
  uid: string;
  gid: string;
  mode: string;
  device: string;
  size: string | number;
  block_size: string;
  atime: string;
  mtime: string;
  ctime: number;
  btime: string;
  symlink: string;
  type: string;
  [x: string]: any;
}
export interface BackupTableProps {
  id: number;
  dbName: string;
}

interface RequestDataProps {
  url: string;
  params: {
    directory: string;
  };
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  const [t] = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const handleDelete = () => {
    if (props.onAction) {
      props.onAction("delete");
    }
  };

  const handleReloadParent = () => {
    if (props.onAction) {
      props.onAction("reload");
    }
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
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div">
            {numSelected} {t(LABEL)}
          </Typography>
        ) : (
          <Typography
            className="capitalize"
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div">
            {t(LABEL)}
          </Typography>
        )}
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group">
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              props.onAction && props.onAction("newBackup");
            }}>
            {t("add")}
          </Button>
          <Tooltip title={t("database.upload-backup-file")}>
            <IconButton
              color="primary"
              onClick={() => {
                props.onAction && props.onAction("uploadBackup");
              }}>
              <CloudUploadOutlinedIcon></CloudUploadOutlinedIcon>
            </IconButton>
          </Tooltip>
          <div className="px-2 gap-1 flex">
            <IconButton
              className={globalProgress ? "animate-spin" : ""}
              color="primary"
              onClick={handleReloadParent}>
              <RefreshIcon />
            </IconButton>
          </div>
        </ButtonGroup>
      </Toolbar>
    </>
  );
}
export default function BackupTable(props: BackupTableProps) {
  const [t] = useTranslation();
  const headCells = [
    {
      key: "filenameJSX",
      numeric: false,
      disablePadding: true,
      label: "filename",
    },
    {
      key: "pathJSX",
      numeric: true,
      disablePadding: false,
      label: "path",
    },
    {
      key: "size",
      numeric: true,
      disablePadding: false,
      label: "size",
    },
    {
      key: "ctime",
      numeric: true,
      disablePadding: false,
      label: "time",
    },
  ];

  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const [updateState, setUpdateState] = useState(1);
  const [rowsState, setRowsState] = useState<RowIF[]>([]);
  const [paginationState, setPaginationState] = useState();
  const [pageState, setPageState] = useState(1);
  const [orederState, setOrederState] = useState("-id");
  const [pageSizeState, setPageSizeState] = useState(5);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const navigate = useNavigate();
  const inputFile = useRef<HTMLInputElement | null>(null);
  const directory = "/var/db_backups/" + props.dbName;

  const handleUploadDatabaseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files && e.target.files[0];
    if (!file) return;
    setGlobalLoadingAtom(true);
    let formData = new FormData();
    formData.append("file", file);
    requestData({
      url: "/api/FileBrowser/upload_file/",
      method: "POST",
      params: {
        directory: directory,
      },
      data: formData,
    }).then((res) => {
      if (res.ok) {
        enqueueSnackbar(t("success"), {
          variant: "success",
        });
        setUpdateState(updateState + 1);
      } else {
        enqueueSnackbar(t("failed"), {
          variant: "error",
        });
      }
      setTimeout(() => {
        setGlobalLoadingAtom(false);
      }, 800);
    });
  };
  const handleAction = (action: string) => {
    if (action === "reload") {
      setUpdateState(updateState + 1);
    } else if (action === "delete") {
    } else if (action === "newBackup") {
      setGlobalLoadingAtom(true);
      requestData({
        url: `/api/DataBase/${props.id}/export_backup/`,
        method: "POST",
      }).then(async (res) => {
        setGlobalLoadingAtom(false);
        let resJson = (await res.json()) as OperatingResIF;
        if (res.ok && resJson.result.result_text == "SUCCESS") {
          enqueueSnackbar(t("database.backup-success"), {
            variant: "success",
          });
          setUpdateState(updateState + 1);
        } else {
          enqueueSnackbar(t("database.backup-fail"), {
            variant: "error",
          });
        }
        setTimeout(() => {
          setGlobalLoadingAtom(false);
        }, 800);
      });
    } else if (action === "uploadBackup") {
      inputFile.current && inputFile.current.click();
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
      directory: directory,
    },
  };

  const transformRowData = (data: RowIF[]) => {
    let id = 0;
    return data.map((row) => {
      row.id = id;
      row.filenameJSX = (
        <div className="flex gap-1 items-center">
          <div> {row.filename}</div>
          <Tooltip title={t("database.restore-backup")}>
            <IconButton
              color="secondary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setGlobalLoadingAtom(true);
                requestData({
                  url: `/api/DataBase/${props.id}/import_backup/`,
                  method: "POST",
                  params: {
                    path: row.path,
                  },
                }).then(async (res) => {
                  let resJson = (await res.json()) as OperatingResIF;
                  if (res.ok && resJson.result.result_text == "SUCCESS") {
                    enqueueSnackbar(t("database.restore-backup-success"), {
                      variant: "success",
                    });
                  } else {
                    enqueueSnackbar(t("database.restore-backup-failed"), {
                      variant: "error",
                    });
                  }
                  setTimeout(() => {
                    setGlobalLoadingAtom(false);
                  }, 500);
                });
              }}>
              <RestoreIcon></RestoreIcon>
            </IconButton>
          </Tooltip>
        </div>
      );
      row.size = formatBytes(row.size as number);
      row.pathJSX = (
        <div className="flex justify-end items-center">
          <IconButton
            size="small"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              let folderArray = row.path.split("/");
              folderArray.pop();
              let folder = folderArray.join("/");
              navigate(`/dash/explorer/?directory=${folder}`);
            }}>
            <FolderOpenIcon></FolderOpenIcon>
          </IconButton>
          <Tooltip title={t("download")}>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                requestData({
                  url: "/api/FileBrowser/request_download_file/",
                  params: {
                    path: row.path,
                  },
                }).then(async (res) => {
                  if (res.ok) {
                    let apiUrl = getApiGateway();
                    let resJson = await res.json();
                    let url =
                      apiUrl +
                      `/api/FileBrowser/download_file/?path=${row.path}&token=${resJson.msg}`;
                    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                      window.open(url, "_blank");
                    } else {
                      window.location.href = url;
                    }
                  }
                });
              }}
              className="cursor-pointer hover:opacity-95">
              {row.path}
            </div>
          </Tooltip>
        </div>
      );
      row.ctime = new Date(
        row.ctime * 1000
      ).toLocaleString() as unknown as number;
      id++;
      return row;
    });
  };

  const { mutate } = useSWR(requestDataProps, (props) => {
    setGlobalProgress(true);
    requestData(props)
      .then((res) => res.json())
      .then((data) => {
        setRowsState(transformRowData(data));
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
      <input
        type="file"
        id="file"
        ref={inputFile}
        onChange={handleUploadDatabaseFile}
        accept=".sql,.sql.gz"
        style={{ display: "none" }}
      />

      <TableDjango
        maxHeight={"calc(100vh - 180px)"}
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
    </>
  );
}
