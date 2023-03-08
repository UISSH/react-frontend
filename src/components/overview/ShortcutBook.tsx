import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import {
  addShortcut,
  removeShortcut,
  shortcutExist,
  ShortcutItemIF,
  syncShortcut,
} from "../../store/shortStore";

export default function ShortcutBook(props: ShortcutItemIF) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const [shortcutState, setShortcutState] = useState<{
    existed: boolean;
    count: number;
    data: ShortcutItemIF;
  }>({ existed: false, count: 0, data: props });

  const handleAddShortcut = () => {
    if (shortcutState.data && addShortcut(shortcutState.data)) {
      setShortcutState({
        existed: true,
        count: shortcutState.count + 1,
        data: shortcutState.data,
      });
    }
  };

  const handleRemoveShortcut = () => {
    if (shortcutState.data && removeShortcut(shortcutState.data.unique)) {
      setShortcutState({
        existed: false,
        count: shortcutState.count + 1,
        data: shortcutState.data,
      });
    }
  };

  useEffect(() => {
    return () => {
      syncShortcut();
    };
  }, []);

  useEffect(() => {
    setShortcutState({
      ...shortcutState,
      existed: shortcutExist(props),
    });
  }, [props]);

  return (
    <>
      {shortcutState.existed ? (
        <Tooltip title={t("common.remove-from-shortcut")}>
          <IconButton color="primary" onClick={handleRemoveShortcut}>
            <BookmarkOutlinedIcon></BookmarkOutlinedIcon>
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={t("common.add-to-shortcut")}>
          <IconButton color="inherit" onClick={handleAddShortcut}>
            <BookmarkBorderOutlinedIcon></BookmarkBorderOutlinedIcon>
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
