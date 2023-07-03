import { useSearchParams } from "react-router-dom";
import ImageTable from "../../components/docker/ImageTable";
import VolumeTable from "../../components/docker/VolumeTable";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { useTranslation } from "react-i18next";
import ContainerTable from "../../components/docker/ContainerTable";
import useSWR from "swr";
import { requestData } from "../../requests/http";
import { OperatingResIF } from "../../constant";
import InstallDocker from "../../components/docker/InstallDocker";

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
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Container() {
  const [t] = useTranslation();
  const [value, setValue] = React.useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue == 0) {
      setSearchParams({ tab: "container" });
    } else if (newValue == 1) {
      setSearchParams({ tab: "image" });
    } else if (newValue == 2) {
      setSearchParams({ tab: "volume" });
    }
  };

  React.useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab == "image") {
      setValue(1);
    } else if (tab == "volume") {
      setValue(2);
    } else {
      setValue(0);
    }
  }, [searchParams]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic docker tabs">
          <Tab label={t("docker.container")} {...a11yProps(0)} />
          <Tab label={t("docker.image")} {...a11yProps(1)} />
          <Tab label={t("docker.volume")} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ContainerTable></ContainerTable>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ImageTable></ImageTable>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <VolumeTable></VolumeTable>
      </TabPanel>
    </Box>
  );
}

export default function Index() {
  const { data, error, isLoading } = useSWR<OperatingResIF>(
    "/api/DockerContainer/ping/",
    async (url) => {
      const res = await requestData({
        url: url,
      });

      if (res.ok) {
        return await res.json();
      } else {
        console.log(res);
        throw new Error("query docker api failur");
      }
    }
  );

  if (isLoading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>error</div>;
  }

  if (data?.result.result == 2) {
    return <InstallDocker></InstallDocker>;
  } else {
    return <Container></Container>;
  }
}
