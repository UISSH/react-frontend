import FormGroup from "@mui/material/FormGroup";

import {
  Button,
  Checkbox,
  FormControlLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import { requestData } from "../../requests/http";
import APPLICATION_OPTIONS from "./data";
import { PureFunctionContext } from "../../Context";
import { useSnackbar } from "notistack";
import { OperatingResIF } from "../../constant";

interface IFormInput {
  protocol: "ALL" | "TCP" | "UDP";
  port: string;
  ip: string;
}

function MyFormHelperText(props: { value?: string }) {
  const [t] = useTranslation();
  const { focused } = useFormControl() || {};

  if (props.value) {
    return <FormHelperText>{t(props.value)}</FormHelperText>;
  }

  const helperText = React.useMemo(() => {
    if (focused) {
      return "iptables.ip_focused_helper_text";
    }

    return "iptables.ip_helper_text";
  }, [focused]);

  return <FormHelperText>{t(helperText)}</FormHelperText>;
}

export default function AddIPTablesRule(props: {
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  const [t] = useTranslation();
  const onReloadTableData = React.useContext(PureFunctionContext);
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  const { enqueueSnackbar } = useSnackbar();

  const [application, setApplication] = React.useState("custom");
  const [protocol, setProtocol] = React.useState("ALL");
  const [port, setPort] = React.useState("22");
  const [Restrict, setRestrict] = React.useState(false);
  const [ip, setIp] = React.useState("");
  const [ufwCommand, setUfwCommand] = React.useState("");

  const handleApplicationChange = (event: SelectChangeEvent) => {
    let key = event.target.value as string;
    setApplication(key);
    setProtocol(APPLICATION_OPTIONS[key].protocol.value);
    setPort(APPLICATION_OPTIONS[key].port_or_range.value);
  };

  const ApplicationMenuItems = React.useMemo<React.ReactNode>(() => {
    return Object.keys(APPLICATION_OPTIONS).map((key) => {
      return (
        <MenuItem key={key} value={key}>
          {APPLICATION_OPTIONS[key].label}
        </MenuItem>
      );
    });
  }, [APPLICATION_OPTIONS]);

  const isReadOnlyProtocol = React.useMemo(() => {
    if (application === "") {
      return true;
    }
    return APPLICATION_OPTIONS[application].protocol.readOnly;
  }, [application]);

  const isReadOnlyPort = React.useMemo(() => {
    if (application === "") {
      return true;
    }
    return APPLICATION_OPTIONS[application].port_or_range.readOnly;
  }, [application]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);
    let res = await requestData({
      url: "/api/Operating/excute_command_sync/",
      method: "POST",
      data: {
        cwd: "/tmp",
        command: ufwCommand,
      },
    });
    let resJson = (await res.json()) as OperatingResIF;
    if (resJson.result.result_text === "SUCCESS") {
      enqueueSnackbar(t("iptables.add_rule_success"), {
        variant: "success",
      });
    } else {
      enqueueSnackbar(resJson.msg, {
        variant: "error",
      });

      enqueueSnackbar(t("iptables.add_rule_failed"), {
        variant: "error",
      });
    }
    onReloadTableData();
  };

  React.useEffect(() => {
    if (application !== "") {
      let cmd = "";
      if (Restrict) {
        let proto = protocol === "ALL" ? "" : "proto " + protocol.toLowerCase();
        cmd = `ufw allow from ${ip} ${proto} to any port ${port}`;
      } else {
        let proto = protocol === "ALL" ? "" : "/" + protocol.toLowerCase();
        cmd = `ufw allow ${port}${proto}`;
      }
      setUfwCommand(cmd);
    }
  }, [protocol, port, Restrict, ip]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup className="gap-2 p-2">
          <div className="flex gap-2 flex-wrap items-start">
            <FormControl>
              <InputLabel id="application-simple-select-label">
                {t("iptables.application")}
              </InputLabel>
              <Select
                size="small"
                labelId="application-simple-select-label"
                id="application-select"
                value={application}
                sx={{
                  minWidth: 120,
                }}
                label="application"
                onChange={handleApplicationChange}>
                {ApplicationMenuItems}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="protocol-simple-select-label">
                {t("iptables.protocol")}
              </InputLabel>
              <Select
                readOnly={isReadOnlyProtocol}
                disabled={isReadOnlyProtocol}
                size="small"
                labelId="protocol-simple-select-label"
                id="protocol-select"
                value={protocol}
                sx={{
                  minWidth: 120,
                }}
                label={t("iptables.protocol")}
                onChange={(e) => {
                  setProtocol(e.target.value as string);
                }}>
                <MenuItem value={"ALL"}>ALL</MenuItem>
                <MenuItem value={"TCP"}>TCP</MenuItem>
                <MenuItem value={"UDP"}>UDP</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <TextField
                {...register("port", {
                  required: {
                    value: true,
                    message: t("iptables.port_required"),
                  },

                  validate: (value, formValues) => {
                    if (value.includes(":")) {
                      let tuple = value.split(":");
                      if (tuple.length !== 2) {
                        return false;
                      }
                      let start = Number(tuple[0]);
                      let end = Number(tuple[1]);

                      if (!start || !end) {
                        return false;
                      }

                      if (start > end) {
                        return false;
                      }

                      if (start < 1 || start > 65535) {
                        return false;
                      }
                      if (end < 1 || end > 65535) {
                        return false;
                      }
                    } else {
                      if (!Number(value)) {
                        return false;
                      }
                    }
                    return true;
                  },
                })}
                disabled={isReadOnlyPort}
                size="small"
                error={!!errors.port}
                helperText={
                  errors.port?.message ||
                  t("iptables.port_or_range_helper_text")
                }
                id="port-or-range"
                value={port}
                onChange={(event) => {
                  setPort(event.target.value as string);
                }}
                label={t("iptables.port_or_range")}
                variant="outlined"
                type="string"
              />
            </FormControl>

            <FormControlLabel
              className="whitespace-nowrap"
              control={
                <Checkbox
                  size="small"
                  onChange={(e) => {
                    setRestrict(e.target.checked);
                  }}
                  value={Restrict}
                  className="ml-2"
                />
              }
              label={t("iptables.restrict_to_ip_address")}
            />

            {Restrict && (
              <div>
                <FormControl>
                  <OutlinedInput
                    {...register("ip", {
                      required: {
                        value: true,

                        message: t("iptables.ip_required"),
                      },
                      pattern: {
                        value:
                          /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
                        // message: "Invalid IP address",
                        message: t("iptables.invalid_ip_address"),
                      },
                    })}
                    value={ip}
                    onChange={(event) => {
                      setIp(event.target.value as string);
                    }}
                    // helperText={errors.ip?.message}
                    error={!!errors.ip}
                    size="small"
                    placeholder="192.0.2.0"
                  />
                  <MyFormHelperText value={errors.ip?.message} />
                </FormControl>
              </div>
            )}
          </div>
        </FormGroup>
        <div className="p-2">
          <TextField
            label={t("iptables.command")}
            helperText={t("iptables.ufw_command_helper_text")}
            fullWidth
            size="small"
            onChange={(e) => {
              setUfwCommand(e.target.value);
            }}
            value={ufwCommand}></TextField>
        </div>
        <div className="flex gap-2 justify-end p-2">
          <Button
            size="small"
            variant="contained"
            color="primary"
            type="submit">
            {t("iptables.allow")}
          </Button>
        </div>
      </form>
    </>
  );
}
