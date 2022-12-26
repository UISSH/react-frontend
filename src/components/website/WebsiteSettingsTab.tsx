import { OpenInBrowser } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import { Divider, IconButton, InputAdornment, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import * as React from "react";
import useSWR from "swr";
import { requestData } from "../../requests/http";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { useNavigate } from "react-router-dom";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface WebsiteObject {
  id: number;
  ssl_config: Sslconfig;
  database_id?: any;
  database_name?: any;
  web_server_type_text: string;
  status_text: string;
  create_at: string;
  update_at: string;
  name: string;
  domain: string;
  extra_domain?: any;
  ssl_enable: boolean;
  index_root: string;
  status: number;
  status_info: string;
  web_server_type: number;
  application: string;
  application_config: Applicationconfig;
  valid_web_server_config: string;
  user: number;
}

interface Applicationconfig {
  name: string;
  text: string;
  email?: any;
}

interface Sslconfig {
  certbot: Certbot;
  path: Path;
  method: string;
}

interface Path {
  certificate: string;
  key: string;
}

interface Certbot {
  email: string;
  provider: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface WebsiteSSLObject {
  issued_common_name: string;
  issuer_common_name: string;
  issuer_country_name: string;
  issuer_organization_name: string;
  subject_alt_name: string;
  not_before: string;
  not_after: string;
  signature_algorithm: string;
  serial_number_hex: string;
}
function WebsiteSSLSettings(props: { id: string }) {
  const { data } = useSWR<WebsiteSSLObject>(
    `/api/Website/${props.id}/get_ssl_info/`,
    async (url) => {
      const res = await requestData({
        url: url,
      });
      return await res.json();
    }
  );
  return (
    <>
      {data && (
        <div className=" grid gap-4 ">
          <TextField
            value={data.issued_common_name}
            fullWidth
            size="small"
            label="issued_common_name"></TextField>
          <div className="flex gap-2">
            <TextField
              value={data.issuer_common_name}
              fullWidth
              size="small"
              label="issuer_common_name"></TextField>
            <TextField
              value={data.issuer_country_name}
              fullWidth
              size="small"
              label="issuer_country_name"></TextField>
            <TextField
              value={data.issuer_organization_name}
              fullWidth
              size="small"
              label="issuer_organization_name"></TextField>
          </div>

          <TextField
            value={data.subject_alt_name}
            fullWidth
            size="small"
            label="subject_alt_name"></TextField>
          <div className="flex gap-2">
            <TextField
              value={data.not_before}
              fullWidth
              size="small"
              label="not_before"></TextField>
            <TextField
              value={data.not_after}
              fullWidth
              size="small"
              label="not_after"></TextField>
          </div>
          <TextField
            value={data.signature_algorithm}
            fullWidth
            size="small"
            label="signature_algorithm"></TextField>
          <TextField
            value={data.serial_number_hex}
            fullWidth
            size="small"
            label="serial_number_hex"></TextField>
        </div>
      )}
    </>
  );
}

function WebsiteBasicSettings(props: { id: string }) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const navigate = useNavigate();
  const [domain, setDomain] = React.useState<string>("");

  const [extraDomain, setExtraDomain] = React.useState<string>("");
  const { data, mutate, error } = useSWR<WebsiteObject>(
    `/api/Website/${props.id}/`,
    async (url) => {
      const res = await requestData({
        url: url,
      });
      let resJson = await res.json();
      setDomain(resJson.domain);
      setExtraDomain(resJson.extra_domain);
      return resJson;
    }
  );

  const updateDomain = () => {
    setGlobalLoadingAtom(true);
    requestData({
      url: `/api/Website/${props.id}/update_domain/`,
      method: "POST",
      data: {
        domain: domain,
        extra_domain: extraDomain,
      },
    }).then((res) => {
      if (res.ok) {
        enqueueSnackbar(t("success"), {
          variant: "success",
        });
        mutate();
      } else {
        enqueueSnackbar(t("error"), {
          variant: "error",
        });
      }
      setGlobalLoadingAtom(false);
    });
  };
  return (
    <>
      {data && (
        <div className=" grid gap-4 ">
          <TextField
            value={data.name}
            fullWidth
            size="small"
            InputProps={{
              readOnly: true,
            }}
            label="name"></TextField>
          <TextField
            value={data.web_server_type_text}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            size="small"
            label="web server"></TextField>
          <div className="text-right">
            <Divider className="pb-2"> domain settings </Divider>

            <div className="grid gap-4">
              <TextField
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                fullWidth
                size="small"
                label="domain"></TextField>

              <TextField
                multiline
                helperText="separate by line"
                value={extraDomain}
                onChange={(e) => setExtraDomain(e.target.value)}
                fullWidth
                size="small"
                label="extra domain"></TextField>
            </div>
            <IconButton color="secondary" onClick={updateDomain}>
              <SaveIcon></SaveIcon>
            </IconButton>
          </div>

          <div>
            <Divider className="pb-2"> index root </Divider>

            <TextField
              value={data.index_root}
              fullWidth
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        navigate(
                          `/dash/explorer/?directory=${data.index_root}`
                        );
                      }}>
                      <OpenInNewIcon></OpenInNewIcon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
              label="path"></TextField>
          </div>
        </div>
      )}
    </>
  );
}

export default function BasicTabs(props: { id: string }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example">
          <Tab label="Basic" {...a11yProps(0)} />
          <Tab label="Config" {...a11yProps(1)} />
          <Tab label="SSL" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <WebsiteBasicSettings id={props.id}></WebsiteBasicSettings>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        <WebsiteSSLSettings id={props.id}></WebsiteSSLSettings>
      </TabPanel>
    </Box>
  );
}
