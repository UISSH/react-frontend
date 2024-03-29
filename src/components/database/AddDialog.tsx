import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { fetchData, fetchDataProps, requestData } from "../../requests/http";
import { generateRandom } from "../../utils";
import CardDialog from "../CardDialog";
interface IFormInput {
  name: string;
  username: string;
  password: string;
}
export default function Index(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const requestCreateDatabseInstance = async (id: string) => {
    let createDatabaseRes = await requestData({
      url: `/api/DataBase/${id}/create_instance/`,
      method: "POST",
    });

    if (createDatabaseRes.ok) {
      handleClose();
    } else {
      enqueueSnackbar(t("Create database instance error"), {
        variant: "error",
      });
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    //let res = await fetchData(fecthProps);
    let res = await requestData({
      url: "database",
      method: "POST",
      data: data,
    });

    if (res.status === 201) {
      let resJson = await res.json();
      console.log(resJson.id);
      requestCreateDatabseInstance(resJson.id);
      enqueueSnackbar(t("database.create.success"), {
        variant: "success",
      });
    } else if (res.status === 400) {
      enqueueSnackbar(JSON.stringify(await res.json()), {
        variant: "error",
      });
    } else {
      enqueueSnackbar(t("error"), { variant: "error" });
    }
  };

  const handleClose = () => {
    reset();
    props.setOpen(false);
  };

  return (
    <>
      <CardDialog disableEscapeKeyDown open={props.open} onClose={handleClose}>
        <DialogTitle>{t("Create Database")}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="grid gap-2">
            <TextField
              {...register("name", {
                required: true,
                pattern: {
                  // don't allow numbers at the beginning of the string
                  value: /^[a-zA-Z][a-zA-Z0-9]*$/,
                  message: t("Invalid database name"),
                },
              })}
              size="small"
              required
              error={errors.name ? true : false}
              helperText={errors.name?.message}
              label={t("database.name")}
            ></TextField>

            <TextField
              {...register("username", {
                required: true,
                minLength: {
                  value: 3,
                  message: "min length is 3",
                },
              })}
              defaultValue={generateRandom(8)}
              required
              size="small"
              error={errors.username ? true : false}
              helperText={errors.username?.message}
              autoComplete="username"
              label={t("database.username")}
            ></TextField>

            <TextField
              {...register("password", {
                required: true,
              })}
              required
              size="small"
              defaultValue={generateRandom(16)}
              error={errors.password ? true : false}
              helperText={errors.password?.message}
              label={t("database.password")}
              autoComplete="new-password"
            ></TextField>

            {/* <Controller
              name="name"
              defaultValue={""}
              rules={{
                required: true,
                pattern: {
                  // don't allow numbers at the beginning of the string
                  value: /^[a-zA-Z][a-zA-Z0-9]*$/,
                  message: t("Invalid database name"),
                },
              }}
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  error={errors.name ? true : false}
                  helperText={errors.name?.message}
                  label={t("database.name")}
                  {...field}
                />
              )}
            />
            <Controller
              name="username"
              defaultValue={generateRandom(8)}
              rules={{
                required: true,
                minLength: {
                  value: 3,
                  message: "min length is 3",
                },
              }}
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  error={errors.username ? true : false}
                  helperText={errors.username?.message}
                  autoComplete="username"
                  label={t("database.username")}
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              defaultValue={generateRandom(16)}
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  error={errors.password ? true : false}
                  helperText={errors.password?.message}
                  label={t("database.password")}
                  autoComplete="new-password"
                  {...field}
                />
              )}
            /> */}
          </DialogContent>

          <DialogActions>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => props.setOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button variant="contained" type="submit">
              {t("ok")}
            </Button>
          </DialogActions>
        </form>
      </CardDialog>
    </>
  );
}
