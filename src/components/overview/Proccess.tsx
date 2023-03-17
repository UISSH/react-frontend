import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import CardDialog from "../CardDialog";

export interface SystemProccessProps {
  open: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function SystemProccess(props: SystemProccessProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  return (
    <>
      <CardDialog open={props.open}>
        <div>proccess list</div>
      </CardDialog>
    </>
  );
}
