
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, DialogActions, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, Radio, RadioGroup, Switch, TextField } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { getfetch } from '../../requests/http';
import CardDialog from '../cardDialog';
import { ApplicationType } from './interface';


interface CreateWebsiteProps {
    open: boolean,
    onStatus: (result: "done" | "cancel") => void;

}




export default function CreateWebsiteDialog(props: CreateWebsiteProps) {
    const { open, onStatus } = { ...props }
    const [t] = useTranslation()
    const [application, setApplication] = useState<{ [propName: string]: ApplicationType }>({})
    const [selectedApplication, setSelectedApplicaiton] = useState('')
    const [step, setStep] = useState(1)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedApplicaiton((event.target as HTMLInputElement).value)
    };

    const [canNext, setCanNext] = useState(false)
    const SelectApplication = () => {
        useEffect(() => {
            setCanNext(Boolean(selectedApplication))
        })

        return (<FormControl>
            <FormLabel className='pt-2' id="demo-radio-buttons-group-label"> Select Application</FormLabel>
            <RadioGroup
                row
                value={selectedApplication}
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={handleChange}
            >{Object.keys(application).map((item) => {
                console.log(application[item])
                let name = application[item].info.name
                return <FormControlLabel value={item} control={<Radio />} label={name} />
            })}
            </RadioGroup>
        </FormControl>)
    }

    const BaseSetting = () => {

        const [sslCheck, setSslCheck] = useState(false)
        const [databaseCheck, setDatabaseCheck] = useState(false)
        const handleSslChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            let status = event.target.checked

            getfetch('verifyDomainRecords', {}, {
                searchParam: { domain: "www.baidu.com" }
            }).then((res) => {
                console.log({ res })
            })
            setSslCheck(status);
        };

        const handleDatabaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setDatabaseCheck(event.target.checked);
        };
        return (<>
            <Box
                className="grid py-4 gap-2"
                component="form"
                noValidate
                autoComplete="off"
            >
                <div className='capitalize'><Divider textAlign="center" >{t('basic')}</Divider></div>

                <TextField
                    id={"website_name"}
                    label="name"
                />
                <TextField
                    id={"website_domain"}
                    label="domain"
                />
                <TextField
                    id={"website_directory"}
                    label="directory"
                />

                {databaseCheck ? <>
                    <div className='capitalize'><Divider textAlign="center" >{t('database')}</Divider></div>
                    <TextField
                        id={"database_name"}
                        label="name"
                    />
                    <TextField
                        id={"database_username"}
                        label="username"
                    />
                    <TextField
                        id={"website_directory"}
                        label={t("password")}
                    />
                </> : <></>}





            </Box>
            <FormGroup row sx={{ justifyContent: "right" }}>
                <FormControlLabel className='capitalize' control={<Switch checked={sslCheck}
                    onChange={handleSslChange} />} label={t("website.ssl")} />
                <FormControlLabel className='capitalize' control={<Switch checked={databaseCheck}
                    onChange={handleDatabaseChange} />} label={t("website.database")} />
            </FormGroup>

        </>)
    }

    const handlePrevious = () => {

        setStep((state) => { return state - 1 < 1 ? 1 : state - 1 })

    }

    const handleNext = () => {
        setCanNext(false)
        setStep((state) => (state + 1) % 3)

    }

    const getDialogContent = () => {



        if (step == 1) {
            return (<>
                <DialogContent>
                    <SelectApplication ></SelectApplication>
                </DialogContent>

            </>)
        } else if (step == 2) {
            return (<>
                <DialogContent>
                    <BaseSetting ></BaseSetting>
                </DialogContent>

            </>)
        } else {
            return (<></>)
        }
    }


    // 第一次挂载请求数据
    useEffect(() => {
        open ? getfetch("listApplication").then(res => res.json()).then(res => {
            setApplication(res)
            //setStep(1)
        }) : ''

    }, [open])

    return (
        <CardDialog disableEscapeKeyDown open={open} onClose={() => onStatus("cancel")}   >
            <DialogTitle bgcolor={(theme) => theme.palette.primary.main} color={(theme) => theme.palette.text.disabled}>
                <div className='flex justify-between  items-center'>
                    <div className='capitalize'>{t('website.create-new-website')}</div>
                    <IconButton color='inherit' onClick={() => onStatus("cancel")}>
                        <CloseIcon />
                    </IconButton >
                </div>

            </DialogTitle>

            {getDialogContent()}

            <DialogActions>
                {step > 1 && <Button variant="contained" onClick={handlePrevious}>{t('previous')}</Button>}
                <Button disabled={!canNext} variant="contained" onClick={handleNext}>{t('next')}</Button>
            </DialogActions>

        </CardDialog >

    );

}