import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RefreshIcon from "@mui/icons-material/Refresh";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  alpha,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { fetchData, fetchDataProps } from "../../requests/http";
import { GlobalProgressAtom } from "../../store/recoilStore";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
//import CreateDatabaseDialog from "./CreateDatabaseDialog";

// const CreateDatabaseDialog = React.lazy(() => import("./CreateDatabaseDialog"));

const MAIN = "fileBrowser";
const ITEM = "databaseItem";
const LABEL = "layout.explorer";

interface IFItem {
  path: string;
  directory: string;
  filename: string;
  inode: number;
  uid: number;
  gid: number;
  mode: string;
  device: number;
  size: number;
  block_size: number;
  atime: number;
  mtime: number;
  ctime: number;
  btime: number;
  symlink: number;
  type: "directory" | "regular" | string;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
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
              setOpenDialog(true);
            }}>
            {t("add")}
          </Button>

          {numSelected > 0 ? (
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}>
              {t("delete")}
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

function PasswordField({
  password,
  readOnly,
}: {
  password: string;
  readOnly?: boolean;
}) {
  const [show, setShow] = React.useState(false);

  const handleClickShowPassword = (event: any) => {
    event.stopPropagation();
    setShow((state) => !state);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <OutlinedInput
      size="small"
      readOnly={readOnly}
      type={show ? "text" : "password"}
      value={password}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end">
            {show ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
}

export default function Index() {
  const [t] = useTranslation();
  const headCells = [
    {
      key: "filename",
      numeric: false,
      disablePadding: true,
      label: t("database.name"),
    },
  ];
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const [updateState, setUpdateState] = useState(1);
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
      let fetchDataProps: fetchDataProps = {
        apiType: ITEM,
        init: {
          method: "delete",
        },
        params: {
          pathParam: {
            id: selected[i],
          },
        },
      };
      await fetchData(fetchDataProps);
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

  let fetchDataProps: fetchDataProps = {
    apiType: MAIN,

    params: {
      pathParam: {
        action: "query",
      },
      searchParam: {
        directory: "/",
      },
    },
  };

  const { mutate } = useSWR(fetchDataProps, (props) => {
    setGlobalProgress(true);
    fetchData(fetchDataProps)
      .then((res) => res.json())
      .then((res) => {
        let c = 0;

        setRowsState(
          res.map((row: IFItem & { id: number }) => {
            row["id"] = c++;
            console.log(row);
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
      />
    </div>
  );
}
