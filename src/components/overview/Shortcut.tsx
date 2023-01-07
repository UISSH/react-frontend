import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import useSWR from "swr";

export interface ShortcutProps {
  className?: string;
  children?: React.ReactNode;
}

export default function Shortcut(props: ShortcutProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const { mutate } = useSWR();
  return <></>;
}
