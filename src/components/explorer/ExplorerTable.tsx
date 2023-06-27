import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { PureFunctionContext } from "../../Context";
import { requestData } from "../../requests/http";
import { formatBytes } from "../../utils";
import { TableDjango } from "../DjangoTable";
import LinearBuffer from "../LinearBuffer";
import ExplorerDropFileUpload from "./ExplorerDropFileUpload";
import EnhancedTableToolbar from "./ExplorerTableToolBar";
import ExplorerBreadcrumb from "./ExplorerBreadcrumb";
import ExplorerNameItem from "./ExplorerNameItem";

const LABEL = "layout.explorer";

interface ExplorerTableProps {
  className?: string;
  children?: React.ReactNode;
}

interface RowIF {
  id: number;
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

export default function ExplorerTable(props: ExplorerTableProps) {
  const [t] = useTranslation();
  const headCells = [
    {
      key: "name",
      numeric: false,
      disablePadding: true,
      label: t("exploprer.filename"),
    },
    {
      key: "user_owner",
      numeric: true,
      disablePadding: false,
      label: t("exploprer.owner"),
    },
    {
      key: "user_group",
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

  const [paginationState, setPaginationState] = useState();
  const [pageState, setPageState] = useState(1);
  const [orederState, setOrederState] = useState("-id");
  const [pageSizeState, setPageSizeState] = useState(5);
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
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
  const handleAction = (action: string) => {
    if (action == "delete") {
      if (data == undefined || data.length == 0) {
        enqueueSnackbar(t("exploprer.Please-select-at-least-one-file"), {
          variant: "error",
        });
        return;
      }
      setAlertDialog({
        open: true,
        title: `Delete`,
        content: (
          <div className="pt-2">
            <div>
              {t("exploprer.Are-you-sure-to-delete-the-following-files")}
            </div>
            <ul>
              {data
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
          .filter((row) => {
            return selected.includes(row.id.toString());
          })
          .map((row) => row.filename),
      });
    } else if (action === "reload") {
      mutate();
    }
  };
  const handleSetpageSize = (size: number) => {
    setPageSizeState(size);
    mutate();
  };

  const handleRequestSort = (order: string, property: any) => {
    setOrederState(order + property);
    mutate();
  };

  const uidArray = useRef<{ [x: string]: string }>();

  const transformRowData = (rows: RowIF[]) => {
    let id = 0;
    return rows.map((row) => {
      row.id = ++id;
      row.name = <ExplorerNameItem row={row} />;
      row.ctime = new Date((row.ctime as number) * 1000).toLocaleString();
      if (row.type == "regular") {
        row.size = formatBytes(row.size);
      } else {
        row.size = "-";
      }
      row.user_owner = uidArray.current ? uidArray.current[row.uid] : row.uid;
      row.user_group = uidArray.current ? uidArray.current[row.gid] : row.gid;
      return row;
    });
  };

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
    {
      url: "/api/FileBrowser/query/",
      method: "GET" as const,
      params: {
        directory: searchParams.get("directory") || "/",
      },
    },
    async (prop) => {
      if (uidArray.current == undefined) {
        await getUIDArray();
      }
      setSelected([]);
      let res = await requestData(prop);
      let resJson = await res.json();
      return transformRowData(resJson);
    }
  );

  const getCurrentDirectory = () => {
    let directory = searchParams.get("directory") + "/" || "/";
    directory = directory.replace(/\/\//g, "/");
    return directory;
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
        mutate();
        setAlertDialog({ ...alertDialog, open: false });
        enqueueSnackbar(t("success"), { variant: "success" });
      } else {
        enqueueSnackbar(t("failed"), { variant: "error" });
      }
    });
  };
  const handleSetTargetPage = (targetPage: number) => {
    setPageState(targetPage);
    mutate();
  };
  if (isLoading || !data) {
    return <LinearBuffer></LinearBuffer>;
  }

  return (
    <>
      <PureFunctionContext.Provider value={mutate}>
        <ExplorerDropFileUpload>
          <Dialog
            open={alertDialog.open}
            onClose={() => setAlertDialog({ ...alertDialog, open: false })}
          >
            <DialogTitle
              bgcolor={(theme: any) => theme.palette.primary.main}
              color={(theme: any) => theme.palette.text.disabled}
            >
              {alertDialog.title}
            </DialogTitle>
            <DialogContent>{alertDialog.content}</DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="info"
                onClick={() => setAlertDialog({ ...alertDialog, open: false })}
              >
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
          <ExplorerBreadcrumb></ExplorerBreadcrumb>
          <TableDjango
            onAction={handleAction}
            enhancedTableToolbar={EnhancedTableToolbar}
            selectedState={[selected, setSelected]}
            onSetPageSize={handleSetpageSize}
            onRequestSort={handleRequestSort}
            onSetPage={handleSetTargetPage}
            rows={data}
            headCells={headCells}
            title={LABEL}
            pagination={paginationState}
          ></TableDjango>
        </ExplorerDropFileUpload>
      </PureFunctionContext.Provider>
    </>
  );
}
