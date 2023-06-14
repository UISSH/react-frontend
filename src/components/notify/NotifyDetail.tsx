import useSWR from "swr";
import { requestData } from "../../requests/http";
import { OperatingResIF } from "../../constant";
import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

interface NotifyDetailProps {
  eventID: string | null;
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
    return <div>{JSON.stringify(data, null, 2)}</div>;
  } else {
    return <div>no data</div>;
  }
}
