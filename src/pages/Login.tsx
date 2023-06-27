import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import packageJson from "../../package.json";
import backgroundJPG from "../assets/background.jpg";

import {
  Alert,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
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

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SetterOrUpdater } from "recoil";
import { ACCESS_TOKEN, LOGIN_INFO, USER_INFO } from "../constant";

import { requestData } from "../requests/http";
import { getApiGateway, setApiGateway } from "../requests/utils";

interface FormTextProps {
  label: string;
  value: any;
  setStatus: SetterOrUpdater<any>;
  netError: string[] | string | undefined;
  type: React.InputHTMLAttributes<unknown>["type"];
  InputProps?: any;
}

function FormTextField(props: FormTextProps) {
  return (
    <TextField
      label={props.label}
      required
      error={Boolean(props.netError)}
      helperText={props.netError}
      onChange={props.setStatus}
      value={props.value}
      type={props.type}
      InputProps={props.InputProps}
    ></TextField>
  );
}

export interface NetErrorValue {
  item: { [name: string]: string[] | string };
  msg: string;
}

function getLoginInfo() {
  let loginInfo = window.localStorage.getItem(LOGIN_INFO);
  if (loginInfo) {
    return JSON.parse(loginInfo);
  }

  loginInfo = window.sessionStorage.getItem(LOGIN_INFO);
  if (loginInfo) {
    return JSON.parse(loginInfo);
  }

  return {
    username: "",
    password: "",
    remember_me: false,
  };
}

function Login() {
  const [t] = useTranslation();

  const [loading, setLoading] = useState(false);
  const [netError, setNetError] = useState<NetErrorValue>({
    item: {},
    msg: "",
  });
  const [url, setUrl] = useState(() => getApiGateway());

  const [username, setUsername] = useState(() => getLoginInfo().username);
  const [password, setPassword] = useState(() => getLoginInfo().password);
  const [rememberMe, setRememberMe] = useState(
    () => getLoginInfo().remember_me
  );

  const navigate = useNavigate();
  const handleUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  const updateUrl = (val: any) => {
    setUrl(val.target.value);
    setApiGateway(val.target.value);
  };

  async function onLogin() {
    setLoading(true);
    let loginInfo = {
      username: username,
      password: password,
      remember_me: rememberMe,
    };

    try {
      let res = await requestData({
        url: "auth",
        method: "POST",
        data: loginInfo,
      });
      let data = await res.json();
      if (res.ok) {
        if (rememberMe) {
          window.localStorage.setItem(LOGIN_INFO, JSON.stringify(loginInfo));
        } else {
          window.sessionStorage.setItem(LOGIN_INFO, JSON.stringify(loginInfo));
        }
        window.sessionStorage.setItem(ACCESS_TOKEN, data.token);
        window.sessionStorage.setItem(USER_INFO, JSON.stringify(data, null, 2));
        setNetError({ item: {}, msg: "" });
        navigate("/dash");
      } else {
        setNetError({ item: data, msg: "" });
      }
    } catch (err) {
      setNetError({ item: {}, msg: t("server-502-bad-gateway") });
    } finally {
      setLoading(false);
    }
  }

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
  }, [username, password, rememberMe]);

  return (
    <ScopedCssBaseline enableColorScheme>
      <div
        style={{ backgroundImage: `url(${backgroundJPG})` }}
        className="p-0  m-0 w-screen  h-screen bg-cover bg-center"
      >
        <div className="h-full flex items-center justify-center backdrop-blur-xl">
          <div>
            <Card className="rounded-2xl  text-center w-96  shadow-2xl">
              <CardHeader
                title={t("login-server")}
                className="text-center"
              ></CardHeader>
              {netError.msg ? (
                <Alert severity="error">{netError.msg}</Alert>
              ) : (
                ""
              )}

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
                    value={username}
                    type={"text"}
                    netError={netError.item?.username}
                    setStatus={handleUsername}
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
                    value={password}
                    type={"password"}
                    netError={netError.item?.password}
                    setStatus={handlePassword}
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
              <CardActions className={"flex justify-end px-4"}>
                <FormControlLabel
                  label={t("login.remember-me")}
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={handleRememberMe}
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
            <div className="text-center mt-1 opacity-30 text-sm">
              version: {packageJson.version}
            </div>
          </div>
        </div>
      </div>
    </ScopedCssBaseline>
  );
}

export default Login;
