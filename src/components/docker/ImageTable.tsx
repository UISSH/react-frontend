import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";

import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import {
  alpha,
  Box,
  Button,
  ButtonGroup,
  Chip,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { PureFunctionContext } from "../../Context";
import { requestData } from "../../requests/http";
import { formatBytes } from "../../utils";
import { EnhancedTableToolbarProps, TableDjango } from "../DjangoTable";
import LinearBuffer from "../LinearBuffer";
import { ImageRowIF as RowIF } from "./schema";
import SearchImage from "./SearchImage";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";

const LABEL = "docker.image";

export interface ImageTableProps {}

export function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const onReloadTableData = useContext(PureFunctionContext);
  const { numSelected } = props;
  const [t] = useTranslation();

  const handleDelete = () => {
    props.onAction && props.onAction("delete");
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
        }}>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 50%" }}
            color="inherit"
            variant="subtitle1"
            component="div">
            {numSelected} {t(LABEL)}
          </Typography>
        ) : (
          <Box className="flex gap-4 items-center" sx={{ flex: "1 1 50%" }}>
            <Typography
              className="capitalize"
              variant="h6"
              id="tableTitle"
              component="div">
              {t(LABEL)}
            </Typography>
            <SearchImage />
          </Box>
        )}
        <ButtonGroup
          className="flex-nowarp"
          variant="contained"
          aria-label="outlined primary button group">
          {numSelected > 0 ? (
            <Button
              color="error"
              className="flex flex-nowrap"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}>
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
export default function ImageTable(props: ImageTableProps) {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [pullImageDialogOpen, setPullImageDialogOpen] = useState(false);

  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const headCells = [
    {
      key: "id_name",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },

    {
      key: "tags",
      numeric: true,
      disablePadding: false,
      label: "tags",
    },
    {
      key: "size",
      numeric: true,
      disablePadding: false,
      label: "size",
    },
    {
      key: "created",
      numeric: true,
      disablePadding: false,
      label: "created",
    },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const [selected, setSelected] = useState<readonly string[]>([]);

  const deleteImage = async (id: string) => {
    setGlobalLoadingAtom(true);
    let res = await requestData({
      url: `/api/DockerImage/${id}`,
      method: "DELETE",
    });
    if (res.ok) {
      enqueueSnackbar(t("success"), { variant: "success" });
    } else {
      enqueueSnackbar(await res.text(), { variant: "error" });
    }
    setGlobalLoadingAtom(false);
  };

  const handleAction = async (action: string) => {
    if (action === "reload") {
      mutate();
    } else if (action === "delete") {
      for (let id of selected) {
        await deleteImage(id);
      }
      mutate();
    } else if (action === "add") {
      setPullImageDialogOpen(true);
    }
  };

  const transformRowData = (data: RowIF[]) => {
    return data.map((row) => {
      row.id_name = (
        <Tooltip title={row.id}>
          <Button>{row.id.replace("sha256:", "").slice(0, 12)}</Button>
        </Tooltip>
      );
      row.size = formatBytes(Number(row.size));
      row.created = new Date(parseInt(row.created) * 1000).toLocaleString();
      row.tags = (
        <div className="flex gap-1 justify-end">
          {row.repoTags.map((tag) => {
            return <Chip key={tag} label={tag} />;
          })}

          <Tooltip title="Create and run a docker container from this image">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                navigate("/dash/new_container", {
                  state: {
                    imageName: row.repoTags[0],
                    imageId: row.id,
                  },
                });
              }}>
              <PlayCircleFilledWhiteIcon />
            </IconButton>
          </Tooltip>
        </div>
      );

      return row;
    });
  };

  const { mutate, data, isLoading, error } = useSWR<RowIF[]>(
    "/api/DockerImage/",
    async (url) => {
      setSelected([]);
      let data = await requestData({
        url: url,
        method: "GET",
      });
      if (data.ok) {
        let res = await data.json();
        return transformRowData(res.results);
      } else {
        enqueueSnackbar(t("common.error"), {
          variant: "error",
        });
        return [];
      }
    }
  );

  if (error) {
    console.log(error);
    let msg =
      "oops, something went wrong! please open the console to see the error message";
    enqueueSnackbar(msg, {
      variant: "error",
    });
  }

  const handleSetTargetPage = (targetPage: number) => {
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
          onSetPage={handleSetTargetPage}
          rows={data}
          headCells={headCells}
          title={LABEL}></TableDjango>
      </PureFunctionContext.Provider>
    </>
  );
}
