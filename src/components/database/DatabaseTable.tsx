import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RefreshIcon from "@mui/icons-material/Refresh";
import Visibility from "@mui/icons-material/Visibility";
import SettingsIcon from "@mui/icons-material/Settings";
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
import AddDialog from "./AddDialog";
import { useNavigate } from "react-router-dom";
import { getApiGateway } from "../../requests/utils";

const MAIN = "database";
const ITEM = "databaseItem";
const LABEL = "layout.database";

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
        <AddDialog
          open={openDialog}
          setOpen={(open) => {
            setOpenDialog(open);
            handleReloadParent();
          }}></AddDialog>
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
            <Button
              variant="contained"
              type="a"
              target={"_blank"}
              href={getApiGateway() + ":8080"}>
              phpMyAdmin
            </Button>
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
              <div className="whitespace-nowrap">{t("common.delete")}</div>
            </Button>
          ) : (
            <div></div>
          )}

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
  const headCells = [
    // {
    //   key: "id",
    //   numeric: false,
    //   disablePadding: true,
    //   label: "ID",
    // },
    {
      key: "settings",
      numeric: false,
      disablePadding: true,
      label: "settings",
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
  const navigate = useNavigate();
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
      searchParam: {
        page: String(pageState),
        ordering: orederState,
        page_size: String(pageSizeState),
      },
    },
  };

  const { mutate } = useSWR(fetchDataProps, (props) => {
    setGlobalProgress(true);
    fetchData(fetchDataProps)
      .then((res) => res.json())
      .then((res) => {
        setRowsState(
          res.results.map((row: any) => {
            row.settings = (
              <IconButton
                color="primary"
                onClick={() => {
                  navigate(`/dash/database/${row.id}`);
                }}>
                <SettingsIcon></SettingsIcon>
              </IconButton>
            );
            row.password = (
              <PasswordField
                password={row.password}
                readOnly={true}></PasswordField>
            );
            if (row.create_status_text == "success") {
              row.create_status_text = (
                <CheckCircleOutlineIcon color="success"></CheckCircleOutlineIcon>
              );
            } else if (row.create_status_text == "pending") {
              row.create_status_text = (
                <HourglassEmptyIcon
                  className="animate-pulse"
                  color="info"></HourglassEmptyIcon>
              );
            } else {
              row.create_status_text = (
                <ErrorOutlineIcon color="error"></ErrorOutlineIcon>
              );
            }

            return row;
          })
        );
        setPaginationState(res.pagination);
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
