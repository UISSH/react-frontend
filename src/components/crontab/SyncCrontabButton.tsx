import SyncIcon from "@mui/icons-material/Sync";
import { IconButton, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { requestData } from "../../requests/http";
import { GlobalLoadingAtom } from "../../store/recoilStore";

export interface SyncCrontabButtonProps {
  className?: string;
  children?: React.ReactNode;
}
export default function SyncCrontabButton(props: SyncCrontabButtonProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const handleSyncCrontab = async () => {
    setGlobalLoadingAtom(true);
    let res = await requestData({
      url: "/api/Crontab/sync/",
      method: "GET",
    });
    setGlobalLoadingAtom(false);
    if (res.ok) {
      enqueueSnackbar(t("crontab.sync_crontab_success"), {
        variant: "success",
      });
    } else {
      enqueueSnackbar(t("crontab.sync_crontab_failed"), {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Tooltip title={t("crontab.sync_btn_tlp")}>
        <IconButton size="small" color="primary" onClick={handleSyncCrontab}>
          <SyncIcon></SyncIcon>
        </IconButton>
      </Tooltip>
    </>
  );
}
