import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  alpha,
  Button,
  ButtonGroup,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalProgressAtom } from "../../store/recoilStore";
import { EnhancedTableToolbarProps } from "../DjangoTable";
//import CreateDatabaseDialog from "./CreateDatabaseDialog";

// const CreateDatabaseDialog = React.lazy(() => import("./CreateDatabaseDialog"));

const LABEL = "layout.explorer";

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
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

            <Typography
              className={
                numSelected <= 0 ? "visible capitalize" : "invisible w-0 h-0"
              }
              sx={{ flex: numSelected <= 0 ? "1 1 100%" : "0 0 0%" }}
              variant="h6"
              id="tableTitle"
              component="div">
              {t(LABEL)}
            </Typography>
          </div>
        }
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
