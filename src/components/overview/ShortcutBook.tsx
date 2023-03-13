import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { DefaultTFuncReturn } from "i18next";
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

export default function ShortcutBook(
  props: ShortcutItemIF & {
    label?: string | DefaultTFuncReturn;
    className?: string;
  }
) {
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
        <div
          className={
            props.className
              ? props.className
              : "flex justify-between items-center"
          }
          onClick={handleRemoveShortcut}>
          <Tooltip title={t("common.remove-from-shortcut")}>
            <IconButton size="small" color="primary">
              <BookmarkOutlinedIcon></BookmarkOutlinedIcon>
            </IconButton>
          </Tooltip>
          <div>{props.label}</div>
        </div>
      ) : (
        <div
          className={
            props.className
              ? props.className
              : "flex justify-between items-center"
          }
          onClick={handleAddShortcut}>
          <Tooltip title={t("common.add-to-shortcut")}>
            <IconButton size="small" color="primary">
              <BookmarkBorderOutlinedIcon></BookmarkBorderOutlinedIcon>
            </IconButton>
          </Tooltip>
          <div>{props.label}</div>
        </div>
      )}
    </>
  );
}
