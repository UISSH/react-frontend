import DoneIcon from "@mui/icons-material/Done";
import FolderIcon from "@mui/icons-material/Folder";
import HomeIcon from "@mui/icons-material/Home";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Link,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import useSWR from "swr";
import { fetchData, fetchDataProps, requestData } from "../../requests/http";
import { GlobalProgressAtom } from "../../store/recoilStore";
import { formatBytes } from "../../utils";
import { TableDjango } from "../DjangoTable";
import DropFileUpload from "../DropFileUpload";
import EnhancedTableToolbar from "./ExplorerTableToolBar";
import FileMenu from "./FileMenu";
import FolderMenu from "./FolderMenu";
import { PureFunctionContext } from "../../Context";

const MAIN = "fileBrowser";

const LABEL = "layout.explorer";

interface IFItem {
  path: string;
  directory: string;
  filename: any;
  inode: number;
  uid: number | string;
  gid: number;
  mode: string;
  device: number;
  size: any;
  block_size: number;
  atime: number;
  mtime: number;
  ctime: number;
  btime: number;
  symlink: number;
  type: "directory" | "regular" | string;
  [name: string]: any;
}

export const UpdateExplorerTableUISignal = atom({
  key: "UpdateExplorerTableUISignal", // unique ID (with respect to other atoms/selectors)
  default: 1, // default value (aka initial value)
});

export default function Index({ className }: { className?: string }) {
  const [t] = useTranslation();
  const headCells = [
    {
      key: "name",
      numeric: false,
      disablePadding: true,
      label: t("exploprer.filename"),
    },
    {
      key: "owner",
      numeric: true,
      disablePadding: false,
      label: t("exploprer.owner"),
    },
    {
      key: "group",
      numeric: true,
      disablePadding: false,
      label: t("exploprer.group"),
    },
    {
      key: "mode",
      numeric: true,
      disablePadding: false,
      label: t("exploprer.mode"),
    },
    {
      key: "ctime",
      numeric: true,
      disablePadding: false,
      label: t("exploprer.ctime"),
    },
    {
      key: "size",
      numeric: true,
      disablePadding: false,
      label: t("exploprer.size"),
    },
  ];
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const [updateState, setUpdateState] = useRecoilState(
    UpdateExplorerTableUISignal
  );
  const [rowsState, setRowsState] =
    useState<(IFItem & { id: number; name: string })[]>();
  const [pathInputShow, setPathInputShow] = useState<boolean>(false);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string | React.ReactNode;
    content: string | React.ReactNode;
    records: string[];
  }>({
    open: false,
    title: "",
    content: "",
    records: [],
  });
  const history = useRef<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPath, setCurrentPath] = useState<string | null>(
    searchParams.get("directory")
  );
  const [fetchDataProps, setFetchDataProps] = useState<fetchDataProps>();
  const uidArray = useRef<{ [x: string]: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    setAlertDialog({ ...alertDialog, open: false });
  };

  const requestDelete = async (fileName: string[]) => {
    let cmd = "rm -rf " + fileName.join(" ");

    requestData({
      url: "/api/FileBrowser/cmd/",
      method: "POST",
      data: {
        operation_command: cmd,
        current_directory: getCurrentDirectory(),
      },
    }).then((res) => {
      if (res.ok) {
        setUpdateState(updateState + 1);
        setAlertDialog({ ...alertDialog, open: false });
        enqueueSnackbar(t("success"), { variant: "success" });
      } else {
        enqueueSnackbar(t("failed"), { variant: "error" });
      }
    });
  };

  const handleAction = (action: string) => {
    if (action == "delete") {
      setAlertDialog({
        open: true,
        title: `Delete`,
        content: (
          <div className="pt-2">
            <div>
              {t("exploprer.Are-you-sure-to-delete-the-following-files")}
            </div>
            <ul>
              {rowsState &&
                rowsState
                  .filter((row) => {
                    return selected.includes(row.id.toString());
                  })
                  .map((row) => <li key={row.id}>{row.name}</li>)}
            </ul>
          </div>
        ),
        records: rowsState
          ? rowsState
              .filter((row) => {
                return selected.includes(row.id.toString());
              })
              .map((row) => row.filename)
          : [],
      });
    } else if (action == "reload") {
      setUpdateState(updateState + 1);
    }
  };

  //const { data, error } = useSWR();

  const getCurrentDirectory = () => {
    let directory = searchParams.get("directory") + "/" || "/";
    directory = directory.replace(/\/\//g, "/");
    return directory;
  };

  const handleBreadcrumbClick = (i: number) => {
    let onSelecctPath = "/" + history.current.slice(0, i + 1).join("/");

    history.current = onSelecctPath.split("/").filter((x) => x);

    setSearchParams({
      directory: onSelecctPath,
    });
  };
  useEffect(() => {
    if (searchParams.get("directory")) {
      setFetchDataProps({
        apiType: MAIN,
        params: {
          pathParam: {
            action: "query",
          },
          searchParam: {
            directory: searchParams.get("directory") || "/",
          },
        },
      });
    } else {
      setSearchParams({
        directory: "/",
      });
    }
  }, [searchParams]);

  const { mutate } = useSWR(fetchDataProps, async (props) => {
    if (fetchDataProps == undefined) return;
    setGlobalProgress(true);
    setSelected([]);
    if (!uidArray.current) {
      let uidData = await requestData({
        url: "/api/FileBrowser/get_users/",
      }).then((res) => res.json());

      let _uidArray: { [x: string]: string } = {};
      uidData.forEach((x: { uid: string; username: string }) => {
        _uidArray[x.uid] = x.username;
      });
      uidArray.current = _uidArray;
    }
    fetchData(fetchDataProps)
      .then((res) => res.json())
      .then((res) => {
        let c = 0;
        setRowsState(
          res.map((row: IFItem & { id: number }) => {
            row["id"] = c++;
            row.name = (
              <div className="cursor-pointer flex gap-1 justify-between items-center ">
                <div
                  className=" flex gap-1 items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (row.type == "directory") {
                      setCurrentPath(getCurrentDirectory() + row.filename);
                      setSearchParams({
                        directory: getCurrentDirectory() + row.filename,
                      });
                    } else {
                      navigate(`/dash/editor/`, {
                        state: {
                          type: "vim",
                          path: getCurrentDirectory() + row.filename,
                        },
                      });
                    }
                  }}>
                  {row.type == "directory" ? (
                    <FolderIcon></FolderIcon>
                  ) : (
                    <TextSnippetIcon></TextSnippetIcon>
                  )}
                  <div> {row.filename}</div>
                </div>
                <div className="invisible group-hover:visible">
                  {row.type == "regular" ? (
                    <FileMenu
                      id={row["id"]}
                      name={row.filename}
                      directory={getCurrentDirectory()}
                      path={getCurrentDirectory() + row.filename}
                    />
                  ) : (
                    <FolderMenu
                      id={row["id"]}
                      name={row.filename}
                      directory={getCurrentDirectory()}
                      path={getCurrentDirectory() + row.filename}
                    />
                  )}
                </div>
              </div>
            );
            if (row.type == "regular") {
              row.size = formatBytes(row.size);
            } else {
              row.size = "-";
            }

            row.ctime = new Date(
              row.ctime * 1000
            ).toLocaleString() as unknown as number;

            row.owner = uidArray.current ? uidArray.current[row.uid] : row.uid;
            row.group = uidArray.current ? uidArray.current[row.gid] : row.gid;
            return row;
          })
        );
      })
      .finally(() => {
        if (fetchDataProps.params?.searchParam) {
          history.current =
            fetchDataProps.params.searchParam.directory.split("/");
          history.current = history.current.filter((x) => x);
        }
        setGlobalProgress(false);
      });
  });

  useEffect(() => {
    setSelected([]);
    mutate();
  }, [updateState]);

  return (
    <PureFunctionContext.Provider
      value={() => {
        setUpdateState(updateState + 1);
      }}>
      <DropFileUpload
        requestDataProps={{
          url: "/api/FileBrowser/upload_file/",
          method: "POST",
          params: {
            directory: getCurrentDirectory(),
          },
        }}>
        {pathInputShow ? (
          <div className="p-2">
            <TextField
              size="small"
              value={currentPath ? currentPath : "/"}
              autoFocus
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={(
                        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => {
                        setPathInputShow(false);
                        setSearchParams({
                          directory: currentPath as string,
                        });
                      }}>
                      <DoneIcon></DoneIcon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onBlur={(
                e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                setTimeout(() => {
                  setPathInputShow(false);
                }, 100);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key == "Enter") {
                  setPathInputShow(false);
                  setSearchParams({
                    directory: currentPath as string,
                  });
                }
              }}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                setCurrentPath(e.target.value);
              }}></TextField>
          </div>
        ) : (
          <div className="flex justify-between">
            <Breadcrumbs
              onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                setPathInputShow(true);
              }}
              aria-label="breadcrumb"
              className="p-2 cursor-pointer pr-20 ">
              <Link
                underline="hover"
                color="inherit"
                className="cursor-pointer "
                onClick={(
                  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                ) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSearchParams({
                    directory: "/",
                  });
                  history.current = [];
                }}>
                <HomeIcon />
              </Link>
              {history.current.map((h, i) => (
                <Link
                  key={i}
                  underline="hover"
                  color="inherit"
                  className="cursor-pointer "
                  onClick={(
                    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
                  ) => {
                    e.stopPropagation();
                    handleBreadcrumbClick(i);
                  }}>
                  {h}
                </Link>
              ))}
            </Breadcrumbs>
          </div>
        )}
        <Dialog open={alertDialog.open} onClose={handleClose}>
          <DialogTitle
            bgcolor={(theme: any) => theme.palette.primary.main}
            color={(theme: any) => theme.palette.text.disabled}>
            {alertDialog.title}
          </DialogTitle>
          <DialogContent>{alertDialog.content}</DialogContent>
          <DialogActions>
            <Button variant="contained" color="info" onClick={handleClose}>
              {t("no")}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={(e) => {
                requestDelete(alertDialog.records);
              }}
              autoFocus>
              {t("yes")}
            </Button>
          </DialogActions>
        </Dialog>
        {rowsState && (
          <TableDjango
            dense
            onAction={handleAction}
            enhancedTableToolbar={EnhancedTableToolbar}
            selectedState={[selected, setSelected]}
            rows={rowsState}
            headCells={headCells}
            title={LABEL}
            maxHeight={"calc(100vh - 160px)"}
          />
        )}
      </DropFileUpload>
    </PureFunctionContext.Provider>
  );
}
