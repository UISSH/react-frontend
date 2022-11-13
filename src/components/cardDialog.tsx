
import { useMediaQuery } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog'

export default function CardDialog(props: DialogProps): JSX.Element {
    const matches = useMediaQuery('(min-width:800px)');
    return (
        <Dialog
            PaperProps={{ sx: { borderRadius: "6px", minWidth: matches ? '500px' : '360px' }, className: "shadow-sm", }}
            {...props}
        >{props.children}</Dialog>)

}