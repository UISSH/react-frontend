import { CloseOutlined } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, LinearProgress } from "@mui/material";
import { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { requestData } from "../../requests/http";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { formatBytes } from "../../utils";
interface ContainerStatsDialogProps {
    containerId: string;
    open: boolean;
    onClose: () => void;
}


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 24,
    borderRadius: 2,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 2,
        backgroundColor: theme.palette.primary[theme.palette.mode],
    },
}));
export default function ContainerStatsDialog(props: ContainerStatsDialogProps) {
    if (!props.open) {
        return <></>

    }

    const [t] = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [searchParams, setSearchParams] = useSearchParams();
    const [globalLoadingAtom, setGlobalLoadingAtom] = useRecoilState(GlobalLoadingAtom);

    const { data, isLoading, error, mutate } = useSWR('/api/DockerContainer/' + props.containerId + '/stats/', async (url) => {
        let res = await requestData({
            url: url,
            method: "GET",
        })
        if (!res.ok) {
            enqueueSnackbar("Failed to get container stats", { variant: "error" });
            throw new Error("Failed to get container stats");
        }
        return await res.json();
    });



    useEffect(() => {
        let id = setInterval(() => {
            mutate();
        }, 3000);
        return () => {
            clearInterval(id);
        }
    }, [])

    const getCpuUsage = () => {
        if (data) {
            let cpu_usage = data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
            let system_cpu_usage = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
            let len_cpu = data.cpu_stats.online_cpus;
            let cpu_percent = cpu_usage / system_cpu_usage * len_cpu * 100.0;
            return cpu_percent

        }
        return 0;
    }

    const getMemoryUsage = () => {
        if (data) {
            let memory_usage = data.memory_stats.usage;
            let memory_limit = data.memory_stats.limit;
            let memory_percent = memory_usage / memory_limit * 100.0;
            return memory_percent
        }
        return 0;
    }



    if (isLoading) {
        return <Dialog open={props.open}>
            <DialogContent>loading...</DialogContent>
        </Dialog>
    }

    return (
        <Dialog open={props.open}>
            <DialogTitle sx={{ minWidth: "300px" }} className="flex justify-between items-center"> <div>Container Stats</div>
                <IconButton
                    onClick={props.onClose}
                    sx={{
                        color: (theme) => theme.palette.primary.contrastText
                    }}>
                    <CloseOutlined></CloseOutlined>
                </IconButton>
            </DialogTitle>
            <DialogContent className="my-4 flex flex-col gap-4 ">
                <div className="flex flex-col gap-1">
                    <div>CPU: {getCpuUsage().toFixed(2)}%</div>
                    <BorderLinearProgress variant="determinate" value={getCpuUsage()} />
                </div>
                <div className="flex flex-col gap-1 flex-wrap">
                    <div >
                        <div>Memory: {getMemoryUsage().toFixed(2)}%</div>
                    </div>
                    <BorderLinearProgress variant="determinate" value={getMemoryUsage()} />
                    <div className=" text-xs">{formatBytes(data.memory_stats.usage)}/{formatBytes(data.memory_stats.limit)}</div>

                </div>


            </DialogContent>
        </Dialog >
    )

}