import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import { LoadingButton } from "@mui/lab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { IconButton, TextField, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { requestData } from "../../requests/http";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import {
  addShortcut,
  removeShortcut,
  shortcutExist,
  ShortcutItemIF,
  syncShortcut,
} from "../../store/shortStore";
import BackupTable from "./BackupTable";
export interface SettingsProps {
  id: string;
  children?: React.ReactNode;
}

interface DataBaseFields {
  id: number;
  own_username: string;
  create_status_text: string;
  database_type_text: string;
  create_at: string;
  update_at: string;
  name: string;
  username: string;
  password: string;
  database_type: number;
  character: string;
  collation: string;
  authorized_ip: string;
  create_status: number;
  user: number;
  website?: any;
}

export default function Settings(props: SettingsProps) {
  const [value, setValue] = React.useState("1");
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const location = useLocation();
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [dbData, setDbData] = React.useState<DataBaseFields>();
  const [shortcutData, setShortcutData] = React.useState<ShortcutItemIF>();
  const { mutate } = useSWR(`/api/DataBase/${props.id}/`, (url) => {
    requestData({
      url: url,
    }).then(async (res) => {
      let data = await res.json();
      setDbData(data);
      setShortcutData({
        name: data.name,
        unique: `db-${data.id}`,
        cate: "database",
        router: location,
      });
    });
  });

  const handleAddShortcut = () => {
    if (shortcutData && addShortcut(shortcutData)) {
      mutate();
    }
  };

  const handleRemoveShortcut = () => {
    if (shortcutData && removeShortcut(shortcutData.unique)) {
      mutate();
    }
  };

  const handleSave = () => {
    setSaveLoading(true);
    requestData({
      url: `/api/DataBase/${props.id}/`,
      method: "PATCH",
      data: dbData,
    }).then(async (res) => {
      if (res.status === 200) {
        enqueueSnackbar(t("Save success"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(t("Save fail"), {
          variant: "error",
        });
      }

      setTimeout(() => {
        setSaveLoading(false);
      }, 1000);
    });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    return () => {
      syncShortcut();
    };
  }, []);
  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label={t("settings")} value="1" />
            <Tab label={t("backup")} value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          {dbData && (
            <div className="grid gap-4">
              <TextField
                fullWidth
                size="small"
                inputProps={{
                  readOnly: true,
                }}
                label={t("dbname")}
                value={dbData.name}></TextField>
              <TextField
                fullWidth
                required
                size="small"
                onChange={(e) => {
                  setDbData({ ...dbData, username: e.target.value });
                }}
                label={t("username")}
                value={dbData.username}></TextField>
              <TextField
                fullWidth
                required
                size="small"
                onChange={(e) => {
                  setDbData({ ...dbData, password: e.target.value });
                }}
                label={t("password")}
                value={dbData.password}></TextField>

              <div className="flex justify-end gap-x-2">
                {shortcutData && shortcutExist(shortcutData) ? (
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

                <LoadingButton
                  loading={saveLoading}
                  variant="contained"
                  onClick={handleSave}>
                  {t("common.save")}
                </LoadingButton>
              </div>
            </div>
          )}
        </TabPanel>
        <TabPanel className={"p-0 "} value="2">
          {dbData && (
            <BackupTable id={dbData.id} dbName={dbData.name}></BackupTable>
          )}
        </TabPanel>
      </TabContext>
    </Box>
  );
}
