import { SubmitHandler, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { isValidCron } from "cron-validator";

import BashEditor from "./BashEditor";
import { requestData } from "../../requests/http";
import { useLocation } from "react-router-dom";
import { t } from "i18next";
interface UpdateCrontabProps {
  children?: React.ReactNode;
  className?: string;
  id?: number | string;
  schedule?: string;
  command?: string;
  shellscript?: string;
  update_at?: string;
}

interface IFormInput {
  schedule: string;
  command: string;
  shellscript: string;
}

export default function UpdateCrontab(props: UpdateCrontabProps) {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  let location = useLocation();

  const [switchCustomShellScript, setSwitchCustomShellScript] = useState(false);
  const [shellscript, setShellscript] = useState(props.shellscript);

  useEffect(() => {
    if (location.state?.id) {
      reset({
        schedule: location.state?.schedule,
        command: location.state?.command,
      });
      setSwitchCustomShellScript(true);
      console.log(location.state);
    }
  }, [location.state]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    let playload;
    if (switchCustomShellScript) {
      playload = {
        schedule: data.schedule,
        command: 'echo "hello world."',
        shellscript: shellscript,
      };
    } else {
      playload = {
        schedule: data.schedule,
        command: data.command,
      };
    }

    if (location.state?.id) {
      let res = await requestData({
        url: `/api/Crontab/${location.state.id}/`,
        method: "PATCH",
        data: playload,
      });
    } else {
      let res = await requestData({
        url: "/api/Crontab/",
        method: "POST",
        data: playload,
      });
    }
  };

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex gap-2">
              <TextField
                {...register("schedule", {
                  required: true,
                  validate: (value, formValues) => {
                    if (value == "@reboot") return true;
                    return (
                      (value && isValidCron(value)) ||
                      "invalid schedule format, please check https://crontab.guru/"
                    );
                  },
                })}
                label="schedule"
                defaultValue={props.schedule || location.state?.schedule}
                variant="outlined"
                margin="normal"
                size="small"
                fullWidth
                error={!!errors.schedule}
                helperText={errors.schedule?.message}
              />

              {!switchCustomShellScript && (
                <TextField
                  {...register("command", {
                    required: switchCustomShellScript ? false : true,
                  })}
                  fullWidth
                  size="small"
                  label="command"
                  defaultValue={props.command || location.state?.command}
                  variant="outlined"
                  margin="normal"
                  error={!!errors.command}
                  helperText={errors.command?.message}
                />
              )}
            </div>

            <div className="flex justify-between">
              <FormControlLabel
                control={
                  <Switch
                    checked={switchCustomShellScript}
                    onChange={(event) => {
                      setSwitchCustomShellScript(event.target.checked);
                    }}
                  />
                }
                label="Custom Shell"
              />
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
      {switchCustomShellScript && (
        <BashEditor
          text={props.shellscript || location.state?.shellscript}
          onChange={(value) => {
            setShellscript(value);
          }}></BashEditor>
      )}
    </>
  );
}
