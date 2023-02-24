import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import useSWR from "swr";
import {
  getShortcut,
  ShortCutCategoryIF,
  syncShortcut,
} from "../../store/shortStore";
import { Card, CardContent, CardHeader } from "@mui/material";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

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
          <Typography>{children}</Typography>
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

  if (error) return <div>"An error has occurred."</div>;
  if (isLoading) return <div>"Loading..."</div>;

  return (
    <>
      <Card className=" mb-1 shadow-sm">
        <CardContent>
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
              {/* {JSON.stringify(data)} */}
            </TabPanel>
            <TabPanel value={value} index={1}></TabPanel>
            <TabPanel value={value} index={2}></TabPanel>
            <TabPanel value={value} index={3}></TabPanel>
            <TabPanel value={value} index={4}></TabPanel>
            <TabPanel value={value} index={5}></TabPanel>
          </Box>
        </CardContent>
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
}
