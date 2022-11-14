import { useEffect, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";

import {
  Alert,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  FormControlLabel,
  InputAdornment,
  ScopedCssBaseline,
  Stack,
  TextField,
} from "@mui/material";

import {
  Password,
  SecurityOutlined,
  SupervisorAccountOutlined,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { SetterOrUpdater } from "recoil";
import { ACCESS_TOKEN, USER_INFO } from "../constant";
import { NetErrorValue, useNetError } from "../requests/hook";
import { getfetch } from "../requests/http";
import { getApiGateway, setApiGateway } from "../requests/utils";
import { getUserInfo } from "../store";
import { LocalStorageJson } from "../utils";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

interface FormTextProps {
  label: string;
  value: any;
  setStatus: SetterOrUpdater<any>;
  netError: NetErrorValue & { getItem: Function };
  type: React.InputHTMLAttributes<unknown>["type"];
  InputProps?: any;
}

function FormTextField(props: FormTextProps) {
  return (
    <TextField
      label={props.label}
      required
      error={props.netError.item.hasOwnProperty(props.label)}
      helperText={props.netError.getItem(props.label)}
      onChange={props.setStatus}
      value={props.value}
      type={props.type}
      InputProps={props.InputProps}
    ></TextField>
  );
}

function Login() {
  const { t, i18n } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [netError, setNetError] = useNetError(null);
  const [url, setUrl] = useState(() => getApiGateway());
  const [userInfo, setUserInfo] = useState(() => getUserInfo());

  const navigate = useNavigate();
  const setUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((state) => ({ ...state, username: event.target.value }));
  };

  const setPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((state) => ({ ...state, password: event.target.value }));
  };

  const setRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((state) => ({ ...state, remember_me: event.target.checked }));
  };
  const updateUrl = (val: any) => {
    setUrl(val.target.value);
    setApiGateway(val.target.value);
  };

  const onLogin = () => {
    setLoading(true);
    getfetch("accountLogin", {
      method: "POST",
      body: JSON.stringify({
        username: userInfo.username,
        password: userInfo.password,
      }),
    })
      .then(async (data) => {
        let res = await data.json();
        if (data.ok) {
          LocalStorageJson.setItem(USER_INFO, userInfo);
          Cookies.set(ACCESS_TOKEN, res.token);
          window.sessionStorage.setItem(
            USER_INFO,
            JSON.stringify(res, null, 2)
          );
          setNetError(null);
          navigate("/dash");
        } else {
          setNetError({ item: res, msg: "" });
        }
      })
      .catch((err) => {
        setNetError({ item: {}, msg: t("network-error") });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const keyDownHandler = (event: {
      key: string;
      preventDefault: () => void;
    }) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onLogin();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <ScopedCssBaseline enableColorScheme>
      <Container className="container px-0 w-screen  h-screen bg-cover bg-center bg-[url('/assets/background.jpg')]">
        <div
          className={
            "h-full flex items-center justify-center backdrop-blur-xl "
          }
        >
          <Card className="rounded-2xl  text-center w-96  shadow-2xl">
            <CardHeader
              title="Login Server"
              className="text-center  "
            ></CardHeader>
            {netError.msg ? <Alert severity="error">{netError.msg}</Alert> : ""}

            <CardContent className="flex flex-col">
              <input autoComplete="new-password" hidden type="password" />
              <Stack spacing={2} direction="column">
                <TextField
                  required
                  value={url}
                  onChange={updateUrl}
                  helperText="'https://domain.com' or '/'"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityOutlined
                          color={
                            url.includes("https://") ? "success" : "inherit"
                          }
                        />
                      </InputAdornment>
                    ),
                  }}
                  label="api"
                ></TextField>

                <FormTextField
                  label={t("login.username")}
                  value={userInfo.username}
                  type={"text"}
                  netError={netError}
                  setStatus={setUsername}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SupervisorAccountOutlined />
                      </InputAdornment>
                    ),
                  }}
                ></FormTextField>

                <FormTextField
                  label={t("login.password")}
                  value={userInfo.password}
                  type={"password"}
                  netError={netError}
                  setStatus={setPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Password />
                      </InputAdornment>
                    ),
                  }}
                ></FormTextField>
              </Stack>
            </CardContent>
            <CardActions color={""} className={"flex justify-end px-4"}>
              <FormControlLabel
                label={t("login.remember-me")}
                control={
                  <Checkbox
                    checked={userInfo.remember_me}
                    onChange={setRememberMe}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />

              <LoadingButton
                loading={loading}
                variant={"contained"}
                onClick={onLogin}
              >
                {t("login.login")}
              </LoadingButton>
            </CardActions>
          </Card>
        </div>
      </Container>
    </ScopedCssBaseline>
  );
}

export default Login;
