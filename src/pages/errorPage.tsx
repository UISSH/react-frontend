import { useNavigate, useRouteError } from "react-router-dom";

import { Alert, AlertTitle, Button, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { useTranslation } from "react-i18next";
import theme from "../themes";



function Context() {

    let error: {
        data: string,
        statusText?: string,
        message?: string,
    } = useRouteError() as any;

    const { t, i18n } = useTranslation();
    const navigate = useNavigate()
    const backHome = () => {
        navigate('/')
    }

    return (
        <div className={"container bg-gray-100 h-screen "}>
            <div className={"md:grid md:h-screen md:place-items-center grid place-items-center md:pt-0  pt-8  px-2"}>
                <div className="w-11/12 md:max-w-xl  pb-8 rounded-2xl shadow-2xl bg-white">
                    <Alert severity="error" >
                        <AlertTitle className=" text-2xl"> {t("Oops")} !</AlertTitle>
                        {t("sorry-an-unexpected-error-has-occurred")}
                    </Alert>
                    <div className="p-8">
                        {t(error.data) || t(error.statusText ? error.statusText : '') || error.message}
                    </div>

                    <div className="text-right px-8" ><Button variant="contained" onClick={backHome}  >{t("back-home")} </Button></div>
                </div>
            </div>
        </div>

    );
}

export default function ErrorPage() {
    return (<StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme()}>
            <CssBaseline />
            <Context />
        </ThemeProvider>
    </StyledEngineProvider>)
}