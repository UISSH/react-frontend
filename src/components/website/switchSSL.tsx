import { Switch } from "@mui/material";
import { useRecoilState } from "recoil";
import { ApiType, fetchData } from "../../requests/http";
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

    let action: ApiType = checked ? "enableWebsiteSSL" : "disableWebsiteSSL";
    setGlobalLoadingAtomState(true);
    fetchData({
      apiType: action,
      init: { method: "post" },
      params: { pathParam: { id: rowID } },
    })
      .then((res) => {
        return res.json();
      })
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
      color={status ? "success" : "default"}
      onChange={handleChange}
      inputProps={{ "aria-label": "controlled" }}
    />
  );
}
