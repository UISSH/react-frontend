import { useEffect, useState } from 'react'
import axios from "axios"


export interface NetErrorValue {
    item: object,
    msg: string,
}

export function useNetError(err: any) {

    const getItemValue = (val: string) => {
        if (state.item.hasOwnProperty(val)) {
            // @ts-ignore
            return state.item[val]
        } else {
            return null

        }

    }
    const [state, setState] = useState<NetErrorValue & { getItem: Function }>({
        item: {}, msg: "", getItem: getItemValue,
    })

    const setNetState = (err: NetErrorValue | null) => {
        if (err) {
            state.item = err.item
            state.msg = err.msg

        } else {
            state.msg = ""
            state.item = {}
        }
        setState(state)

    }

    useEffect(() => {
        setNetState(err)
    })

    return [state, setNetState] as const
}