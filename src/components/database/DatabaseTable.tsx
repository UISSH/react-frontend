import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";

import DeleteIcon from "@mui/icons-material/Delete";
import {
  alpha,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { getfetch } from "../../requests/http";
import { GlobalProgressAtom } from "../../store/recoilStore";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
import CardDialog from "../CardDialog";

function CreateDatabaseDialog(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <>
      <CardDialog
        disableEscapeKeyDown
        open={props.open}
        onClose={() => props.setOpen(false)}>
        <DialogTitle></DialogTitle>
      </CardDialog>
    </>
  );
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
      <CreateDatabaseDialog
        open={openDialog}
        setOpen={(open) => {
          setOpenDialog(open);
          handleReloadParent();
        }}></CreateDatabaseDialog>
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
            {numSelected} {t("layout.database")}
          </Typography>
        ) : (
          <Typography
            className="capitalize"
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div">
            {t("layout.database")}
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

export default function Index() {
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
      label: t("database.name"),
    },
    {
      key: "username",
      numeric: true,
      disablePadding: false,
      label: t("database.username"),
    },
    {
      key: "password",
      numeric: true,
      disablePadding: false,
      label: t("database.password"),
    },
    {
      key: "create_status_text",
      numeric: true,
      disablePadding: false,
      label: t("database.status"),
    },
    {
      key: "database_type_text",
      numeric: true,
      disablePadding: false,
      label: t("database.type"),
    },
  ];
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const [updateState, setUpdateState] = useState(1);
  const [rowsState, setRowsState] = useState<any>([]);
  const [paginationState, setPaginationState] = useState();
  const [pageState, setPageState] = useState(1);
  const [orederState, setOrederState] = useState("-id");
  const [pageSizeState, setPageSizeState] = useState(5);
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
  const handleSetTargetPage = (targetPage: number) => {
    setPageState(targetPage);
    setUpdateState(updateState + 1);
  };
  const handleRequestSort = (order: string, property: any) => {
    setOrederState(order + property);
    setUpdateState(updateState + 1);
  };

  const handleSetpageSize = (size: number) => {
    setPageSizeState(size);
    setUpdateState(updateState + 1);
  };

  const requestDelete = async () => {
    for (let i = 0; i < selected.length; i++) {
      await getfetch(
        "databaseItem",
        {
          method: "delete",
        },
        {
          pathParam: {
            id: selected[i],
          },
        }
      );
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

  useEffect(() => {
    setGlobalProgress(true);
    setSelected([]);
    const handleUpdate = () => {
      setUpdateState(updateState + 1);
    };
    getfetch(
      "database",
      {},
      {
        searchParam: {
          page: String(pageState),
          ordering: orederState,
          page_size: String(pageSizeState),
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setRowsState(
          res.results.map((row: any) => {
            // row.domain = (
            //   <div className="flex content-center gap-1">
            //     {row.domain}{" "}
            //     <PublicIcon
            //       fontSize="small"
            //       color={
            //         row.ssl_enable ? "success" : "inherit"
            //       }></PublicIcon>{" "}
            //   </div>
            // );
            // row.database_id = row.database_id ? row.database_id : "-";
            // row.ssl_enable = (
            //   <SwitchSSL
            //     id={row.id}
            //     status={row.ssl_enable}
            //     onUpdate={handleUpdate}></SwitchSSL>
            // );
            return row;
          })
        );
        setPaginationState(res.pagination);
      })
      .finally(() => {
        setGlobalProgress(false);
      });
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
        onAction={handleAction}
        enhancedTableToolbar={EnhancedTableToolbar}
        selectedState={[selected, setSelected]}
        onSetPageSize={handleSetpageSize}
        onRequestSort={handleRequestSort}
        onSetPage={handleSetTargetPage}
        rows={rowsState}
        headCells={headCells}
        title={"layout.website"}
        pagination={paginationState}
      />
    </div>
  );
}
