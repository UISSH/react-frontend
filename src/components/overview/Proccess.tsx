import { useSnackbar } from "notistack";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { getWSGateway } from "../../requests/utils";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { formatBytes } from "../../utils";
import CardDialog from "../CardDialog";
import OsqueryResult from "./interfaces";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { requestData } from "../../requests/http";
import { set } from "react-hook-form";
import { OperatingResIF } from "../../constant";
export interface SystemProccessProps {
  open: boolean;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

interface ProccessIF {
  cmdline: string;
  username: string;
  cwd: string;
  disk_bytes_read: string;
  disk_bytes_written: string;
  egid: string;
  euid: string;
  gid: string;
  name: string;
  nice: string;
  on_disk: string;
  parent: string;
  path: string;
  pgroup: string;
  pid: string;
  resident_size: string;
  root: string;
  sgid: string;
  start_time: string;
  state: string;
  suid: string;
  system_time: string;
  threads: string;
  total_size: string;
  uid: string;
  user_time: string;
  wired_size: string;
}

export default function SystemProccess(props: SystemProccessProps) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const ws = useRef<WebSocket>();
  const [data, setData] = useState<ProccessIF[]>([]);

  useLayoutEffect(() => {
    ws.current = new WebSocket(getWSGateway("server_status"));

    ws.current.onmessage = (e) => {
      if (ws.current === undefined || ws.current.CONNECTING) return;
      let data = JSON.parse(e.data);
      let sql =
        "SELECT p.name,p.*,u.username FROM processes p left join USERS u on p.uid = u.uid order by resident_size desc";
      if (data.code === 201) {
        ws.current.send(
          JSON.stringify({
            query_sql: sql,
            interval: 5,
          })
        );
      } else {
        data = JSON.parse(e.data) as OsqueryResult;
        setData(data.message.out);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [ws]);

  if (data == undefined || data.length === 0) {
    return <></>;
  }

  return (
    <>
      <CardDialog open={props.open} onClose={props.onClose}>
        <BasicTable
          rows={data.filter((item) => item.resident_size)}
        ></BasicTable>
      </CardDialog>
    </>
  );
}

function BasicTable(props: { rows: ProccessIF[] }) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const handleKillProcess = async (pid: string) => {
    console.log(pid);

    setGlobalLoadingAtom(true);
    let res = await requestData({
      method: "POST",
      url: "/api/Operating/excute_command_sync/",
      data: {
        cwd: "/tmp",
        command: "kill -9 " + pid,
      },
    });
    if (!res.ok) {
      enqueueSnackbar("request error.", { variant: "error" });
      setGlobalLoadingAtom(false);
      return;
    }
    let resJson = (await res.json()) as OperatingResIF;

    if (resJson.result.result_text == "SUCCESS") {
      enqueueSnackbar("kill process success.", { variant: "success" });
    } else {
      enqueueSnackbar("kill process failed.", { variant: "error" });
    }
    setGlobalLoadingAtom(false);
  };
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
            }}
          >
            <TableCell
              sx={{
                color: (theme) => theme.palette.primary.contrastText,
              }}
            >
              name
            </TableCell>
            <TableCell
              sx={{
                color: (theme) => theme.palette.primary.contrastText,
              }}
              align="right"
            >
              uid
            </TableCell>
            <TableCell
              sx={{
                color: (theme) => theme.palette.primary.contrastText,
              }}
              align="right"
            >
              pid
            </TableCell>
            <TableCell
              sx={{
                color: (theme) => theme.palette.primary.contrastText,
              }}
              align="right"
            >
              memory
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <TableRow
              className="group"
              key={row.pid}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                className="flex items-center gap-1"
              >
                <div>{row.name}</div>
                <IconButton
                  size="small"
                  className="invisible group-hover:visible"
                  onClick={() => {
                    handleKillProcess(row.pid);
                  }}
                >
                  <Close></Close>
                </IconButton>
              </TableCell>
              <TableCell align="right">
                {row.username}({row.uid})
              </TableCell>
              <TableCell align="right">{row.pid}</TableCell>
              <TableCell align="right">
                {formatBytes(Number(row.resident_size))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
