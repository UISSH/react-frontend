import { TabContext, TabList, TabPanel } from "@mui/lab";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { JSONTree } from "react-json-tree";

import { Tab, TextField, Typography } from "@mui/material";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { getWSGateway } from "../requests/utils";
import OsqueryResult from "./overview/interfaces";
export default function LabTabs() {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  let params = useParams();
  let location = useLocation();
  const [_searchParams] = useSearchParams();
  const [searchParams, setSearchParams] = useState<any>({});

  const [locationState, setLocationState] = useState(location.state || {});
  const [osquery, setOsquery] = useState<{
    query: string;
    result: OsqueryResult;
  }>({
    query: "select * from processes;",
    result: {
      doc: "",
      action: "",
      sql: "",
      message: {
        out: [],
        err: "",
      },
      code: 0,
    },
  });

  useEffect(() => {
    let data: any = {};
    for (let k of _searchParams.keys()) {
      data[k] = _searchParams.get(k);
    }
    setSearchParams(data);
  }, [_searchParams]);

  return (
    <Box sx={{ width: "95vw", typography: "body2", minHeight: "95vh" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            textColor="secondary"
            indicatorColor="secondary"
            onChange={handleChange}
            aria-label="params tabs"
          >
            <Tab sx={{ textTransform: "none" }} label="useParams" value="1" />
            <Tab
              sx={{ textTransform: "none" }}
              label="searchParams"
              value="2"
            />
            <Tab
              sx={{ textTransform: "none" }}
              label="locationState"
              value="3"
            />
            <Tab sx={{ textTransform: "none" }} label="osquery" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">{JSON.stringify(params)}</TabPanel>
        <TabPanel value="2">
          <Typography variant="subtitle2" className="text-gray-500">
            [searchParams] = useSearchParams()
          </Typography>
          <Typography variant="subtitle2" className="text-gray-500">
            searchParams.get(key)
          </Typography>
          <div className="pt-2">{JSON.stringify(searchParams, null, 2)}</div>
        </TabPanel>
        <TabPanel value="3">{JSON.stringify(locationState)}</TabPanel>
        <TabPanel value="4" sx={{ height: "calc(95vh - 50px)", padding: 0 }}>
          <div className="h-full flex flex-col justify-around p-2 gap-2">
            <div className="overflow-auto h-full">
              <JSONTree data={osquery.result.message.out} theme="tomorrow" />
            </div>

            <TextField
              className="w-full"
              id="outlined-multiline-static"
              label="osquery"
              multiline
              rows={2}
              value={osquery.query}
              onChange={(e) => {
                setOsquery({ ...osquery, query: e.target.value });
              }}
              variant="outlined"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  e.stopPropagation();
                  let ws = new WebSocket(getWSGateway("server_status"));
                  ws.onmessage = (e) => {
                    const data = JSON.parse(e.data) as OsqueryResult;
                    if (data.code === 201) {
                      ws.send(
                        JSON.stringify({
                          query_sql: osquery.query,
                          interval: 1,
                        })
                      );
                    } else {
                      setOsquery({
                        ...osquery,
                        result: data,
                      });
                      ws.close();
                    }
                  };
                }
              }}
            />
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
