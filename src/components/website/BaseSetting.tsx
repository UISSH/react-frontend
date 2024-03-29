import {
  Box,
  Button,
  DialogActions,
  Divider,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";

import DialogContent from "@mui/material/DialogContent";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { requestData } from "../../requests/http";
import { OperationResIF } from "../../requests/interface";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { CreateWebsiteStepProps } from "./interface";

export default function BaseSetting(props: CreateWebsiteStepProps) {
  const [sslCheck, setSslCheck] = useState(false);

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

      requestData({
        url: "verifyDomainRecords",
        params: {
          domain: websiteBody.domain,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            enqueueSnackbar(t("network-error"), { variant: "error" });
            setSslCheck(false);
            setWebsiteBody({ ...websiteBody, ssl_enable: false });
          }
          let op: OperationResIF = await res.json();
          if (op.result.result == 1) {
            setSslCheck(true);
            setWebsiteBody({ ...websiteBody, ssl_enable: true });
            enqueueSnackbar("ok", { variant: "success" });
          } else if (op.result.result == 2) {
            setSslCheck(false);
            enqueueSnackbar(
              op.msg !== "None"
                ? op.msg
                : t(
                    "website.the-domain-name-has-not-yet-resolved-to-the-server-public-ip"
                  ),
              { variant: "error" }
            );

            setWebsiteBody({ ...websiteBody, ssl_enable: false });
          }
        })
        .finally(() => {
          setGlobalLoadingAtom(false);
        });
    } else {
      setSslCheck(status);
    }
  };

  const handleNextStep = () => {
    if (!props.requestBody.current) {
      return;
    }

    props.requestBody.current.website = {
      ...props.requestBody.current.website,
      ...websiteBody,
    };

    props.onNextStep ? props.onNextStep() : null;
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
          autoComplete="off"
        >
          <div className="capitalize">
            <Divider textAlign="center">{t("basic")}</Divider>
          </div>

          <TextField
            {...validate("name", websiteBody.name, /^.{2,}$/, t("length-2"))}
            id={"website_name"}
            label="name"
            size="small"
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
            size="small"
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
            size="small"
            value={websiteBody.index_root}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setWebsiteBody((state) => ({
                ...state,
                index_root: event.target.value,
              }));
            }}
          />
        </Box>
        <FormGroup row sx={{ justifyContent: "right" }}>
          <FormControlLabel
            className="capitalize"
            control={<Switch checked={sslCheck} onChange={handleSslChange} />}
            label={t("website.ssl")}
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
            onClick={handleNextStep}
          >
            {t("next")}
          </Button>
        )}
      </DialogActions>
    </>
  );
}
