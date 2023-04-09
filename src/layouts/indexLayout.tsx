import FolderIcon from "@mui/icons-material/Folder";
import RouteIcon from "@mui/icons-material/Route";
import TerminalIcon from "@mui/icons-material/Terminal";
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import { useState } from "react";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CookieIcon from "@mui/icons-material/Cookie";
import MenuIcon from "@mui/icons-material/Menu";
import StorageIcon from "@mui/icons-material/Storage";
import WebIcon from "@mui/icons-material/Web";
import {
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogContent,
  Drawer,
  LinearProgress,
  Modal,
  Paper,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import packagejs from "../../package.json";
import LabTabs from "../components/Labtabs";
import useLongPress from "../hooks/useLongPress";
import { fetchData, hasAuthToken } from "../requests/http";
import {
  AppBarOpenAtom,
  GlobalLoadingAtom,
  GlobalProgressAtom,
} from "../store/recoilStore";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(0),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    boxShadow: "none",
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  //...theme.mixins.toolbar,
  minHeight: "48px",
  justifyContent: "flex-end",
}));

export async function loader() {
  if (!hasAuthToken()) {
    throw new Response("permission denied", { status: 404 });
  }

  let version = sessionStorage.getItem("version");
  if (!version) {
    let data = await fetchData({ apiType: "version" });
    if (data.status == 403) {
      throw new Response("permission denied", { status: 404 });
    }
    sessionStorage.setItem("version", "ok");
  }

  return null;
}

function GlobalLoading() {
  const [state, setState] = useRecoilState(GlobalLoadingAtom);

  return (
    <div>
      <Dialog
        open={state}
        PaperProps={{ sx: { borderRadius: "12px" }, className: "shadow-md" }}>
        <DialogContent className="flex flex-col justify-center items-center h-full w-full ">
          <CircularProgress size={"4rem"} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CustomNavLink(props: {
  item: { to: string; name: string; icon: any };
}) {
  const theme: any = useTheme();
  const location = useLocation();

  return (
    <Paper
      className="p-0 shadow-none rounded-none"
      sx={
        location.pathname.includes(props.item.to)
          ? {
              backgroundColor: theme.palette.error[50],
            }
          : {}
      }>
      <NavLink to={props.item.to} className="text-inherit no-underline">
        <ListItemButton>
          <ListItemIcon className="text-inherit">
            <props.item.icon fontSize="large" />
          </ListItemIcon>
          <ListItemText
            className="capitalize text-inherit"
            primary={props.item.name}
          />
        </ListItemButton>
      </NavLink>
    </Paper>
  );
}

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  // const [open, setOpen] = useState(matches);
  const [open, setOpen] = useRecoilState(AppBarOpenAtom);
  const { t } = useTranslation();
  const [openDebugSwitch, setOpenDebugSwitch] = useState(false);
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const navigate = useNavigate();

  const onLongPress = () => {
    setOpenDebugSwitch(!openDebugSwitch);
  };
  const onClick = () => {};

  const longPressEvent = useLongPress(onLongPress, onClick, {
    shouldPreventDefault: true,
    delay: 500,
  });

  const listMeunData = [
    {
      name: t("layout.overview"),
      icon: CookieIcon,
      to: "/dash/index",
    },
    {
      name: t("layout.website"),
      icon: WebIcon,
      to: "/dash/website",
    },
    {
      name: t("layout.database"),
      icon: StorageIcon,
      to: "/dash/database",
    },
    {
      name: t("layout.files"),
      icon: FolderIcon,
      to: "/dash/explorer",
    },
    {
      name: t("layout.terminal"),
      icon: TerminalIcon,
      to: "/dash/terminal",
    },
    {
      name: t("layout.ftp"),
      icon: RouteIcon,
      to: "/dash/mount",
    },
    {
      name: t("layout.iptables"),
      icon: SecurityIcon,
      to: "/dash/iptables",
    },
  ];
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <GlobalLoading></GlobalLoading>
      <Modal
        open={openDebugSwitch}
        onClose={() => {
          setOpenDebugSwitch(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded-md">
          <LabTabs></LabTabs>
        </Box>
      </Modal>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar variant="dense" className="flex justify-between ">
          <div className="flex">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ ...(open && { display: "none" }) }}>
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              sx={{ mr: 2 }}
              onClick={() => {
                navigate(-1);
              }}>
              <ArrowBack></ArrowBack>
            </IconButton>
          </div>

          <div className="w-full flex justify-end">
            <div className="cursor-pointer" {...longPressEvent}>
              {packagejs.version}
            </div>
          </div>
        </Toolbar>
        {globalProgress && <LinearProgress />}
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            borderRight: "0",
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}>
        <DrawerHeader
          sx={{
            color: "primary.contrastText",
            bgcolor: "primary.main",
          }}>
          {t("left-top-tips")}
          <IconButton size="small" onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon
                sx={{
                  color: "primary.contrastText",
                }}
              />
            ) : (
              <ChevronRightIcon
                sx={{
                  color: "primary.contrastText",
                }}
              />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <nav className="flex-1 overflow-auto ">
          <ul className="p-0 m-0 list-none shadow-none">
            {listMeunData.map((item, index) => (
              <li key={index}>
                <CustomNavLink item={item} />
              </li>
            ))}
          </ul>
        </nav>
      </Drawer>

      <Main open={open} className="h-screen w-full">
        <DrawerHeader />
        <Outlet></Outlet>
      </Main>
    </Box>
  );
}
