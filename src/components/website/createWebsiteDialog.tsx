import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
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
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { getfetch } from "../../requests/http";
import { OperationResIF } from "../../requests/interface";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { generateRandom } from "../../utils";
import CardDialog from "../cardDialog";
import {
  ApplicationType,
  BaseSettingChangeData,
  BaseSettingProps,
} from "./interface";

function BaseSetting(props: BaseSettingProps) {
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

  const handleSslChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let status = event.target.checked;
    if (status) {
      if (websiteBody.domain.length < 2) {
        enqueueSnackbar(t("website.please-input-domain"), { variant: "warning" });
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

  const handleValidation = (data: string, reg: RegExp) => {
    let ok = data != "" && !Boolean(reg.exec(data));
    return { error: ok };
  };
  useEffect(() => {
    if (props.onChange) {
      let data: BaseSettingChangeData = {
        ...websiteBody,
      };

      if (databaseCheck) {
        data["database"] = databaseBody;
      }

      props.onChange(data);
    }
  }, [websiteBody, databaseBody]);

  return (
    <>
      <Box
        className="grid py-4 gap-2"
        component="form"
        noValidate
        autoComplete="off">
        <div className="capitalize">
          <Divider textAlign="center">{t("basic")}</Divider>
        </div>

        <TextField
          error={websiteBody.name != "" && websiteBody.name.length < 2}
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
          {...handleValidation(
            websiteBody.domain,
            /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/
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
          {...handleValidation(websiteBody.index_root, /^\/|(\/[\w-]+)+$/)}
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
  const [application, setApplication] = useState<{
    [propName: string]: ApplicationType;
  }>({});
  const [selectedApplication, setSelectedApplicaiton] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedApplicaiton((event.target as HTMLInputElement).value);
  };

  const [canNext, setCanNext] = useState(false);
  const SelectApplication = () => {
    useEffect(() => {
      setCanNext(Boolean(selectedApplication));
    });

    return (
      <FormControl>
        <FormLabel className="pt-2" id="demo-radio-buttons-group-label">
          {" "}
          Select Application
        </FormLabel>
        <RadioGroup
          row
          value={selectedApplication}
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          onChange={handleChange}>
          {Object.keys(application).map((item) => {
            console.log(application[item]);
            let name = application[item].info.name;
            return (
              <FormControlLabel value={item} control={<Radio />} label={name} />
            );
          })}
        </RadioGroup>
      </FormControl>
    );
  };

  const handlePrevious = () => {
    setStep((state) => {
      return state - 1 < 1 ? 1 : state - 1;
    });
  };

  const handleNext = () => {
    setCanNext(false);
    setStep((state) => (state + 1) % 3);
  };

  const StepDialogContent = () => {
    if (step == 1) {
      return (
        <>
          <DialogContent>
            <SelectApplication></SelectApplication>
          </DialogContent>
        </>
      );
    } else if (step == 2) {
      return (
        <>
          <DialogContent>
            <BaseSetting></BaseSetting>
          </DialogContent>
        </>
      );
    } else {
      return <></>;
    }
  };

  // 第一次挂载请求数据
  useEffect(() => {
    open
      ? getfetch("listApplication")
          .then((res) => res.json())
          .then((res) => {
            setApplication(res);
            setStep(1);
          })
      : "";
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

      <StepDialogContent />

      <DialogActions>
        {step > 1 && (
          <Button variant="contained" onClick={handlePrevious}>
            {t("previous")}
          </Button>
        )}
        <Button disabled={!canNext} variant="contained" onClick={handleNext}>
          {t("next")}
        </Button>
      </DialogActions>
    </CardDialog>
  );
}
