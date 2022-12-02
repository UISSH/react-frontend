import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { useRecoilState } from "recoil";
import { AppBarOpenAtom } from "../../store/recoilStore";
import { Input } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export interface FooterBarProps {
  children?: React.ReactNode;
}

export default function FooterBar(props: FooterBarProps) {
  const [open, setOpen] = useRecoilState(AppBarOpenAtom);

  const getSX = () => {
    return open
      ? { top: "auto", bottom: 0, paddingLeft: "240px" }
      : { top: "auto", bottom: 0 };
  };

  return (
    <>
      <AppBar
        // @ts-ignore
        sx={{
          background: (theme) => theme.palette.secondary.main,
          ...getSX(),
        }}
        position="fixed">
        <Toolbar className="gap-1">
          <IconButton color="inherit">
            <MoreIcon />
          </IconButton>
          <Box
            component="form"
            sx={{
              flexGrow: 1,
              "& > :not(style)": { m: 1 },
              paddingRight: "18px",
            }}
            noValidate
            autoComplete="off">
            <Input
              fullWidth
              endAdornment={
                <IconButton>
                  <SendIcon />
                </IconButton>
              }
              sx={{
                color: (theme) => theme.palette.text.primary,
                backgroundColor: (theme) => theme.palette.background.default,
              }}
              className="pl-4 gap-1 rounded-sm "
              placeholder="Type your command here"
            />
          </Box>
          <IconButton color="inherit">
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
}
