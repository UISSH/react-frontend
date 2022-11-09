import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLoaderData } from "react-router-dom";
import { useRecoilState } from "recoil";
import { TableDjango } from "../../components/djangoTable";
import { ApiType, getfetch } from "../../requests/http";
import { GlobalLoadingAtom, GlobalProgressAtom } from "../../store/recoilStore";
import PublicIcon from '@mui/icons-material/Public';
import { Switch } from "@mui/material";

import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';



export async function loader(props: { params: object }) {
    let data = useLoaderData()
}

export async function action(props: { params: any, request: any }) {
    let formData = await props.request.formData();

}

function SwitchSSL({ id, status, onUpdate }: {
    id: string,
    status: boolean
    onUpdate: Function
}) {
    const rowID = id

    const [_, setGlobalLoadingAtomState] = useRecoilState(GlobalLoadingAtom)

    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let checked = event.target.checked

        let action: ApiType = checked ? "enableWebsiteSSL" : "disableWebsiteSSL"
        setGlobalLoadingAtomState(true)
        getfetch(action, {
            method: 'post'
        }, {
            pathParam: { id: rowID }
        }).then(res => {
            return res.json()
        }).then(res => {
            console.log({ "switch ssl toggle": res })
            if (res.result.result === 2) {
                enqueueSnackbar(res.msg, { variant: "error" });
            } else {
                enqueueSnackbar("ok", { variant: "success", });

            }

        }).finally(() => {
            setGlobalLoadingAtomState(false)
            onUpdate()
        })
    };

    return (
        <Switch
            onClick={(e) => {
                e.stopPropagation();
            }}
            checked={status}
            color={status ? 'success' : 'default'}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
        />
    );



}


export default function Index() {
    const [globalProgressState, setGlobalProgressState] = useRecoilState(GlobalProgressAtom)
    const [t] = useTranslation()
    const headCells = [
        {
            key: 'domain',
            id: 'domain',
            numeric: false,
            disablePadding: true,
            label: t('website.domain'),
        },
        {
            key: 'web_server_type_text',
            id: 'application',
            numeric: true,
            disablePadding: false,
            label: t('website.application'),
        },
        {
            key: 'database_id',
            id: 'database',
            numeric: true,
            disablePadding: false,
            label: t('website.database'),
        },
        {
            key: 'index_root',
            id: 'path',
            numeric: true,
            disablePadding: false,
            label: t('website.path'),
        },
        {
            key: 'ssl_enable',
            id: 'ssl',
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

    const handleSetTargetPage = (targetPage: number) => {
        setPageState(targetPage)
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
                "page": String(pageState)
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
    return (<>
        <TableDjango onSetPage={handleSetTargetPage} rows={rowsState} headCells={headCells} title={"layout.website"} pagination={paginationState}></TableDjango>
    </>)

}