import {
  Box,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  CircularProgressProps,
  Typography,
} from "@mui/material";
import React from "react";

import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";
import { getWSGateway } from "../../requests/utils";
import { formatBytes } from "../../utils";

import { GlobalProgressAtom } from "../../store/recoilStore";
import { useRecoilState } from "recoil";
import SystemInfo from "./SystemInfo";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

function WithLabelCularProgress(
  props: CircularProgressProps & {
    value: number;
    label?: string | null;
    tooltip?: React.ReactNode;
  }
) {
  const getColor = () => {
    // "primary" | "secondary" | "error" | "info" | "success" | "warning" |

    if (props.value < 30) {
      return "primary";
    } else if (props.value <= 60) {
      return "secondary";
    } else {
      return "warning";
    }
  };
  return (
    <HtmlTooltip
      followCursor
      title={
        <React.Fragment>
          <div> {props.tooltip}</div>
        </React.Fragment>
      }>
      <div>
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            sx={{
              color: (theme) =>
                theme.palette.grey[theme.palette.mode === "light" ? 50 : 800],
            }}
            size={"6rem"}
            thickness={4}
            {...props}
            value={100}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <CircularProgress
              color={getColor()}
              size={"6rem"}
              variant="determinate"
              {...props}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Typography
                fontSize={18}
                variant="caption"
                component="div"
                color={getColor()}>{`${Math.round(props.value)}%`}</Typography>
            </Box>
          </Box>
        </Box>
        <div className="text-center mt-2 uppercase">{props.label}</div>
      </div>
    </HtmlTooltip>
  );
}

export default function SystemStatus() {
  const { t } = useTranslation();
  const ws = useRef<WebSocket | null>(null);
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const [cpuStatus, setCpuStatus] = useState({
    used: 0,
    info_0: { idle: 0 } as { [key: string]: number },
    info_1: { idle: 0 } as { [key: string]: number },
  });
  const [memoryStatus, setMemoryStatus] = useState({
    used: 0,
    info: {} as { [key: string]: number },
  });
  const [diskStatus, setDiskStatus] = useState({
    used: 0,
    info: {} as { [key: string]: string },
  });
  const [loadAverageStatus, setLoadAverageStatus] = useState({
    used: 0,
    info: [] as any[],
    per_core_used: 0,
  });
  const [systemInfoStatus, setSystemInfoStatus] = useState({
    rows: [] as { id: number; name: string; value: string }[],
  });

  function calcTotalCPU(cpu: any) {
    return (
      Number(cpu.user) +
      Number(cpu.nice) +
      Number(cpu.idle) +
      Number(cpu.system) +
      Number(cpu.iowait) +
      Number(cpu.irq) +
      Number(cpu.softirq)
    );
  }

  function formatLoadAverage(load_list: any[]) {
    let loadAverage = { used: 0, per_core_used: 0, info: [] as any[] };
    let item = load_list.filter(
      (item: { period: string }) => item.period === "1m"
    )[0];
    loadAverage.used = Number((Number(item.average) * 100).toFixed(0));
    loadAverage.per_core_used = Number(
      ((Number(item.average) / Number(item.cpu_logical_cores)) * 100).toFixed(2)
    );
    loadAverage.info = load_list;

    setLoadAverageStatus({ ...loadAverage });
  }

  function formatCPU(cpu_time: any) {
    if (cpuStatus.info_0 == null) {
      setCpuStatus((state) => ({ ...state, info_0: cpu_time }));
    } else {
      let total_0 = calcTotalCPU(cpuStatus.info_0);
      delete cpu_time["_qtype"];

      let total_1 = calcTotalCPU(cpu_time);
      let used = (
        (1 -
          (Number(cpu_time.idle) - Number(cpuStatus.info_0.idle)) /
            (total_1 - total_0)) *
        100
      ).toFixed(2);
      if (used === "NaN") {
        used = "0";
      }
      cpuStatus.info_0 = cpu_time;
      setCpuStatus({ used: Number(used), info_0: cpu_time, info_1: cpu_time });
    }
  }
  function formatDisk(disk: any) {
    delete disk["_qtype"];

    let disk_info = { used: 0, info: {} };
    disk_info.used = Number(disk.used);
    disk_info.info = disk;
    setDiskStatus({ ...disk_info });
  }

  function formatSystemInfo(system_info: any) {
    delete system_info["_qtype"];
    let system_list = [];
    let c = 0;
    for (let _key in system_info) {
      if (_key === "uuid") {
        continue;
      }
      if (system_info[_key]) {
        let item = { id: c, name: _key, value: system_info[_key] };
        if (item.name === "physical_memory") {
          item.value = formatBytes(item.value);
        }
        system_list.push(item);
        c++;
      }
    }
    setSystemInfoStatus({ rows: system_list });
  }

  function formatMemory(memory_info: any) {
    delete memory_info["_qtype"];
    let memory = { info: {}, used: 0 };
    memory.info = memory_info;
    memory.used = Number(
      (
        ((Number(memory_info.memory_total) -
          Number(memory_info.buffers) -
          Number(memory_info.memory_free) -
          Number(memory_info.cached)) /
          Number(memory_info.memory_total)) *
        100
      ).toFixed(2)
    );
    setMemoryStatus({ ...memory });
  }

  useLayoutEffect(() => {
    setGlobalProgress(true);
    ws.current = new WebSocket(getWSGateway("server_status"));
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.code === 201) {
        let sql = "select *, 'cpu_time' as _qtype from cpu_time ;";
        sql +=
          "select *,(select cpu_logical_cores from system_info) as cpu_logical_cores , 'load_average' as _qtype from load_average;";
        sql += "select *, 'memory_info' as _qtype from memory_info;";

        sql +=
          "select system_info.*,kernel_info.version,'system_info' as _qtype  from  system_info,kernel_info;";
        sql +=
          " select printf('%.2f',((blocks - blocks_available * 1.0) * blocks_size)/1073741824) as used_space_gb, " +
          "printf('%.2f',(1.0 * blocks_available * blocks_size / 1073741824)) as space_left_gb, " +
          "printf('%.2f',(1.0 * blocks * blocks_size / 1073741824)) as total_space_gb, " +
          "printf('%.2f',(((blocks - blocks_available * 1.0) * blocks_size)/1073741824)/(1.0 * blocks * blocks_size / 1073741824)) * 100 as 'used', " +
          "printf('%.2f',(1.0 * blocks_available * blocks_size / 1073741824)/(1.0 * blocks * blocks_size / 1073741824)) * 100 as 'available' " +
          " , 'disk' as _qtype from mounts  " +
          "where path = '/';";

        ws.current?.send(
          JSON.stringify({
            query_sql: sql,
            interval: 1,
          })
        );
      } else {
        setGlobalProgress(false);
        let cpu_time = data.message.out.filter(
          (item: any) => item._qtype === "cpu_time"
        )[0];

        formatCPU(cpu_time);
        let memory_info = data.message.out.filter(
          (item: any) => item._qtype === "memory_info"
        )[0];

        formatMemory(memory_info);
        let disk = data.message.out.filter(
          (item: any) => item._qtype === "disk"
        )[0];
        formatDisk(disk);

        let load_average = data.message.out.filter(
          (item: any) => item._qtype === "load_average"
        );
        formatLoadAverage(load_average);
        let system_info = data.message.out.filter(
          (item: any) => item._qtype === "system_info"
        )[0];
        formatSystemInfo(system_info);
      }
    };

    return () => {
      // GlobalProgress()(false)

      ws.current?.close();
    };
  }, [ws]);

  return (
    <div className="space-y-2">
      <Card className="shadow-sm rounded-2xl ">
        <CardContent>
          <Typography className="uppercase" variant="h6" component="div">
            {t("overview.status.status")}
          </Typography>
          <div className="flex flex-wrap p-4 w-full gap-2 justify-between">
            <WithLabelCularProgress
              tooltip={loadAverageStatus.info.map((item) => (
                <div key={item.period} className="flex justify-between ">
                  <div className="">{item.period}</div>
                  <div className="pl-2">{Number(item.average).toFixed(2)}</div>
                </div>
              ))}
              label={t("overview.status.load")}
              value={loadAverageStatus.used}
            />
            <WithLabelCularProgress
              label={t("overview.status.cpu")}
              tooltip={Object.keys(cpuStatus.info_1).map((k) => (
                <div key={k} className="flex justify-between">
                  <div>{k}</div>
                  <div className="pl-2">{cpuStatus.info_1[k]}</div>
                </div>
              ))}
              value={cpuStatus.used}
            />
            <WithLabelCularProgress
              label={t("overview.status.ram")}
              value={memoryStatus.used}
              tooltip={Object.keys(memoryStatus.info).map((k) => (
                <div key={k} className="flex justify-between">
                  <div>{k}</div>
                  <div className="pl-2">
                    {formatBytes(memoryStatus.info[k])}
                  </div>
                </div>
              ))}
            />
            <WithLabelCularProgress
              label={t("overview.status.disk")}
              value={diskStatus.used}
              tooltip={Object.keys(diskStatus.info).map((k) => (
                <div key={k} className="flex justify-between">
                  <div>{k}</div>
                  <div className="pl-2">{diskStatus.info[k]} GB</div>
                </div>
              ))}
            />
          </div>
        </CardContent>
        <CardActions></CardActions>
      </Card>
      <Card className="shadow-sm rounded-2xl ">
        <CardContent>
          <Typography className="uppercase" variant="h6" component="div">
            {t("overview.status.system-info")}
          </Typography>

          <div className="px-4">
            <SystemInfo rows={systemInfoStatus.rows}></SystemInfo>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
