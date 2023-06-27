import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  alpha,
  Button,
  ButtonGroup,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import useSWR from "swr";

import { useSnackbar } from "notistack";
import { PureFunctionContext } from "../../Context";
import { requestData } from "../../requests/http";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
import LinearBuffer from "../LinearBuffer";
const API_URL = "database";

const LABEL = "layout.database";

interface RowIF {
  id: number;
}
export interface DemoTableProps {}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const onReloadTableData = useContext(PureFunctionContext);

  const { numSelected } = props;
  const [t] = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = () => {
    if (props.onAction) {
      props.onAction("delete");
    }
  };

  const handleReloadParent = () => {
    onReloadTableData && onReloadTableData();
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
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 50%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} {t(LABEL)}
          </Typography>
        ) : (
          <Typography
            className="capitalize"
            sx={{ flex: "1 1 50%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {t(LABEL)}
          </Typography>
        )}
        <ButtonGroup
          className="flex-nowarp"
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            {t("common.add")}
          </Button>

          {numSelected > 0 ? (
            <Button
              color="error"
              className="flex flex-nowrap"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              <div className="whitespace-nowrap">{t("common.delete")}</div>
            </Button>
          ) : (
            <div></div>
          )}
          <div className="px-2 gap-1 flex">
            <IconButton color="primary" onClick={handleReloadParent}>
              <RefreshIcon />
            </IconButton>
          </div>
        </ButtonGroup>
      </Toolbar>
    </>
  );
}
export default function DemoTable(props: DemoTableProps) {
  const [t] = useTranslation();
  const headCells = [
    {
      key: "id",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const [paginationState, setPaginationState] = useState();
  const [pageState, setPageState] = useState(1);
  const [orederState, setOrederState] = useState("-id");
  const [pageSizeState, setPageSizeState] = useState(5);
  const [selected, setSelected] = useState<readonly string[]>([]);

  const handleAction = (action: string) => {
    if (action === "reload") {
      mutate();
    }
  };
  const handleSetpageSize = (size: number) => {
    setPageSizeState(size);
    mutate();
  };

  const handleRequestSort = (order: string, property: any) => {
    setOrederState(order + property);
    mutate();
  };

  const transformRowData = (data: RowIF[]) => {
    return data.map((row) => {
      /* custom row field */
      /* row.password = (
              <PasswordField
                password={row.password}
                readOnly={true}></PasswordField>
            ); */
      /* custom row field */
      return row;
    });
  };

  const { mutate, data, isLoading } = useSWR<any>(
    {
      url: API_URL,
      params: {
        page: String(pageState),
        ordering: orederState,
        page_size: String(pageSizeState),
      },
    },
    async (props) => {
      setSelected([]);
      let data = await requestData(props);
      if (data.ok) {
        let res = await data.json();
        res = res as any;
        setPaginationState(res.pagination);
        return transformRowData(res.results);
      } else {
        enqueueSnackbar(t("common.error"), {
          variant: "error",
        });
        return [];
      }
    }
  );

  const handleSetTargetPage = (targetPage: number) => {
    setPageState(targetPage);
    mutate();
  };

  if (isLoading || !data) {
    return <LinearBuffer></LinearBuffer>;
  }
  return (
    <>
      <PureFunctionContext.Provider value={mutate}>
        <TableDjango
          onAction={handleAction}
          enhancedTableToolbar={EnhancedTableToolbar}
          selectedState={[selected, setSelected]}
          onSetPageSize={handleSetpageSize}
          onRequestSort={handleRequestSort}
          onSetPage={handleSetTargetPage}
          rows={data}
          headCells={headCells}
          title={LABEL}
          pagination={paginationState}
        ></TableDjango>
      </PureFunctionContext.Provider>
    </>
  );
}
