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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";

import { ShortcutItemIF } from "../../store/shortStore";
import { calcMD5 } from "../../utils";
import { EnhancedTableToolbarProps } from "../DjangoTable";
import ShortcutBook from "../overview/ShortcutBook";
import NewActionMenu from "./ActionMenu";

const LABEL = "layout.explorer";

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  const [shortcutData, setShortcutData] = useState<ShortcutItemIF>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [t] = useTranslation();

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
      router: {
        ...location,
        search: `?directory=${searchParams.get("directory") || "/"}`,
      },
    } as ShortcutItemIF;
    setShortcutData(data);
    console.log(data);
  }, [searchParams, location]);

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
        }}
      >
        {
          <div className="flex flex-1 w-full">
            <Typography
              className={numSelected > 0 ? "visible" : "invisible  w-0 h-0"}
              sx={{ flex: numSelected > 0 ? "1 1 100%" : "0 0 0%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} {t(LABEL)}
            </Typography>

            <Typography
              className={
                numSelected <= 0 ? "visible capitalize" : "invisible w-0 h-0"
              }
              sx={{ flex: numSelected <= 0 ? "1 1 100%" : "0 0 0%" }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {t(LABEL)}
            </Typography>
          </div>
        }
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          {currentPath && (
            <NewActionMenu currentPath={currentPath}></NewActionMenu>
          )}

          {shortcutData && <ShortcutBook {...shortcutData}></ShortcutBook>}

          {numSelected > 0 ? (
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              <div className="whitespace-nowrap">{t("common.delete")}</div>
            </Button>
          ) : (
            <div></div>
          )}
          <div className="px-2 gap-1 flex">
            <IconButton color="primary" onClick={handleReloadParent}>
              <RefreshIcon />
            </IconButton>
          </div>
        </ButtonGroup>
      </Toolbar>
    </>
  );
}
