import GetAppIcon from "@mui/icons-material/GetApp";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { debounce } from "@mui/material/utils";

import { useSnackbar } from "notistack";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { requestData } from "../../requests/http";
import { useRecoilState } from "recoil";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { PureFunctionContext } from "../../Context";
interface SearchImageProps {}
interface SearchImageListIF {
  star_count: number;
  is_official: boolean;
  name: string;
  is_automated: boolean;
  description: string;
}
export default function SearchImage(props: SearchImageProps) {
  const [t] = useTranslation();
  const onReloadTableData = useContext(PureFunctionContext);

  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const [searchImageList, setSearchImageList] = useState<SearchImageListIF[]>(
    []
  );

  const [inputValue, setInputValue] = useState("");
  const handlePull = async () => {
    setGlobalLoadingAtom(true);

    const res = await requestData({
      url: "/api/DockerImage/pull/",
      method: "POST",
      data: {
        name: inputValue,
      },
    });

    if (res.ok) {
      enqueueSnackbar(t("common.success"), {
        variant: "success",
      });
    } else {
      enqueueSnackbar(t("common.failed"), {
        variant: "error",
      });
    }
    setGlobalLoadingAtom(false);
    onReloadTableData();
  };

  const handleSearch = async (name: string) => {
    const res = await requestData({
      url: "/api/DockerImage/search/",
      method: "GET",
      params: {
        name: name ? name : inputValue,
      },
    });

    if (res.ok) {
      let data = await res.json();
      setSearchImageList(data.images);
    } else {
      enqueueSnackbar(t("common.failed"), {
        variant: "error",
      });
    }
  };

  const debounceHandleSearch = debounce(handleSearch, 500);

  return (
    <>
      <div className="flex gap-2 mt-2">
        <Autocomplete
          id="docker-image-select-demo"
          sx={{ minWidth: 250 }}
          size="small"
          onInputChange={(event, newInputValue) => {
            if (newInputValue) {
              debounceHandleSearch(newInputValue);
              setInputValue(newInputValue);
            }
          }}
          options={searchImageList}
          getOptionLabel={(option) => option.name}
          autoHighlight
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              {option.name} ({option.star_count})
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="pull image"
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password",
              }}
            />
          )}
        ></Autocomplete>

        <IconButton onClick={handlePull}>
          <GetAppIcon />
        </IconButton>
      </div>
    </>
  );
}
