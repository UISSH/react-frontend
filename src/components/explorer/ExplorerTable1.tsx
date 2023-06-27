import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { PureFunctionContext } from "../../Context";
import { requestData } from "../../requests/http";
import {
  GlobalProgressAtom,
  UpdateExplorerTableUISignalAtom,
} from "../../store/recoilStore";
import { formatBytes } from "../../utils";
import { TableDjango } from "../DjangoTable";
import ExplorerDropFileUpload from "./ExplorerDropFileUpload";
import EnhancedTableToolbar from "./ExplorerTableToolBar";

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
  ctime: number | string;
  btime: number;
  symlink: number;
  type: "directory" | "regular" | string;
  [name: string]: any;
}

type ItemListIF = (IFItem & { id: number; name: string })[];

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
    UpdateExplorerTableUISignalAtom
  );

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
  const [searchParams, setSearchParams] = useSearchParams();

  const uidArray = useRef<{ [x: string]: string }>();
  const { enqueueSnackbar } = useSnackbar();

  const getUIDArray = async () => {
    let uidData = await requestData({
      url: "/api/FileBrowser/get_users/",
    }).then((res) => res.json());

    let _uidArray: { [x: string]: string } = {};
    uidData.forEach((x: { uid: string; username: string }) => {
      _uidArray[x.uid] = x.username;
    });
    uidArray.current = _uidArray;
  };

  const { data, mutate, error, isLoading } = useSWR(
    "/api/FileBrowser/query/",
    async (url) => {
      if (uidArray.current == undefined) {
        await getUIDArray();
      }
      setGlobalProgress(true);
      setSelected([]);
      let res = await requestData({
        url: url,
        method: "GET",
        params: {
          directory: searchParams.get("directory") || "/",
        },
      });

      let resJson = await res.json();

      setGlobalProgress(false);

      return resJson;
    }
  );

  const getItemData = useMemo<ItemListIF>(() => {
    if (!data) return [];
    let c = 0;
    return data.map((row: IFItem) => {
      c++;
      row.id = c;
      row.name = row.filename;
      if (row.type == "regular") {
        row.size = formatBytes(row.size);
      } else {
        row.size = "-";
      }
      row.ctime = new Date((row.ctime as number) * 1000).toLocaleString();

      row.owner = uidArray.current ? uidArray.current[row.uid] : row.uid;
      row.group = uidArray.current ? uidArray.current[row.gid] : row.gid;
      return row;
    });
  }, [data]);

  if (error) {
    console.log(error);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              {getItemData
                .filter((row) => {
                  return selected.includes(row.id.toString());
                })
                .map((row) => (
                  <li key={row.id}>{row.name}</li>
                ))}
            </ul>
          </div>
        ),
        records: data
          ? getItemData
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

  const getCurrentDirectory = () => {
    let directory = searchParams.get("directory") + "/" || "/";
    directory = directory.replace(/\/\//g, "/");
    return directory;
  };

  useEffect(() => {
    setSelected([]);
    mutate();
  }, [searchParams]);

  return (
    <PureFunctionContext.Provider
      value={() => {
        setUpdateState(updateState + 1);
      }}
    >
      <ExplorerDropFileUpload>
        <Dialog open={alertDialog.open} onClose={handleClose}>
          <DialogTitle
            bgcolor={(theme: any) => theme.palette.primary.main}
            color={(theme: any) => theme.palette.text.disabled}
          >
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
              autoFocus
            >
              {t("yes")}
            </Button>
          </DialogActions>
        </Dialog>
        {data && (
          <TableDjango
            dense
            onAction={handleAction}
            enhancedTableToolbar={EnhancedTableToolbar}
            selectedState={[selected, setSelected]}
            rows={getItemData}
            headCells={headCells}
            title={LABEL}
            maxHeight={"calc(100vh - 160px)"}
          />
        )}
      </ExplorerDropFileUpload>
    </PureFunctionContext.Provider>
  );
}
