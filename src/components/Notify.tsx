import { Close } from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import ErrorIcon from "@mui/icons-material/Error";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import { Box, IconButton } from "@mui/material";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import * as React from "react";
import { useState } from "react";
import useSWR from "swr";
import { DjangoPaginationIF, OperatingResIF, ResultTextIF } from "../constant";
import { requestData } from "../requests/http";
function StatusIcon(props: { status: ResultTextIF }) {
  return (
    <div>
      {props.status === "SUCCESS" && (
        <CheckCircleOutlineIcon color="success"></CheckCircleOutlineIcon>
      )}
      {props.status === "FAILURE" && <ErrorIcon color="error"></ErrorIcon>}
      {props.status === "PROCESSING" && (
        <RotateRightIcon
          className=" animate-spin"
          color="info"></RotateRightIcon>
      )}
      {props.status === "PENDING" && (
        <AccessTimeIcon color="secondary"></AccessTimeIcon>
      )}
    </div>
  );
}

function Sidebar(props: {
  open: boolean;
  children?: React.ReactNode;
  onClose?: () => void;
}) {
  if (!props.open) {
    return <div></div>;
  }

  const { data, error, isLoading } = useSWR("/api/Operating/", async (url) => {
    let res = await requestData({
      url: url,
    });

    return (await res.json()) as DjangoPaginationIF<OperatingResIF>;
  });

  return (
    <aside
      id="default-sidebar"
      className=" fixed  top-0  right-0 z-40 w-64 h-screen transition-transform  translate-x-0"
      aria-label="Sidebar">
      <Box
        className="h-full  overflow-y-auto "
        sx={{
          color: (theme) => theme.palette.text.primary,
          boxShadow: (theme) => theme.shadows[24],
          backgroundColor: (theme) => theme.palette.background.paper,
        }}>
        <div className="h-full">
          <div className="flex justify-end">
            <IconButton onClick={props.onClose}>
              <Close></Close>
            </IconButton>
          </div>
          <div>{isLoading && <div>loading</div>}</div>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {data &&
              data.results.map((item) => {
                return (
                  <ListItem
                    key={item.event_id}
                    alignItems="flex-start"
                    className="flex gap-2 justify-between  ">
                    <div>
                      <div className="flex justify-between">
                        <StatusIcon status={item.result_text}></StatusIcon>
                        <div className="text-lg">
                          {item.name ? item.name : item.msg.substring(0, 5)}
                        </div>
                      </div>
                      <div
                        className="text-xs whitespace-nowrap opacity-80	"
                        style={{ minWidth: "210px" }}>
                        {item.event_id.replace(/-/g, "")}
                      </div>
                      <div className="text-sm overflow-y-auto mt-4">
                        {item.msg.substring(0, 64)} ...
                      </div>
                    </div>
                  </ListItem>
                );
              })}
          </List>
        </div>
      </Box>
    </aside>
  );
}

export default function Notify() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div>
        <Sidebar open={open} onClose={handleClose}></Sidebar>
        <div className=" cursor-pointer" onClick={handleOpen}>
          <Badge variant="dot" color="info">
            <CircleNotificationsIcon />
          </Badge>
        </div>
      </div>
    </>
  );
}
