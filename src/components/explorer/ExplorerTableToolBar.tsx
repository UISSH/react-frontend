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
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { GlobalProgressAtom } from "../../store/recoilStore";
import { ShortcutItemIF } from "../../store/shortStore";
import { calcMD5 } from "../../utils";
import { EnhancedTableToolbarProps } from "../DjangoTable";
import ShortcutBook from "../overview/ShortcutBook";
import NewActionMenu from "./ActionMenu";
//import CreateDatabaseDialog from "./CreateDatabaseDialog";

// const CreateDatabaseDialog = React.lazy(() => import("./CreateDatabaseDialog"));

const LABEL = "layout.explorer";

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  const [shortcutData, setShortcutData] = useState<ShortcutItemIF>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [t] = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);

  const handleDelete = () => {
    if (props.onAction) {
      props.onAction("delete");
    }
  };

  const currentPath = searchParams.get("directory");

  const handleReloadParent = () => {
    if (props.onAction) {
      props.onAction("reload");
    }
  };

  useEffect(() => {
    let data = {
      name: searchParams.get("directory")?.split("/").pop() || "/",
      unique: "folder-" + calcMD5(searchParams.get("directory") || "/"),
      cate: "folder",
      router: location,
    } as ShortcutItemIF;
    setShortcutData(data);
  }, [searchParams.get("directory"), location]);
  return (
    <>
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
          {currentPath && (
            <NewActionMenu currentPath={currentPath}></NewActionMenu>
          )}

          {shortcutData && <ShortcutBook {...shortcutData}></ShortcutBook>}

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
