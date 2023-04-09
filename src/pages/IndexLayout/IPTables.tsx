import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

import FormGroup from "@mui/material/FormGroup";

import {
  alpha,
  Button,
  ButtonGroup,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import useSWR from "swr";
import { requestData } from "../../requests/http";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import {
  EnhancedTableToolbarProps,
  TableDjango,
} from "../../components/DjangoTable";
import { GlobalProgressAtom } from "../../store/recoilStore";

export interface ResponseIF {
  pagination: PaginationIF;
  results: ResultIF[];
}

interface ResultIF {
  id: number;
  To: string;
  Action: string;
  From: string;
}

interface PaginationIF {
  total_pages: number;
  total: number;
  page: number;
  per_page: number;
}

const API_URL = "/api/IPTables/get_rules/";

const LABEL = "layout.iptables";

interface RowIF {
  id: number;
  to: string;
  action: string;
  from: string;
  operation?: JSX.Element;
}
export interface IPTablesIndexProps {}

interface RequestDataProps {
  url: string;

  params: {
    page: string;
    ordering: string;
    page_size: string;
  };
}

function AddIPTablesRule(props: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    <>
      <FormGroup row className=" gap-2  ">
        <FormControl>
          <InputLabel id="application-simple-select-label">
            application
          </InputLabel>
          <Select
            size="small"
            labelId="application-simple-select-label"
            id="application-select"
            value={age}
            sx={{
              minWidth: 120,
            }}
            label="application"
            onChange={handleChange}>
            <MenuItem value={10}>Custom</MenuItem>
            <MenuItem value={20}>ALL TCP</MenuItem>
            <MenuItem value={30}>ALL UDP</MenuItem>
            <MenuItem value={30}>ALL protocols</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="protocol-simple-select-label">Protocol</InputLabel>
          <Select
            size="small"
            labelId="protocol-simple-select-label"
            id="protocol-select"
            value={age}
            sx={{
              minWidth: 120,
            }}
            label="protocol"
            onChange={handleChange}>
            <MenuItem value={10}>ALL</MenuItem>
            <MenuItem value={20}>TCP</MenuItem>
            <MenuItem value={30}>UDP</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <TextField
            size="small"
            id="port-or-range"
            label="Port or range            "
            variant="outlined"
            type="number"
          />
        </FormControl>

        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Restrict to IP address"
        />
      </FormGroup>
      <div className="flex gap-2 justify-end mr-2">
        <Button size="small" variant="contained" color="primary">
          ok
        </Button>
        <Button size="small" variant="contained" color="secondary">
          cancel
        </Button>
      </div>
    </>
  );
}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  const [t] = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const handleDelete = () => {
    if (props.onAction) {
      props.onAction("delete");
    }
  };

  const handleReloadParent = () => {
    if (props.onAction) {
      props.onAction("reload");
    }
  };

  return (
    <>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div">
            {numSelected} {t(LABEL)}
          </Typography>
        ) : (
          <Typography
            className="capitalize"
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div">
            {t(LABEL)}
          </Typography>
        )}
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group">
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenDialog(true);
            }}>
            {t("add")}
          </Button>

          {numSelected > 0 ? (
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}>
              <div className="whitespace-nowrap">{t("common.delete")}</div>
            </Button>
          ) : (
            <div></div>
          )}
          <IconButton
            className={globalProgress ? "animate-spin" : ""}
            color="primary"
            onClick={handleReloadParent}>
            <RefreshIcon />
          </IconButton>
        </ButtonGroup>
      </Toolbar>
      <div>
        <AddIPTablesRule></AddIPTablesRule>
      </div>
    </>
  );
}
export default function IPTablesIndex(props: IPTablesIndexProps) {
  const [t] = useTranslation();

  const headCells = [
    {
      key: "id",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      key: "to",
      numeric: true,
      disablePadding: false,
      label: "To",
    },
    {
      key: "action",
      numeric: true,
      disablePadding: false,
      label: "Action",
    },
    {
      key: "from_src",
      numeric: true,
      disablePadding: false,
      label: "From",
    },
    {
      key: "operation",
      numeric: true,
      disablePadding: false,
      label: "Operation",
    },
  ];
  const [globalProgress, setGlobalProgress] =
    useRecoilState(GlobalProgressAtom);
  const [updateState, setUpdateState] = useState(1);
  const [rowsState, setRowsState] = useState<RowIF[]>([]);
  const [paginationState, setPaginationState] = useState();
  const [pageState, setPageState] = useState(1);
  const [orederState, setOrederState] = useState("-id");
  const [pageSizeState, setPageSizeState] = useState(5);
  const [selected, setSelected] = useState<readonly string[]>([]);

  const handleAction = (action: string) => {
    if (action === "reload") {
      setUpdateState(updateState + 1);
    }

    if (action === "delete") {
      console.log(selected);
    }
  };
  const handleSetpageSize = (size: number) => {
    setPageSizeState(size);
    setUpdateState(updateState + 1);
  };

  const handleRequestSort = (order: string, property: any) => {
    setOrederState(order + property);
    setUpdateState(updateState + 1);
  };
  let requestDataProps: RequestDataProps = {
    url: API_URL,
    params: {
      page: String(pageState),
      ordering: orederState,
      page_size: String(pageSizeState),
    },
  };

  const deleteRule = async (id: number) => {
    let data = await requestData({
      url: "/api/Operating/excute_command_sync/",
      method: "POST",
      data: {
        cwd: "/tmp",
        command: "echo 'y' | ufw delete " + id,
      },
    });
    if (data.ok) {
      setUpdateState(updateState + 1);
    }
  };

  const transformRowData = (data: RowIF[]) => {
    return data.map((row) => {
      row.operation = (
        <div>
          <Button
            variant="contained"
            size="small"
            className={"invisible group-hover:visible"}
            color="warning"
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
              e.stopPropagation();
              deleteRule(row.id);
            }}>
            {t("common.delete")}
          </Button>
        </div>
      );
      return row;
    });
  };

  const { mutate, data } = useSWR<ResponseIF>(
    requestDataProps,
    async (props) => {
      setGlobalProgress(true);
      let data = await requestData(props);
      if (data.ok) {
        let res = await data.json();
        res = res as ResponseIF;
        setRowsState(transformRowData(res.results));
        setPaginationState(res.pagination);
        setGlobalProgress(false);
        return res;
      } else {
        setGlobalProgress(false);
      }
    }
  );

  const handleSetTargetPage = (targetPage: number) => {
    setPageState(targetPage);
    setUpdateState(updateState + 1);
  };

  useEffect(() => {
    setSelected([]);
    mutate();
  }, [updateState]);

  return (
    <>
      <TableDjango
        dense
        onAction={handleAction}
        enhancedTableToolbar={EnhancedTableToolbar}
        selectedState={[selected, setSelected]}
        onSetPageSize={handleSetpageSize}
        onRequestSort={handleRequestSort}
        onSetPage={handleSetTargetPage}
        rows={rowsState}
        headCells={headCells}
        title={LABEL}></TableDjango>
    </>
  );
}
