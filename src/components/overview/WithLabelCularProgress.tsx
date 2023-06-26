/* 
https://linux.fasionchan.com/zh_CN/latest/maintenance/monitor/os/cpu-usage.html
*/

import {
    Box,
    CircularProgress,
    CircularProgressProps,
    Typography
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import React from "react";


const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}));

interface Props {
    value: number;
    label?: string | null;
    tooltip?: React.ReactNode;
}

export default function WithLabelCularProgress(
    props: CircularProgressProps & Props
) {
    const getColor = () => {
        // "primary" | "secondary" | "error" | "info" | "success" | "warning" |
        if (props.value < 30) {
            return "primary";
        } else if (props.value <= 60) {
            return "secondary";
        } else if (props.value <= 100) {
            return "warning";
        } else {
            return "error";
        }
    };

    const { value, ...other } = props;


    const getAverage = () => {
        if (value > 100) {
            return 100
        } else {
            return value
        }
    }




    return (
        <HtmlTooltip
            followCursor
            title={
                <React.Fragment>
                    <div>{props.tooltip}</div>
                </React.Fragment>
            }>
            <div>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress
                        variant="determinate"
                        sx={{
                            color: (theme) =>
                                theme.palette.grey[theme.palette.mode === "light" ? 50 : 800],
                        }}
                        size={"6rem"}
                        thickness={4}
                        {...props}
                        value={100}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        <CircularProgress

                            color={getColor()}
                            size={"6rem"}
                            variant="determinate"
                            {...other}
                            value={getAverage()}
                        />
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: "absolute",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <Typography
                                className={value > 100 ? " animate-bounce" : ""}
                                fontSize={18}
                                variant="caption"
                                component="div"
                                color={getColor()}>{`${Math.round(props.value)}%`}</Typography>
                        </Box>
                    </Box>
                </Box>
                <div className="text-center mt-2 uppercase">{props.label}</div>
            </div>
        </HtmlTooltip >
    );
}

