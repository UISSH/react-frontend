import useSWR from "swr";
import { requestData } from "../../requests/http";
import { OperatingResIF } from "../../constant";
import React from "react";
import { Backdrop, CircularProgress, TextField } from "@mui/material";

interface NotifyDetailProps {
  eventID: string | null;
}


// 2023-06-15 17:25:03.521968 to 2023-06-15 17:25:03 
function formatTime(time: string) {
  return time.slice(0, 19);
}


export default function NotifyDetail(props: NotifyDetailProps) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const { data, isLoading, error } = useSWR<OperatingResIF>(
    props.eventID,
    async (event_id) => {
      let res = await requestData({
        url: `/api/Operating/${event_id}/`,
      });
      return (await res.json()) as OperatingResIF;
    }
  );
  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (data) {
    return (<>
    <div className="flex flex-col gap-2 p-4  ">
      <div className="flex flex-row gap-2">
      
        <TextField
        size="small"
        className="w-1/3"
        value={data.name}
        label="name"
        ></TextField>
      <TextField
        size="small"
        fullWidth
        value={data.event_id}
        label="event_id"
        defaultValue="Default Value"></TextField>
    </div>
    <div className="flex flex-col gap-2">
      <TextField size="small" fullWidth value={data.msg} multiline rows={8} label="msg"></TextField>

      <div className="text-right  opacity-75 text-sm">{formatTime(data.create_at)}</div>

    </div>
    </div></>)
  } else {
    return <div>no data</div>;
  }
}
