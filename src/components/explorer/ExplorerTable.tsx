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
  Link,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import useSWR from "swr";
import { fetchData, fetchDataProps } from "../../requests/http";
import { GlobalProgressAtom } from "../../store/recoilStore";
import { formatBytes } from "../../utils";
import { TableDjango } from "../DjangoTable";
import EnhancedTableToolbar from "./ExplorerTableToolBar";
import FileMenu from "./FileMenu";
//import CreateDatabaseDialog from "./CreateDatabaseDialog";

// const CreateDatabaseDialog = React.lazy(() => import("./CreateDatabaseDialog"));

const MAIN = "fileBrowser";
const ITEM = "null";
const LABEL = "layout.explorer";

interface IFItem {
  path: string;
  directory: string;
  filename: any;
  inode: number;
  uid: number;
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
      key: "mode",
      numeric: true,
      disablePadding: false,
      label: t("exploprer.mode"),
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
  const [rowsState, setRowsState] = useState<any>([]);

  const [selected, setSelected] = useState<readonly string[]>([]);
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string | React.ReactNode;
    content: string | React.ReactNode;
  }>({
    open: false,
    title: "",
    content: "",
  });

  const handleClose = () => {
    setAlertDialog({ ...alertDialog, open: false });
  };

  const requestDelete = async () => {
    for (let i = 0; i < selected.length; i++) {
      console.log(selected[i]);

      // let fetchDataProps: fetchDataProps = {
      //   apiType: ITEM,
      //   init: {
      //     method: "delete",
      //   },
      //   params: {
      //     pathParam: {
      //       id: selected[i],
      //     },
      //   },
      // };
      // await fetchData(fetchDataProps);
    }
    setUpdateState(updateState + 1);
    setAlertDialog({ ...alertDialog, open: false });
  };

  const handleAction = (action: string) => {
    if (action == "delete") {
      setAlertDialog({
        open: true,
        title: `Delete`,
        content: (
          <div className="pt-2">
            <div>{t("database.are-you-sure-to-delete-the-databse")}</div>
            <ul>
              {rowsState
                // @ts-ignore
                .filter((row) => {
                  return selected.includes(row.id.toString());
                })
                // @ts-ignore
                .map((row) => (
                  <li key={row.id}>{row.name}</li>
                ))}
            </ul>
          </div>
        ),
      });
    } else if (action == "reload") {
      setUpdateState(updateState + 1);
    }
  };

  //const { data, error } = useSWR();

  const history = useRef<string[]>([]);
  const [searchParams] = useSearchParams();

  const [fetchDataProps, setFetchDataProps] = useState<fetchDataProps>({
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

  const setCurrentDirectory = (directory: string) => {
    setFetchDataProps({
      apiType: MAIN,
      params: {
        pathParam: {
          action: "query",
        },
        searchParam: {
          directory: directory,
        },
      },
    });
  };

  const getCurrentDirectory = () => {
    let directory = "/" + history.current.join("/") + "/";
    return directory;
  };

  const enterDirectory = () => {
    setCurrentDirectory(getCurrentDirectory());
  };

  const handleBreadcrumbClick = (i: number) => {
    let onSelecctPath = "/" + history.current.slice(0, i + 1).join("/");

    history.current = onSelecctPath.split("/").filter((x) => x);
    setCurrentDirectory(onSelecctPath);
  };

  const { mutate } = useSWR(fetchDataProps, (props) => {
    setGlobalProgress(true);
    setSelected([]);
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
                      history.current.push(row.filename);
                      enterDirectory();
                    }
                  }}>
                  {row.type == "directory" ? (
                    <FolderIcon></FolderIcon>
                  ) : (
                    <TextSnippetIcon></TextSnippetIcon>
                  )}
                  <div> {row.filename}</div>
                </div>
                <div
                  className="invisible group-hover:visible"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}>
                  {row.type == "regular" && (
                    <FileMenu
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
            return row;
          })
        );
      })
      .finally(() => {
        setGlobalProgress(false);
      });
  });

  useEffect(() => {
    setSelected([]);
    mutate();
  }, [updateState]);

  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          className="cursor-pointer "
          onClick={(e) => {
            setCurrentDirectory("/");
            history.current = [];
          }}>
          <HomeIcon />
        </Link>
        {history.current.map((h, i) => (
          <Link
            underline="hover"
            color="inherit"
            className="cursor-pointer "
            onClick={() => {
              handleBreadcrumbClick(i);
            }}>
            {h}
          </Link>
        ))}
      </Breadcrumbs>
      <Dialog open={alertDialog.open} onClose={handleClose}>
        <DialogTitle
          bgcolor={(theme) => theme.palette.primary.main}
          color={(theme) => theme.palette.text.disabled}>
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
            onClick={requestDelete}
            autoFocus>
            {t("yes")}
          </Button>
        </DialogActions>
      </Dialog>
      <TableDjango
        dense
        onAction={handleAction}
        enhancedTableToolbar={EnhancedTableToolbar}
        selectedState={[selected, setSelected]}
        rows={rowsState}
        headCells={headCells}
        title={LABEL}
        maxHeight={"calc(100vh - 180px)"}
      />
    </div>
  );
}
