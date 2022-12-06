import HostsIndex, {
  SSHClientInfo,
} from "../../components/terminal/HostsIndex";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import FooterBar from "../../components/terminal/FooterBar";
import { getApiGateway, getWSGateway, KVStorage } from "../../requests/utils";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import TerminalSession, {
  HostAuth,
} from "../../components/terminal/TerminalSession";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  unique: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, unique, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {<div>{children}</div>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export interface TerminalTabs {
  name: string;
  auth: HostAuth;
  unique: string;
  index: number;
  terminalSession: JSX.Element;
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [destoryTab, setDestoryTab] = React.useState<string[]>([]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [sshClient, setSshClient] = React.useState<SSHClientInfo>({});

  const [terminalTabs, setTerminalTabs] = React.useState<TerminalTabs[]>([]);

  const initFlag = React.useRef(true);
  React.useEffect(() => {
    if (!initFlag.current) {
      return;
    }

    let kv = new KVStorage("SSH_CLIENT");
    kv.init().then((val) => {
      if (val == null) {
        setSshClient({});
      } else {
        setSshClient(JSON.parse(val));
      }
    });
    return () => {
      initFlag.current = false;
    };
  }, []);

  const getUUID4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const handleAddTab = (name: string, hostAuth: HostAuth) => {
    let unique = getUUID4();

    let tab = {
      name: name,
      auth: hostAuth,
      unique: unique,
      index: terminalTabs.length + 1,
      terminalSession: (
        <TerminalSession unique={unique} auth={hostAuth}></TerminalSession>
      ),
    };
    setTerminalTabs([...terminalTabs, tab]);
    setValue(terminalTabs.length + 1);
  };

  const handleRemoveTab = (tab: TerminalTabs) => {
    setDestoryTab([...destoryTab, tab.unique]);
    tab["terminalSession"] = <div />;
    setValue(0);
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            sx={{ maxHeight: "48px" }}
            value={value}
            onChange={handleChange}
            aria-label="terminal tabs ">
            <Tab sx={{ maxHeight: "48px" }} label="Host" {...a11yProps(0)} />

            {terminalTabs.map((tab, index) => {
              return (
                <Tab
                  component="div"
                  key={index}
                  className={destoryTab.includes(tab.unique) ? "hidden" : ""}
                  label={
                    <span>
                      {tab.name}
                      <IconButton
                        size="small"
                        sx={{ marginLeft: "4px" }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveTab(tab);
                        }}>
                        <CloseIcon></CloseIcon>
                      </IconButton>
                    </span>
                  }
                  iconPosition="end"
                  sx={{ maxHeight: "48px", minHeight: "0px" }}
                  {...a11yProps(index + 1)}></Tab>
              );
            })}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0} unique={"host"}>
          <HostsIndex
            sshClientInfo={sshClient}
            onClick={handleAddTab}></HostsIndex>
        </TabPanel>
        {terminalTabs.map((tab, index) => {
          return (
            <TabPanel
              key={index}
              value={value}
              index={index + 1}
              unique={tab.unique}>
              {tab.terminalSession}
            </TabPanel>
          );
        })}
      </Box>
      <FooterBar></FooterBar>
    </div>
  );
}
