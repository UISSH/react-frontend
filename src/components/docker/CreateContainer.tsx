import { Button, FormGroup, IconButton, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { requestData } from "../../requests/http";
import { OperatingResIF } from "../../constant";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
export interface RunNewContainerProps {}

interface VolumeIF {
  hostPath: string;
  containerPath: string;
}

interface ENVIF {
  key: string;
  value: string;
}

interface IFormInput {
  name: string;
  hostPort: number;
  containerPort: number;
  volumes: VolumeIF[];
  environment: ENVIF[];
}
export default function RunNewContainer(props: RunNewContainerProps) {
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  const imageName = "louislam/uptime-kuma:1";
  const [volumeCount, setVolumeCount] = useState<number>(1);
  const [envCount, setENVCount] = useState<number>(1);
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    let volumes = [];
    let environment = [];

    for (let i = 0; i < data.volumes.length; i++) {
      if (data.volumes[i].containerPath) {
        volumes.push(
          `${data.volumes[i].hostPath}:${data.volumes[i].containerPath}`
        );
      }
    }

    for (let i = 0; i < data.environment.length; i++) {
      if (data.environment[i].value) {
        environment.push(data.environment[i]);
      }
    }

    let payload;
    payload = {
      name: data.name,
      image: imageName,
      binds: volumes,
      environment: [],
    };

    if (data.hostPort != null) {
      payload = {
        ...payload,
        port_bindings: { [data.containerPort]: Number(data.hostPort) },
      };
    }

    console.log(payload);

    enqueueSnackbar("Creating...", { variant: "info" });

    let res = await requestData({
      url: "/api/DockerContainer/create_container/",
      method: "POST",
      data: payload,
    });

    let resJson = (await res.json()) as OperatingResIF;
    if (resJson.result.result_text === "SUCCESS") {
      enqueueSnackbar("success", { variant: "success" });
    } else {
      enqueueSnackbar(resJson.msg, { variant: "error" });
      return;
    }

    enqueueSnackbar("Starting...", { variant: "info" });
    // /api/DockerContainer/{docker_id}/start/
    res = await requestData({
      url: `/api/DockerContainer/${resJson.msg}/start/`,
      method: "POST",
    });

    resJson = (await res.json()) as OperatingResIF;
    if (resJson.result.result_text === "SUCCESS") {
      enqueueSnackbar("success", { variant: "success" });
    } else {
      enqueueSnackbar(resJson.msg, { variant: "error" });
      return;
    }

    reset();
  };

  const getError = (props: {
    filedName: "volumes" | "environment";
    key: string;
    index: number;
  }) => {
    const { filedName, key, index } = props;

    if (Object.keys(errors).length != 0) {
      console.log(errors);
    }

    let data = {
      error: false,
      message: "",
    };

    //@ts-ignore
    if (errors[filedName] && errors[filedName][index]) {
      //@ts-ignore
      if (errors[filedName][index][key]) {
        data.error = true;
        //@ts-ignore
        data.message = errors[filedName][index][key].message;
      }
    }

    return data;
  };

  const volumesJSX = useMemo(() => {
    let el = [];
    for (let c = 0; c < volumeCount; c++) {
      el.push(c);
    }
    return (
      <>
        {el.map((i) => {
          return (
            <div key={"volumes_" + i}>
              <div className="flex gap-2 w-full justify-between">
                <TextField
                  className="w-full"
                  {...register(`volumes.${i}.hostPath`, {
                    required: false,
                  })}
                  size="small"
                  error={
                    getError({
                      filedName: "volumes",
                      key: "hostPath",
                      index: i,
                    }).error
                  }
                  helperText={
                    getError({
                      filedName: "volumes",
                      key: "hostPath",
                      index: i,
                    }).message
                  }
                  label="Host path"
                  variant="outlined"
                  type="string"
                />
                <TextField
                  className="w-full"
                  {...register(`volumes.${i}.containerPath`, {
                    required: false,
                  })}
                  size="small"
                  error={
                    getError({
                      filedName: "volumes",
                      key: "containerPath",
                      index: i,
                    }).error
                  }
                  helperText={
                    getError({
                      filedName: "volumes",
                      key: "containerPath",
                      index: i,
                    }).message
                  }
                  label="Container path"
                  variant="outlined"
                  type="string"
                />
                {i + 1 == volumeCount ? (
                  <IconButton
                    onClick={() => {
                      setVolumeCount(volumeCount + 1);
                    }}>
                    <AddIcon></AddIcon>
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      setVolumeCount(volumeCount - 1);
                    }}>
                    <RemoveIcon></RemoveIcon>
                  </IconButton>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  }, [volumeCount, errors]);

  const ENVJSX = useMemo(() => {
    let el = [];
    for (let c = 0; c < envCount; c++) {
      el.push(c);
    }

    return (
      <>
        {el.map((i) => {
          return (
            <div key={"env_" + i}>
              <div className="flex gap-2 w-full justify-between">
                <TextField
                  className="w-full"
                  {...register(`environment.${i}.key`, {
                    required: false,
                  })}
                  size="small"
                  error={
                    getError({
                      filedName: "environment",
                      key: "key",
                      index: i,
                    }).error
                  }
                  helperText={
                    getError({
                      filedName: "environment",
                      key: "key",
                      index: i,
                    }).message
                  }
                  label="Variable"
                  variant="outlined"
                  type="string"
                />
                <TextField
                  className="w-full"
                  {...register(`environment.${i}.value`, {
                    required: false,
                  })}
                  size="small"
                  error={
                    getError({
                      filedName: "environment",
                      key: "value",
                      index: i,
                    }).error
                  }
                  helperText={
                    getError({
                      filedName: "environment",
                      key: "value",
                      index: i,
                    }).message
                  }
                  label="Value"
                  variant="outlined"
                  type="string"
                />
                {i + 1 == envCount ? (
                  <IconButton
                    onClick={() => {
                      setENVCount(envCount + 1);
                    }}>
                    <AddIcon></AddIcon>
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      setENVCount(envCount - 1);
                    }}>
                    <RemoveIcon></RemoveIcon>
                  </IconButton>
                )}
              </div>
            </div>
          );
        })}
      </>
    );
  }, [envCount, errors]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-2 ">
        <div className="text-2xl">Run a new container </div>
        <div className="text-sm underline decoration-sky-600">{imageName}</div>
      </div>
      <FormGroup className="gap-4 p-2">
        <TextField
          {...register("name", {
            required: true,
          })}
          size="small"
          error={!!errors.name}
          helperText={
            errors.name?.message ||
            "A random name is generated if you do not provide one."
          }
          label="name"
          variant="outlined"
          type="string"
        />

        <div className="flex  gap-2">
          <TextField
            {...register("hostPort", {
              required: true,
            })}
            size="small"
            error={!!errors.hostPort}
            helperText={
              errors.hostPort?.message ||
              "Enter “0” to assign randomly generated host ports."
            }
            label="hostPort"
            variant="outlined"
            type="number"
          />
          <TextField
            {...register("containerPort", {
              required: true,
            })}
            size="small"
            error={!!errors.containerPort}
            helperText={errors.containerPort?.message}
            label="containerPort"
            variant="outlined"
            type="number"
          />
        </div>

        <div>Volumes</div>
        {volumesJSX}
        <div>Environment variables</div>
        {ENVJSX}

        <Button size="small" variant="contained" color="primary" type="submit">
          ok
        </Button>
      </FormGroup>
    </form>
  );
}
