import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { useMemo, useState } from "react";
import BashEditor from "./BashEditor";
interface AddScheduleJobProps {
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

export default function AddScheduleJob(props: AddScheduleJobProps) {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();

  const [switchCustomShellScript, setSwitchCustomShellScript] = useState(false);
  const [shellscript, setShellscript] = useState(props.shellscript);

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <div>
            <div className="flex gap-2">
              <TextField
                {...register("schedule", { required: true })}
                label="schedule"
                defaultValue={props.schedule}
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
                  defaultValue={props.command}
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
                    value={switchCustomShellScript}
                    onChange={(event) => {
                      setSwitchCustomShellScript(event.target.checked);
                    }}
                  />
                }
                label="bash script"
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
          text={props.shellscript}
          onChange={(value) => {
            setShellscript(value);
          }}></BashEditor>
      )}
    </>
  );
}
