import PublicIcon from '@mui/icons-material/Public';
import { alpha, Button, ButtonGroup, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { TableDjango } from "../../components/djangoTable";
import { SwitchSSL } from '../../components/website/switchSSL';
import { getfetch } from "../../requests/http";
import { GlobalProgressAtom } from "../../store/recoilStore";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateWebsiteDialog from './createWebsiteDialog';

interface EnhancedTableToolbarProps {
    numSelected: number;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;
    const [t] = useTranslation()
    const [openDialog, setOpenDialog] = useState(true)

    return (<>
        <CreateWebsiteDialog open={openDialog} onStatus={(res) => { setOpenDialog(false) }}></CreateWebsiteDialog>
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} {t("layout.website")}
                </Typography>
            ) : (
                <Typography
                    className='capitalize'
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    {t("layout.website")}
                </Typography>
            )}
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button startIcon={<AddIcon />} onClick={() => { setOpenDialog(true) }}>{t("website.add")}</Button>

                {numSelected > 0 ? (
                    <Button color='error' startIcon={<DeleteIcon />}>{t("website.delete")}</Button>
                ) : (<div></div>)}
            </ButtonGroup>

        </Toolbar>
    </>
    );
}

export default function WebsiteTable() {
    const [t] = useTranslation()
    const headCells = [
        {
            key: 'id',
            numeric: false,
            disablePadding: true,
            label: 'ID',
        }, {
            key: 'domain',
            numeric: false,
            disablePadding: false,
            label: t('website.domain'),
        },
        {
            key: 'web_server_type_text',
            numeric: true,
            disablePadding: false,
            label: t('website.application'),
        },
        {
            key: 'database_id',
            numeric: true,
            disablePadding: false,
            label: t('website.database'),
        },
        {
            key: 'index_root',
            numeric: true,
            disablePadding: false,
            label: t('website.path'),
        },
        {
            key: 'ssl_enable',
            numeric: true,
            disablePadding: false,
            label: t('website.ssl'),
        },
    ];
    const [globalProgress, setGlobalProgress] = useRecoilState(GlobalProgressAtom)
    const [updateState, setUpdateState] = useState(1)
    const [rowsState, setRowsState] = useState([])
    const [paginationState, setPaginationState] = useState()
    const [pageState, setPageState] = useState(1)
    const [orederState, setOrederState] = useState("-id")
    const [pageSizeState, setPageSizeState] = useState(5)
    const [selected, setSelected] = useState<readonly string[]>([]);
    const handleSetTargetPage = (targetPage: number) => {
        setPageState(targetPage)
        setUpdateState(updateState + 1)
    }
    const handleRequestSort = (
        order: string,
        property: any,
    ) => {
        setOrederState(order + property)
        setUpdateState(updateState + 1)
    };

    const handleSetpageSize = (size: number) => {
        setPageSizeState(size)
        setUpdateState(updateState + 1)
    }

    useEffect(() => {
        setGlobalProgress(true)
        const handleUpdate = () => {
            setUpdateState(updateState + 1)
        }
        getfetch("website", {
        }, {
            searchParam: {
                "page": String(pageState),
                "ordering": orederState,
                "page_size": String(pageSizeState)
            }
        }).then(res => res.json()).then(res => {
            setRowsState(res.results.map((row: any) => {
                row.domain = <div className="flex content-center gap-1">{row.domain} <PublicIcon fontSize="small" color={row.ssl_enable ? "success" : "inherit"}></PublicIcon> </div>
                row.database_id = row.database_id ? row.database_id : '-'
                row.ssl_enable = <SwitchSSL id={row.id} status={row.ssl_enable} onUpdate={handleUpdate}></SwitchSSL>
                return row
            }))
            setPaginationState(res.pagination)
        }).finally(() => {
            setGlobalProgress(false)
        })
    }, [updateState])
    return (
        <div>
            <TableDjango
                enhancedTableToolbar={EnhancedTableToolbar} selectedState={[selected, setSelected]}
                onSetPageSize={handleSetpageSize} onRequestSort={handleRequestSort} onSetPage={handleSetTargetPage}
                rows={rowsState} headCells={headCells} title={"layout.website"} pagination={paginationState}
            />
        </div>
    )


}