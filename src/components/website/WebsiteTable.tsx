import AddIcon from "@mui/icons-material/Add";
import DatasetIcon from "@mui/icons-material/Dataset";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PublicIcon from "@mui/icons-material/Public";
import RefreshIcon from "@mui/icons-material/Refresh";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  alpha,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { fetchData } from "../../requests/http";
import { GlobalProgressAtom } from "../../store/recoilStore";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
import CreateWebsiteDialog from "./CreateWebsiteDialog";
import { SwitchSSL } from "./SwitchSSL";

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
      <CreateWebsiteDialog
        open={openDialog}
        onStatus={(res) => {
          setOpenDialog(false);
          handleReloadParent();
        }}></CreateWebsiteDialog>
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
            {numSelected} {t("layout.website")}
          </Typography>
        ) : (
          <Typography
            className="capitalize"
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div">
            {t("layout.website")}
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
            {t("website.add")}
          </Button>

          {numSelected > 0 ? (
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}>
              {t("website.delete")}
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

export default function WebsiteTable() {
  const [t] = useTranslation();
  const headCells = [
    {
      key: "id",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      key: "domain",
      numeric: false,
      disablePadding: false,
      label: t("website.domain"),
    },
    {
      key: "web_server_type_text",
      numeric: true,
      disablePadding: false,
      label: t("website.application"),
    },
    {
      key: "database_id",
      numeric: true,
      disablePadding: false,
      label: t("website.database"),
    },
    {
      key: "index_root",
      numeric: true,
      disablePadding: false,
      label: t("website.path"),
    },
    {
      key: "ssl_enable",
      numeric: true,
      disablePadding: false,
      label: t("website.ssl"),
    },
  ];
  const navigate = useNavigate();
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

  const requestDeleteWebsite = async () => {
    for (let i = 0; i < selected.length; i++) {
      await fetchData({
        apiType: "websiteItem",
        init: {
          method: "DELETE",
        },
        params: {
          pathParam: { id: selected[i] },
        },
      });
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
            <div>{t("website.are-you-sure-to-delete-the-website")}</div>
            <ul>
              {rowsState
                // @ts-ignore
                .filter((row) => {
                  console.log(row);
                  return selected.includes(row.id.toString());
                })
                // @ts-ignore
                .map((row) => (
                  <li key={row.id}>{row.domain}</li>
                ))}
            </ul>
          </div>
        ),
      });
    } else if (action == "reload") {
      setUpdateState(updateState + 1);
    }
  };

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  useEffect(() => {
    setGlobalProgress(true);
    setSelected([]);
    const handleUpdate = () => {
      setUpdateState(updateState + 1);
    };
    fetchData({
      apiType: "website",
      params: {
        searchParam: {
          page: String(pageState),
          ordering: orederState,
          page_size: String(pageSizeState),
        },
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setRowsState(
          res.results.map((row: any) => {
            let domain = row.domain;

            row.domain = (
              <div
                className="flex content-center gap-1 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  let url = `http://${domain}`;
                  if (row.ssl_enable) {
                    url = `https://${domain}`;
                  }
                  openInNewTab(url);
                }}>
                {domain}
                <PublicIcon
                  fontSize="small"
                  color={
                    row.ssl_enable ? "success" : "inherit"
                  }></PublicIcon>{" "}
              </div>
            );

            let web_server_type_text = row.web_server_type_text;
            row.web_server_type_text = (
              <div
                className="flex flex-nowrap gap-2 justify-end items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                }}>
                <div>{web_server_type_text}</div>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigate(`/dash/website/${row.id}`);
                    // todo navigate to web server
                  }}>
                  <SettingsIcon></SettingsIcon>
                </IconButton>
              </div>
            );
            row.ssl_enable = (
              <SwitchSSL
                id={row.id}
                status={row.ssl_enable}
                onUpdate={handleUpdate}></SwitchSSL>
            );
            let _index_root = row.index_root;
            let database_id = row.database_id;
            row.database_id = (
              <IconButton
                disabled={database_id == null}
                onClick={(e) => {
                  // todo navigate to database
                  e.stopPropagation();
                  navigate(`/dash/database/${database_id}`);
                }}>
                <DatasetIcon
                  color={database_id ? "primary" : "disabled"}></DatasetIcon>
              </IconButton>
            );
            row.index_root = (
              <TextField
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                variant="standard"
                value={row.index_root}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/dash/explorer/?directory=${_index_root}`);
                        }}>
                        <FolderOpenIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}></TextField>
            );
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
            onClick={requestDeleteWebsite}
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
