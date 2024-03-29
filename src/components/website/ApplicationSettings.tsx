import { Box, Button, DialogActions, TextField } from "@mui/material";

import DialogContent from "@mui/material/DialogContent";
import { useSnackbar } from "notistack";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApplicationType, CreateWebsiteStepProps } from "./interface";

type ApplicationParams = Record<string, string>;

export default function ApplicationSettings(
  props: CreateWebsiteStepProps & {
    onDone: () => void;
    application?: ApplicationType;
  }
) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [params, setParams] = useState<ApplicationParams>({});

  const getLabel = (data: { [name: string]: string }) => {
    return data["default"];
  };

  const getDescription = (data: { [name: string]: string }) => {
    return data["default"];
  };

  const handleDone = () => {
    if (!props.application) {
      return;
    }

    for (const param of props.application.attr) {
      if (param.required && !params[param.name]) {
        enqueueSnackbar(getLabel(param.label) + " " + t("is required"), {
          variant: "error",
        });
        return;
      }
    }

    props.requestBody.current.website = {
      ...props.requestBody.current.website,
      application_config: params,
    };
    props.onDone();
  };
  useLayoutEffect(() => {
    if (props.application) {
      let params: Record<string, string> = {};
      props.application.attr.forEach((attr) => {
        if (attr.value) {
          params[attr.name] = attr.value;
        } else {
          params[attr.name] = "";
        }
      });
      setParams(params);
    }
  }, []);

  return (
    <>
      <DialogContent>
        <Box
          className="grid  gap-2"
          component="form"
          noValidate
          autoComplete="off"
        >
          {props.application &&
            params &&
            props.application.attr.map((item) => {
              return (
                <TextField
                  error={item.required && !params[item.name]}
                  key={item.name}
                  required={item.required}
                  label={getLabel(item.label)}
                  value={params[item.name]}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setParams((state) => ({
                      ...state,
                      [item.name]: event.target.value,
                    }));
                  }}
                  helperText={getDescription(item.description)}
                />
              );
            })}
        </Box>
      </DialogContent>
      <DialogActions>
        {props.onPreviousStep && (
          <Button variant="contained" onClick={props.onPreviousStep}>
            {t("previous")}
          </Button>
        )}
        <Button variant="contained" onClick={handleDone}>
          {t("ok")}
        </Button>
      </DialogActions>
    </>
  );
}
