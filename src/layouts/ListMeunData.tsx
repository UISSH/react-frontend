import CookieIcon from "@mui/icons-material/Cookie";
import FolderIcon from "@mui/icons-material/Folder";
import RouteIcon from "@mui/icons-material/Route";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import TerminalIcon from "@mui/icons-material/Terminal";
import WebIcon from "@mui/icons-material/Web";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDocker } from "@fortawesome/free-brands-svg-icons";

 function DockerIcon() {
  return <FontAwesomeIcon icon={faDocker} />;
}

export default function MenuData(t: Function) {
  return [
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
    {
      name: t("layout.crontab"),
      icon: ScheduleIcon,
      to: "/dash/crontab",
    },
    {
      name: t("layout.docker"),
      icon: DockerIcon,
      to: "/dash/docker",
    },
  ];
}
