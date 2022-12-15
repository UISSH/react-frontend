import { Button, IconButton, MenuItem, MenuList, Tooltip } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { atom, useRecoilState } from "recoil";
import useSWR from "swr";
import { TERMINAL_SNIPPET_PREFIX } from "../../constant";
import { deleteKV, getKVList, GetKVListParams } from "../../requests/kvstorage";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { SplitButton } from "./HostsIndex";
import AddIcon from "@mui/icons-material/AddCircle";

interface Pagination {
  total_pages: number;
  current_page: number;
  total_record: number;
  next: string;
  previous?: any;
}

interface Result {
  id: number;
  create_at: string;
  update_at: string;
  key: string;
  value?: string;
}

export const SnippetListAtom = atom<Result[]>({
  key: "SnippetListAtom",
  default: [],
});

export default function Snippets() {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);
  const [pageSize, setPageSize] = useState(5);

  const [snippetListAtom, setSnippetListAtom] = useRecoilState(SnippetListAtom);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<Pagination>({
    total_pages: 0,
    current_page: 1,
    total_record: 0,
    next: "",
    previous: null,
  });

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPagination({ ...pagination, current_page: 1 });
    setPageSize(parseInt(event.target.value, 10));
  };

  let getKVListParams: GetKVListParams = {
    page: pagination.current_page.toString(),
    search: TERMINAL_SNIPPET_PREFIX,
    page_size: pageSize.toString(),
  };

  const { mutate } = useSWR(getKVListParams, (props) => {
    getKVList(props)
      .then((res) => res.json())
      .then((res) => {
        setPagination(res.pagination);
        setSnippetListAtom(res.results);
      });
  });

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {snippetListAtom.map((item) => {
          return (
            <SplitButton
              MenuList={
                <MenuList id={"split-button-menu-" + item}>
                  <MenuItem
                    onClick={() => {
                      deleteKV(item.key).then((res) => {
                        if (res.ok) {
                          enqueueSnackbar(t("common.delete-success"), {
                            variant: "success",
                          });
                          mutate();
                        } else {
                          enqueueSnackbar(t("common.delete-failed"), {
                            variant: "error",
                          });
                        }
                      });
                    }}>
                    {t("common.delete")}
                  </MenuItem>
                </MenuList>
              }>
              <Button
                variant="contained"
                key={item.id}
                onClick={() => {
                  navigate(`/dash/editor/`, {
                    state: {
                      type: "snippet",
                      name: item.key.replace(TERMINAL_SNIPPET_PREFIX, ""),
                      newSnippet: false,
                    },
                  });
                }}>
                {item.key.replace(TERMINAL_SNIPPET_PREFIX, "")}
              </Button>
            </SplitButton>
          );
        })}

        <Tooltip title={t("terminal.addsnippet")}>
          <IconButton
            color="primary"
            onClick={() => {
              // setPostHostOpen(true);
              navigate(`/dash/editor/`, {
                state: {
                  type: "snippet",
                  newSnippet: true,
                },
              });
            }}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </div>
      <TablePagination
        labelRowsPerPage={t("rows-per-page")}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={pagination.total_record}
        rowsPerPage={pageSize}
        page={pagination.current_page - 1}
        onPageChange={(e, page) => {
          setPagination({ ...pagination, current_page: page + 1 });
        }}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
