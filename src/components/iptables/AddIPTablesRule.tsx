import FormGroup from "@mui/material/FormGroup";

import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import APPLICATION_OPTIONS from "./data";
function MyFormHelperText() {
  const { focused } = useFormControl() || {};

  const helperText = React.useMemo(() => {
    if (focused) {
      return "Source IP address (192.0.2.0) or range (192.0.2.0/24)";
    }

    return "Specify an IP address allowed to connect to your vps. You can specify a range of IP addresses using CIDR notation. ";
  }, [focused]);

  return <FormHelperText>{helperText}</FormHelperText>;
}

export default function AddIPTablesRule(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [age, setAge] = React.useState("");
  const [application, setApplication] = React.useState("");
  const [protocol, setProtocol] = React.useState("");
  const [port, setPort] = React.useState("");
  const [Restrict, setRestrict] = React.useState(false);
  const [ip, setIp] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const handleApplicationChange = (event: SelectChangeEvent) => {
    let key = event.target.value as string;
    setApplication(key);
    setProtocol(APPLICATION_OPTIONS[key].protocol.value);
    setPort(APPLICATION_OPTIONS[key].port_or_range.value);
  };

  const handleOk = () => {
    console.log(getUFWCommand);
  };

  const getUFWCommand = React.useMemo(() => {
    if (application === "") return "";
    let cmd = "";
    if (Restrict) {
      let proto = protocol === "ALL" ? "" : "proto " + protocol.toLowerCase();
      cmd = `ufw allow from ${ip} ${proto} to any port ${port}`;
    } else {
      let proto = protocol === "ALL" ? "" : "/" + protocol.toLowerCase();
      cmd = `ufw allow from ${port}${proto}`;
    }
    return cmd;
  }, [application, protocol, port, Restrict, ip]);

  const ApplicationMenuItems = React.useMemo<React.ReactNode>(() => {
    return Object.keys(APPLICATION_OPTIONS).map((key) => {
      return (
        <MenuItem key={key} value={key}>
          {APPLICATION_OPTIONS[key].label}
        </MenuItem>
      );
    });
  }, [APPLICATION_OPTIONS]);

  return (
    <>
      <FormGroup className="gap-2 p-2">
        <div className="flex gap-2 flex-wrap items-start">
          <FormControl>
            <InputLabel id="application-simple-select-label">
              application
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
            <InputLabel id="protocol-simple-select-label">Protocol</InputLabel>
            <Select
              size="small"
              labelId="protocol-simple-select-label"
              id="protocol-select"
              value={protocol}
              sx={{
                minWidth: 120,
              }}
              label="protocol"
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
              size="small"
              id="port-or-range"
              value={port}
              label="Port or range            "
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
            label="Restrict to IP address"
          />

          {Restrict && (
            <div>
              <FormControl>
                <OutlinedInput
                  value={ip}
                  onChange={(event) => {
                    setIp(event.target.value as string);
                  }}
                  size="small"
                  placeholder="192.0.2.0"
                />
                <MyFormHelperText />
              </FormControl>
            </div>
          )}
        </div>
      </FormGroup>
      <div className="p-2">
        <TextField
          label="command"
          helperText="You can also modify this command before executing it or fully customize it."
          fullWidth
          size="small"
          value={getUFWCommand}></TextField>
      </div>
      <div className="flex gap-2 justify-end p-2">
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleOk}>
          ok
        </Button>
        <Button size="small" variant="contained" color="secondary">
          cancel
        </Button>
      </div>
    </>
  );
}
