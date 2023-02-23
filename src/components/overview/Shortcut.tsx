import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import useSWR from "swr";
import { getShortcut } from "../../store/shortStore";
import { Card, CardContent, CardHeader } from "@mui/material";

export interface ShortcutProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Shortcut(props: ShortcutProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  /* 
 todo
 
 */
  const { data, error, isLoading } = useSWR("shortcut", () => {
    return getShortcut();
  });
  if (error) return <div>"An error has occurred."</div>;
  if (isLoading) return <div>"Loading..."</div>;
  return (
    <>
      <Card variant="elevation" className="pa-2">
        <CardContent>todo: add shortcut tabs(keep-live)</CardContent>
      </Card>
    </>
  );
}
