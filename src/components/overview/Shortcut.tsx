import TerminalIcon from "@mui/icons-material/Terminal";
import WebIcon from "@mui/icons-material/Web";
import { Button, Card } from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import {
  getShortcut,
  navigateByLocation,
  ShortcutIF,
  ShortcutItemIF,
  syncShortcut,
} from "../../store/shortStore";

import FolderIcon from "@mui/icons-material/Folder";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SourceIcon from "@mui/icons-material/Source";
import StorageIcon from "@mui/icons-material/Storage";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export interface ShortcutProps {
  className?: string;
  children?: React.ReactNode;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `shortcut-cate-tab-${index}`,
    "aria-controls": `cate-tabpanel-${index}`,
  };
}
export function ShortcutItem(props: { value: ShortcutItemIF[] }): ReactElement {
  const navigate = useNavigate();

  const getIcon = (item: ShortcutItemIF) => {
    switch (item.cate) {
      case "database":
        return <StorageIcon></StorageIcon>;
      case "terminal":
        return <TerminalIcon></TerminalIcon>;
      case "website":
        return <WebIcon></WebIcon>;
      case "folder":
        return <FolderIcon></FolderIcon>;
      case "text":
        return <SourceIcon></SourceIcon>;
      default:
        return <HelpOutlineIcon></HelpOutlineIcon>;
    }
  };

  return (
    <>
      {props.value.map((item) => {
        return (
          <Button
            key={item.unique}
            variant="contained"
            startIcon={getIcon(item)}
            onClick={() => {
              navigateByLocation(navigate, item.router);
            }}
            sx={{
              textTransform: "none",
            }}>
            {item.name}
          </Button>
        );
      })}
    </>
  );
}

export function CateShortcutTabPanel(props: { value?: ShortcutIF }) {
  if (!props.value) {
    return (
      <>
        <div>empty data</div>
      </>
    );
  }
  const cuteNameList = Object.keys(props.value);
  if (cuteNameList.length <= 0) {
    return (
      <>
        <div>empty data</div>
      </>
    );
  }
  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {cuteNameList.map((cuteName) => {
          return (
            <ShortcutItem
              key={cuteName}
              value={props.value ? props.value[cuteName] : []}></ShortcutItem>
          );
        })}
      </div>
    </>
  );
}
export default function Shortcut(props: ShortcutProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const { data, error, isLoading } = useSWR("shortcut", () => {
    return getShortcut();
  });

  useEffect(() => {
    return () => {
      syncShortcut();
    };
  }, []);

  const getCateItems = (cate: string): ShortcutIF => {
    if (!data) return {};

    if (cate in data) {
      return { cate: data[cate] };
    } else {
      return {};
    }
  };

  if (error) return <div>"An error has occurred."</div>;
  if (isLoading) return <div>"Loading..."</div>;
  if (data) {
    return (
      <>
        <Card className=" mb-1 shadow-sm">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                value={value}
                onChange={handleChange}
                aria-label="shortcut tabs">
                <Tab label={t("common.all")} {...a11yProps(0)} />
                <Tab label={t("common.database")} {...a11yProps(1)} />
                <Tab label={t("common.terminal")} {...a11yProps(2)} />
                <Tab label={t("common.website")} {...a11yProps(3)} />
                <Tab label={t("common.folder")} {...a11yProps(4)} />
                <Tab label={t("common.text")} {...a11yProps(5)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <CateShortcutTabPanel value={data} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <CateShortcutTabPanel value={getCateItems("database")} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <CateShortcutTabPanel value={getCateItems("terminal")} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <CateShortcutTabPanel value={getCateItems("website")} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <CateShortcutTabPanel value={getCateItems("folder")} />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <CateShortcutTabPanel value={getCateItems("text")} />
            </TabPanel>
          </Box>

          {/* 生成一个 tabs 组件 */}
          {/* <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {data.map((item) => (
              <Tab label={item.name} {...a11yProps(item.id)} />
            ))} 
          </Tabs> */}
        </Card>
      </>
    );
  } else {
    return <></>;
  }
}
