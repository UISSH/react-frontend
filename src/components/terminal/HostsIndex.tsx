import AddIcon from "@mui/icons-material/AddCircle";
import {
  ButtonGroup,
  ClickAwayListener,
  Collapse,
  Divider,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { KVStorage } from "../../requests/utils";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import PostHost from "./PostHost";
import { HostAuth } from "./TerminalSession";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Snippets from "./Snippets";
export interface HostsIndexProps {
  children?: ReactNode;
  onClick?: (name: string, hostAuth: HostAuth) => void;
}

export interface SSHClientInfo {
  [name: string]: SSHClient;
}

interface SSHClient {
  name: string;
  port: number;
  hostname: string;
  username: string;
  password: string;
  private_key: string;
  private_key_password: string;
}

const options = ["Createt", "Squash", "Rebase"];

interface SplitButtonProps {
  children: ReactNode;
  MenuList: JSX.Element;
}

export function SplitButton(props: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        color="secondary"
        ref={anchorRef}
        aria-label="split button">
        {props.children}

        <Button
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="menu"
          onClick={handleToggle}>
          <ArrowDropDownIcon
            sx={{ fontSize: "1.2rem" }}
            className={`transition duration-500 ${open ? "rotate-180" : ""}  `}
          />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        placement="bottom-end"
        disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                {props.MenuList}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default function HostsIndex(props: HostsIndexProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [sshClient, setSshClient] = useState<SSHClientInfo>({});
  const sshClientKV = useRef<KVStorage>();

  const [postHostOpen, setPostHostOpen] = useState(false);
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  useEffect(() => {
    console.log("HostsIndex mount");
  }, []);

  function saveSSHClient() {
    sshClientKV.current?.setItem(JSON.stringify(sshClient));
  }

  useEffect(() => {
    if (postHostOpen == false) {
      if (!sshClientKV.current) {
        let kv = new KVStorage("SSH_CLIENT");
        sshClientKV.current = kv;
      }
      console.info("load ssh client");
      sshClientKV.current.init().then((val) => {
        if (val == null) {
          setSshClient({});
        } else {
          setSshClient(JSON.parse(val));
        }
      });
    }
  }, [postHostOpen]);
  return (
    <>
      <div className="px-4">
        <Divider className="py-2">{t("terminal.host")}</Divider>
        <div className="flex gap-1 flex-wrap">
          {sshClient &&
            Object.keys(sshClient).map((item) => {
              return (
                <div key={item}>
                  <SplitButton
                    MenuList={
                      <MenuList id={"split-button-menu-" + item}>
                        <MenuItem
                          onClick={() => {
                            delete sshClient[item];
                            setSshClient(JSON.parse(JSON.stringify(sshClient)));
                            saveSSHClient();
                          }}>
                          {t("common.delete")}
                        </MenuItem>
                      </MenuList>
                    }>
                    <Button
                      sx={{ minWidth: "100px" }}
                      onClick={() => {
                        let auth: HostAuth = {
                          hostname: sshClient[item].hostname,
                          port: sshClient[item].port,
                          username: sshClient[item].username,
                          password: sshClient[item].password,
                          private_key: sshClient[item].private_key,
                          private_key_password:
                            sshClient[item].private_key_password,
                        };
                        props.onClick && props.onClick(item, auth);
                      }}
                      variant="contained"
                      color="secondary">
                      <Paper
                        component="div"
                        className="shadow-none bg-inherit text-inherit"
                        sx={{ minWidth: "120px" }}>
                        {item}
                      </Paper>
                    </Button>
                  </SplitButton>
                </div>
              );
            })}

          <Tooltip title={t("terminal.addhost")}>
            <IconButton
              color="primary"
              onClick={() => {
                setPostHostOpen(true);
              }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>

        <Divider className="py-2">{t("terminal.snippet")}</Divider>
        <Snippets></Snippets>
        <PostHost
          open={postHostOpen}
          onAdd={(name, hostAuth) => {
            sshClient[name] = {
              name: name,
              ...hostAuth,
            };
            saveSSHClient();
            setPostHostOpen(false);
          }}
          onClose={() => {
            setPostHostOpen(false);
          }}></PostHost>
      </div>
    </>
  );
}
