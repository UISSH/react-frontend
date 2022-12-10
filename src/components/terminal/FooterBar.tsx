import AddIcon from "@mui/icons-material/Add";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import SendIcon from "@mui/icons-material/Send";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Input,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { OpenedTerminalTabsAtom } from "../../pages/IndexLayout/Terminal";
import {
  AppBarOpenAtom,
  GlobalLoadingAtom,
  TerminalGlobalCommandDispatchAtom,
} from "../../store/recoilStore";

import Popover from "@mui/material/Popover";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const SelectedTerminalTabUniqueAtom = atom<string[]>({
  key: "selectedTerminalTabUnique",
  default: [],
});

export function TeminalMenuPopover() {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const tabs = useRecoilValue(OpenedTerminalTabsAtom);
  const [selectedTabs, setSelectedTabs] = useRecoilState(
    SelectedTerminalTabUniqueAtom
  );

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "teminal-menu-popover" : undefined;

  return (
    <div>
      <IconButton aria-describedby={id} color="inherit" onClick={handleClick}>
        <MenuOpenIcon></MenuOpenIcon>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}>
        <div className="px-2 py-3 max-w-xs">
          {tabs.length > 0 && (
            <div className="px-2">
              <Divider>Tab</Divider>
              <FormGroup row>
                <FormControlLabel
                  label="All"
                  control={
                    <Checkbox
                      name="selecte-all"
                      checked={
                        selectedTabs.length === tabs.length &&
                        selectedTabs.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTabs(tabs.map((tab) => tab.unique));
                        } else {
                          setSelectedTabs([]);
                        }
                      }}></Checkbox>
                  }></FormControlLabel>
                {tabs.map((tab) => {
                  return (
                    <FormControlLabel
                      key={tab.unique}
                      control={
                        <Checkbox
                          name={tab.unique}
                          checked={selectedTabs.includes(tab.unique)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTabs((prev) => {
                                return [...prev, e.target.name];
                              });
                            } else {
                              setSelectedTabs((prev) => {
                                return prev.filter(
                                  (item) => item !== e.target.name
                                );
                              });
                            }
                          }}
                          color="primary"
                        />
                      }
                      label={tab.name}
                    />
                  );
                })}
              </FormGroup>
            </div>
          )}
          {/* todo <Divider>{t("terminal.snippet")}</Divider> */}
        </div>
      </Popover>
    </div>
  );
}
export interface FooterBarProps {
  children?: React.ReactNode;
}

export default function FooterBar(props: FooterBarProps) {
  const [open, setOpen] = useRecoilState(AppBarOpenAtom);

  const [terminalCommand, setTerminalCommand] = useState("");

  const [_, sendTerminalCommandDispatch] = useRecoilState(
    TerminalGlobalCommandDispatchAtom
  );

  const [selectedTabs, setSelectedTabs] = useRecoilState(
    SelectedTerminalTabUniqueAtom
  );

  const getSX = () => {
    return open
      ? { top: "auto", bottom: 0, paddingLeft: "240px" }
      : { top: "auto", bottom: 0 };
  };

  const handleSendTerminalCommandDispatch = () => {
    sendTerminalCommandDispatch({
      command: terminalCommand,
      uuid: new Date().getTime().toString(),
      uniques: selectedTabs,
    });
    setTerminalCommand("");
  };

  return (
    <>
      <AppBar
        // @ts-ignore
        sx={{
          background: (theme) => theme.palette.secondary.main,
          ...getSX(),
        }}
        position="fixed">
        <Toolbar className="gap-1">
          <TeminalMenuPopover />
          <Box
            component="div"
            sx={{
              flexGrow: 1,
              "& > :not(style)": { m: 1 },
              paddingRight: "18px",
            }}>
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendTerminalCommandDispatch();
                }
              }}
              value={terminalCommand}
              onChange={(e) => {
                setTerminalCommand(e.target.value);
              }}
              fullWidth
              endAdornment={
                <IconButton onClick={handleSendTerminalCommandDispatch}>
                  <SendIcon />
                </IconButton>
              }
              sx={{
                color: (theme) => theme.palette.text.primary,
                backgroundColor: (theme) => theme.palette.background.default,
              }}
              className="pl-4 gap-1 rounded-sm "
              placeholder="Type your command here"
            />
          </Box>
          <IconButton color="inherit">
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}
