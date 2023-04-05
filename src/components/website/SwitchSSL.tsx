import { Switch } from "@mui/material";
import { useRecoilState } from "recoil";
import { requestData } from "../../requests/http";
import { GlobalLoadingAtom } from "../../store/recoilStore";

import { useSnackbar } from "notistack";

export function SwitchSSL({
  id,
  status,
  onUpdate,
}: {
  id: string;
  status: boolean;
  onUpdate: Function;
}) {
  const rowID = id;

  const [_, setGlobalLoadingAtomState] = useRecoilState(GlobalLoadingAtom);

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let checked = event.target.checked;

    let action = checked
      ? `/api/Website/${rowID}/enable_ssl/`
      : `/api/Website/${rowID}/disable_ssl/`;
    setGlobalLoadingAtomState(true);

    requestData({
      url: action,
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.result.result === 2) {
          enqueueSnackbar(res.msg, { variant: "error" });
        } else {
          enqueueSnackbar("ok", { variant: "success" });
        }
      })
      .finally(() => {
        setGlobalLoadingAtomState(false);
        onUpdate();
      });
  };

  return (
    <Switch
      onClick={(e) => {
        e.stopPropagation();
      }}
      checked={status}
      onChange={handleChange}
      inputProps={{ "aria-label": "controlled" }}
    />
  );
}
