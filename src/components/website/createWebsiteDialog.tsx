import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CardActions,
  CircularProgress,
  DialogActions,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from "@mui/material";

import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { getfetch } from "../../requests/http";
import { OperationResIF } from "../../requests/interface";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { generateRandom } from "../../utils";
import CardDialog from "../CardDialog";
import {
  ApplicationType,
  BaseSettingChangeData,
  CreateWebsiteStepProps,
} from "./interface";

function SelectApplication(
  props: CreateWebsiteStepProps & {
    onSelectApplication: (application: ApplicationType) => void;
  }
) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let key = (event.target as HTMLInputElement).value;
    setSelectedApplicaiton(key);
    props.onSelectApplication(application.data[key]);
  };

  const [selectedApplication, setSelectedApplicaiton] = useState("");

  const application = useQuery(["getApplication"], () =>
    getfetch("listApplication").then((res) => res.json())
  );

  if (application.isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}>
        <CircularProgress />
      </Box>
    );

  if (application.error)
    return <>"An error has occurred: " + application.error</>;

  let data: { [propName: string]: ApplicationType } = application.data;

  return (
    <>
      <DialogContent>
        <FormControl>
          <FormLabel id="application-radio-buttons-group-label">
            {t("Select Application")}
          </FormLabel>
          <RadioGroup
            row
            value={selectedApplication}
            aria-labelledby="application-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={handleChange}>
            {Object.keys(data).map((item) => {
              let name = data[item].info.name;
              return (
                <FormControlLabel
                  key={item}
                  value={item}
                  control={<Radio />}
                  label={name}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        {props.onNextStep && (
          <Button
            disabled={!selectedApplication}
            variant="contained"
            onClick={props.onNextStep}>
            {t("next")}
          </Button>
        )}
      </DialogActions>
    </>
  );
}
function BaseSetting(props: CreateWebsiteStepProps) {
  const [sslCheck, setSslCheck] = useState(false);
  const [databaseCheck, setDatabaseCheck] = useState(false);

  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const [websiteBody, setWebsiteBody] = useState({
    name: "",
    domain: "",
    ssl_enable: false,
    index_root: "",
  });
  const [databaseBody, setDatabaseBody] = useState({
    name: "",
    username: "",
    password: "",
  });

  const validateRules = useRef<{ [name: string]: boolean }>({});
  const [disable, setDisable] = useState(true);

  const handleSslChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let status = event.target.checked;
    if (status) {
      if (websiteBody.domain.length < 2) {
        enqueueSnackbar(t("website.please-input-domain"), {
          variant: "warning",
        });
        return;
      }
      setGlobalLoadingAtom(true);
      getfetch(
        "verifyDomainRecords",
        {},
        {
          searchParam: { domain: websiteBody.domain },
        }
      )
        .then(async (res) => {
          if (!res.ok) {
            enqueueSnackbar(t("network-error"), { variant: "error" });
            setSslCheck(false);
          }
          let op: OperationResIF = await res.json();
          if (op.result.result == 1) {
            setSslCheck(true);
            enqueueSnackbar("ok", { variant: "success" });
          } else if (op.result.result == 2) {
            setSslCheck(false);
            enqueueSnackbar(
              op.msg !== "None"
                ? op.msg
                : t(
                    "the-domain-name-has-not-yet-resolved-to-the-server-public-ip"
                  ),
              { variant: "error" }
            );
          }
        })
        .finally(() => {
          setGlobalLoadingAtom(false);
        });
    } else {
      setSslCheck(status);
    }
  };

  const handleDatabaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatabaseBody({
      name: "DB_" + generateRandom(6),
      username: generateRandom(8),
      password: generateRandom(32),
    });
    setDatabaseCheck(event.target.checked);
  };

  const validate = (
    id: string,
    value: string,
    reg: RegExp,
    helperText: string
  ) => {
    validateRules.current[id] = value == "" || reg.test(value);
    let props: { [name: string]: any } = { error: !validateRules.current[id] };
    if (!validateRules.current[id]) {
      props["helperText"] = helperText;
    }
    return props;
  };

  useEffect(() => {
    // if name,domain,index_root is not empty,set contion1 true
    let condition1 =
      websiteBody.name != "" &&
      websiteBody.domain != "" &&
      websiteBody.index_root != "";
    // if vaildRules all true,set condition2 true
    let condition2 = Object.values(validateRules.current).every(
      (value) => value
    );
    setDisable(!(condition1 && condition2));
  }, [websiteBody, databaseBody]);

  return (
    <>
      <DialogContent>
        <Box
          className="grid  gap-2"
          component="form"
          noValidate
          autoComplete="off">
          <div className="capitalize">
            <Divider textAlign="center">{t("basic")}</Divider>
          </div>

          <TextField
            {...validate("name", websiteBody.name, /^.{2,}$/, t("length-2"))}
            id={"website_name"}
            label="name"
            value={websiteBody.name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setWebsiteBody((state) => ({
                ...state,
                name: event.target.value,
              }));
            }}
          />
          <TextField
            {...validate(
              "domain",
              websiteBody.domain,
              // domain is valid domain name
              /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/,

              t("website.domain-format-error")
            )}
            id={"website_domain"}
            label="domain"
            value={websiteBody.domain}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setWebsiteBody((state) => ({
                ...state,
                domain: event.target.value,
                index_root: "/var/www/" + event.target.value,
              }));
            }}
          />
          <TextField
            {...validate(
              "index_root",
              websiteBody.index_root,
              /\/(?:[^/]+\/)*[^/]+/,
              t("website.index-root-format-error")
            )}
            id={"website_directory"}
            label="directory"
            value={websiteBody.index_root}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setWebsiteBody((state) => ({
                ...state,
                index_root: event.target.value,
              }));
            }}
          />

          {databaseCheck ? (
            <>
              <div className="capitalize">
                <Divider textAlign="center">{t("database")}</Divider>
              </div>
              <TextField
                id={"database_name"}
                label="name"
                value={databaseBody.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDatabaseBody((state) => ({
                    ...state,
                    name: event.target.value,
                  }));
                }}
              />
              <TextField
                id={"database_username"}
                label="username"
                value={databaseBody.username}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDatabaseBody((state) => ({
                    ...state,
                    username: event.target.value,
                  }));
                }}
              />
              <TextField
                id={"website_directory"}
                label={t("password")}
                value={databaseBody.password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDatabaseBody((state) => ({
                    ...state,
                    password: event.target.value,
                  }));
                }}
              />
            </>
          ) : (
            <></>
          )}
        </Box>
        <FormGroup row sx={{ justifyContent: "right" }}>
          <FormControlLabel
            className="capitalize"
            control={<Switch checked={sslCheck} onChange={handleSslChange} />}
            label={t("website.ssl")}
          />
          <FormControlLabel
            className="capitalize"
            control={
              <Switch checked={databaseCheck} onChange={handleDatabaseChange} />
            }
            label={t("website.database")}
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        {props.onPreviousStep && (
          <Button variant="contained" onClick={props.onPreviousStep}>
            {t("previous")}
          </Button>
        )}
        {props.onNextStep && (
          <Button
            // disabled={!canNext.current}
            disabled={disable}
            variant="contained"
            onClick={props.onNextStep}>
            {t("next")}
          </Button>
        )}
      </DialogActions>
    </>
  );
}

function ApplicationSettings(
  props: CreateWebsiteStepProps & { application?: ApplicationType }
) {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [params, setParams] = useState<Record<string, string>>({});

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

    // 遍历所有的参数，如果有必填的参数没有填写，就不允许下一步
    for (const param of props.application.attr) {
      if (param.required && !params[param.name]) {
        enqueueSnackbar(getLabel(param.label) + " " + t("is required"), {
          variant: "error",
        });
        return;
      }
    }

    console.log(params);
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
          autoComplete="off">
          {props.application &&
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

interface CreateWebsiteProps {
  open: boolean;
  onStatus: (result: "done" | "cancel") => void;
}

export default function CreateWebsiteDialog(props: CreateWebsiteProps) {
  const { open, onStatus } = { ...props };
  const [t] = useTranslation();

  const [step, setStep] = useState(1);
  const [application, setApplication] = useState<ApplicationType>();

  const canNext = useRef(false);

  const handlePreviousStep = () => {
    setStep((state) => {
      return state - 1 < 0 ? 1 : state - 1;
    });
  };

  const handleNextStep = () => {
    setStep((state) => (state + 1) % 4);
  };

  const handleSelectApplication = (data: ApplicationType) => {
    setApplication(data);
  };

  useEffect(() => {
    if (!open) {
      setStep(1);
    }
  }, [open]);

  return (
    <CardDialog
      disableEscapeKeyDown
      open={open}
      onClose={() => onStatus("cancel")}>
      <DialogTitle
        bgcolor={(theme) => theme.palette.primary.main}
        color={(theme) => theme.palette.text.disabled}>
        <div className="flex justify-between  items-center">
          <div className="capitalize">{t("website.create-new-website")}</div>
          <IconButton color="inherit" onClick={() => onStatus("cancel")}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      {open && (
        <div className={step === 1 ? "" : "hidden"}>
          <SelectApplication
            onNextStep={handleNextStep}
            onSelectApplication={handleSelectApplication}></SelectApplication>
        </div>
      )}

      {open && (
        <div className={step === 2 ? "" : "hidden"}>
          <BaseSetting
            onPreviousStep={handlePreviousStep}
            onNextStep={handleNextStep}></BaseSetting>
        </div>
      )}

      {open && step === 3 && (
        <ApplicationSettings
          onPreviousStep={handlePreviousStep}
          application={application}></ApplicationSettings>
      )}
    </CardDialog>
  );
}
