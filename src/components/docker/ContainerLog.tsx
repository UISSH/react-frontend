import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import useSWR, { mutate } from "swr";
import { requestData } from "../../requests/http";
import { OperatingResIF } from "../../constant";
import { Box, Dialog, DialogContent, IconButton, TextField, Tooltip } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from "react";
import { Download } from "@mui/icons-material";
import { getApiGateway } from "../../requests/utils";
import RefreshIcon from '@mui/icons-material/Refresh';

interface ContainerLogsProps {
    containerId: string;
    open: boolean;
    onClose: () => void;
}
export default function ContainerLogs(props: ContainerLogsProps) {

    const [t] = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const { mutate, data, error, isLoading } = useSWR<OperatingResIF>(`/api/DockerContainer/${props.containerId}/logs/`, async (url) => {

        if (!props.containerId || !props.open) {
            return;
        }

        let res = await requestData({
            url,
            method: "GET"
        })

        return await res.json();
    });

    if (error) {
        enqueueSnackbar(error, {
            variant: "error",
        });
    }
    async function handleDownloadLogs(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation()
        let res = await requestData({
            url: `/api/DockerContainer/${props.containerId}/donwloadLogs/`
        })
        let resJson = await res.json();
        let path = resJson.msg;
        if (res.ok) {
            requestData({
                url: "/api/FileBrowser/request_download_file/",
                params: {
                    path: path
                },
            }).then(async (res) => {
                if (res.ok) {
                    let apiUrl = getApiGateway();
                    let resJson = await res.json();
                    let url =
                        apiUrl +
                        `/api/FileBrowser/download_file/?path=${path}&token=${resJson.msg}`;
                    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                        window.open(url, "_blank");
                    } else {
                        window.location.href = url;
                    }
                }
            });
        }

    }
    useEffect(() => {
        let timer = setInterval(() => {
            if (props.open && props.containerId) {
                mutate()
            }
        }, 3000)
        return () => {
            clearInterval(timer);
        }
    }, [props.open, props.containerId])

    return (
        <>
            <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="xl">
                <DialogContent className="flex justify-between items-center" sx={{
                    backgroundColor: (theme) => theme.palette.primary.main,
                    color: (theme) => theme.palette.primary.contrastText
                }}>

                    <div>Logs</div>
                    <div className="flex gap-2 items-center">
                        <Tooltip title="donwload full log">
                            <IconButton size="small"
                                onClick={handleDownloadLogs}
                                sx={{
                                    color: (theme) => theme.palette.primary.contrastText
                                }}>
                                <Download></Download>
                            </IconButton>
                        </Tooltip>
                        <IconButton
                            size="small"
                            sx={{
                                color: (theme) => theme.palette.primary.contrastText
                            }} onClick={props.onClose}>
                            <CloseIcon></CloseIcon>
                        </IconButton>
                    </div>

                </DialogContent>
                <DialogContent className="p-0">
                    <div className="ml-2">show docker container logs in last 60 minutes.</div>
                    {isLoading ? <div className=" p-2 flex flex-col items-center ">
                        <RefreshIcon color="primary" fontSize="large" className=" animate-spin"></RefreshIcon>
                        <Box sx={{
                            color: (theme) => theme.palette.text.secondary
                        }} className="opacity-90">loading...</Box>
                    </div> :
                        <TextField focused fullWidth maxRows={22} multiline value={data?.msg}
                            variant="filled"
                            className="pl-1 pt-1 pr-1 pb-0"
                            InputProps={{
                                readOnly: true,
                                style: {
                                    padding: "0.2rem 0rem 0.2rem 1rem",
                                }
                            }}

                            inputProps={{
                                style: {

                                    fontSize: "0.875rem"
                                }
                            }} ></TextField>}
                </DialogContent>
            </Dialog >
        </>
    )
}