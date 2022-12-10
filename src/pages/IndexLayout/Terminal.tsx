import HostsIndex, {
  SSHClientInfo,
} from "../../components/terminal/HostsIndex";

import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { atom, selector, useRecoilState } from "recoil";
import FooterBar, {
  SelectedTerminalTabUniqueAtom,
} from "../../components/terminal/FooterBar";
import TerminalSession, {
  HostAuth,
} from "../../components/terminal/TerminalSession";
import { KVStorage } from "../../requests/utils";
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

export interface TerminalTab {
  name: string;
  auth: HostAuth;
  unique: string;
  index: number;
  terminalSession: JSX.Element;
}

export const TerminalDestoryTabAtom = atom<string[]>({
  key: "terminalDestoryTab",
  default: [],
});

export const TerminalTabsAtom = atom<TerminalTab[]>({
  key: "terminalTabs",
  default: [],
});

export const OpenedTerminalTabsAtom = selector({
  key: "openedTerminalTabs",
  get: ({ get }) => {
    const terminalTabs = get(TerminalTabsAtom);
    const destoryTab = get(TerminalDestoryTabAtom);
    return terminalTabs.filter((item) => {
      return !destoryTab.includes(item.unique);
    });
  },
});

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [destoryTab, setDestoryTab] = useRecoilState(TerminalDestoryTabAtom);

  const [selectedTabs, setSelectedTabs] = useRecoilState(
    SelectedTerminalTabUniqueAtom
  );

  const [terminalTabs, setTerminalTab] = useRecoilState(TerminalTabsAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue - 1 > 0) {
      setSelectedTabs([terminalTabs[newValue - 1].unique]);
    } else {
      setSelectedTabs([]);
    }
  };

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
    setTerminalTab([...terminalTabs, tab]);
    setSelectedTabs([unique]);
    setValue(terminalTabs.length + 1);
  };

  const handleRemoveTab = (tab: TerminalTab) => {
    setDestoryTab([...destoryTab, tab.unique]);
    setValue(0);
  };

  React.useEffect(() => {
    setTerminalTab([]);
  }, []);

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
          <HostsIndex onClick={handleAddTab}></HostsIndex>
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
      {value > 0 && <FooterBar></FooterBar>}
    </div>
  );
}
