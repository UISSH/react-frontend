import DoneIcon from "@mui/icons-material/Done";
import HomeIcon from "@mui/icons-material/Home";
import {
  Breadcrumbs,
  IconButton,
  InputAdornment,
  Link,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface ExplorerBreadcrumbProps {}

export default function ExplorerBreadcrumb(props: ExplorerBreadcrumbProps) {
  const [pathInputShow, setPathInputShow] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPath, setCurrentPath] = React.useState<string | null>();

  useEffect(() => {
    if (searchParams.has("directory")) {
      console.log(searchParams.get("directory"));
      setCurrentPath(searchParams.get("directory"));
    }
  }, [searchParams]);

  const handleBreadcrumbClick = (i: number) => {};

  const LinkMemo = useMemo(() => {
    const directory = searchParams.get("directory");

    if (directory === "/" || !directory) {
      return;
    }

    console.log(directory);

    let data = directory.split("/");
    data = data.filter((d) => d !== "");

    return data?.map((h, i) => {
      return (
        <Link
          key={i}
          underline="hover"
          color="inherit"
          className="cursor-pointer "
          onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
            setSearchParams({
              directory: "/" + data.slice(0, i + 1).join("/"),
            });
          }}>
          {h}
        </Link>
      );
    });

    // <Link
    //   key={i}
    //   underline="hover"
    //   color="inherit"
    //   className="cursor-pointer "
    //   onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    //     e.stopPropagation();
    //     handleBreadcrumbClick(i);
    //   }}>
    //   {h}
    // </Link>;
  }, [searchParams]);

  return (
    <>
      {pathInputShow ? (
        <div className="p-2">
          <TextField
            size="small"
            value={currentPath ? currentPath : "/"}
            autoFocus
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={(
                      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ) => {
                      setPathInputShow(false);
                      setSearchParams({
                        directory: currentPath as string,
                      });
                    }}>
                    <DoneIcon></DoneIcon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onBlur={(
              e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              setTimeout(() => {
                setPathInputShow(false);
              }, 100);
            }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key == "Enter") {
                setPathInputShow(false);
                setSearchParams({
                  directory: currentPath as string,
                });
              }
            }}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              setCurrentPath(e.target.value);
            }}></TextField>
        </div>
      ) : (
        <div
          className="flex items-center p-2 "
          style={{
            height: "56px",
          }}>
          <Breadcrumbs
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              setPathInputShow(true);
            }}
            aria-label="breadcrumb"
            className="cursor-pointer pr-20 ">
            <Link
              underline="hover"
              color="inherit"
              className="cursor-pointer "
              onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                e.preventDefault();
                e.stopPropagation();
                setSearchParams({
                  directory: "/",
                });
              }}>
              <HomeIcon />
            </Link>
            {LinkMemo}
          </Breadcrumbs>
        </div>
      )}
    </>
  );
}
