import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { getfetch } from "../../requests/http";
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
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    getfetch("database", {
      method: "POST",
      body: JSON.stringify(data),
    }).then(async (res) => {
      console.log(res);
      if (res.status === 201) {
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
      props.setOpen(false);
      //todo 创建数据库
    });
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
          <DialogContent className=" grid gap-2">
            <Controller
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
            />
          </DialogContent>

          <DialogActions>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => props.setOpen(false)}>
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
