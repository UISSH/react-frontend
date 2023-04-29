import { useEffect, useState } from "react";
import packageJson from "../../package.json";
import LoadingButton from "@mui/lab/LoadingButton";
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

import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { SetterOrUpdater } from "recoil";
import { ACCESS_TOKEN, USER_INFO } from "../constant";

import { fetchData, requestData } from "../requests/http";
import { getApiGateway, setApiGateway } from "../requests/utils";
import { getUserInfo } from "../store";
import { LocalStorageJson } from "../utils";

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
      InputProps={props.InputProps}></TextField>
  );
}

export interface NetErrorValue {
  item: { [name: string]: string[] | string };
  msg: string;
}
function Login() {
  const [t] = useTranslation();

  const [loading, setLoading] = useState(false);
  const [netError, setNetError] = useState<NetErrorValue>({
    item: {},
    msg: "",
  });
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

  const onLogin = async () => {
    setLoading(true);

    try {
      let res = await requestData({
        url: "auth",
        method: "POST",
        data: userInfo,
      });
      let data = await res.json();
      if (res.ok) {
        LocalStorageJson.setItem(USER_INFO, userInfo);
        Cookies.set(ACCESS_TOKEN, data.token);
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
      <div
        style={{ backgroundImage: `url(${backgroundJPG})` }}
        className="p-0  m-0 w-screen  h-screen bg-cover bg-center">
        <div className="h-full flex items-center justify-center backdrop-blur-xl">
          <div>
            <Card className="rounded-2xl  text-center w-96  shadow-2xl">
              <CardHeader
                title={t("login-server")}
                className="text-center"></CardHeader>
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
                    label="api"></TextField>

                  <FormTextField
                    label={t("login.username")}
                    value={userInfo.username}
                    type={"text"}
                    netError={netError.item?.username}
                    setStatus={setUsername}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SupervisorAccountOutlined />
                        </InputAdornment>
                      ),
                    }}></FormTextField>

                  <FormTextField
                    label={t("login.password")}
                    value={userInfo.password}
                    type={"password"}
                    netError={netError.item?.password}
                    setStatus={setPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Password />
                        </InputAdornment>
                      ),
                    }}></FormTextField>
                </Stack>
              </CardContent>
              <CardActions className={"flex justify-end px-4"}>
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
                  onClick={onLogin}>
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
