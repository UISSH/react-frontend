import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

import DialogTitle from "@mui/material/DialogTitle";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { fetchData } from "../../requests/http";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import CardDialog from "../CardDialog";
import ApplicationSettings from "./ApplicationSettings";
import BaseSetting from "./BaseSetting";
import { ApplicationType } from "./interface";
import SelectApplication from "./SelectApplication";

interface CreateWebsiteProps {
  open: boolean;
  onStatus: (result: "done" | "cancel") => void;
}

export default function CreateWebsiteDialog(props: CreateWebsiteProps) {
  const { open, onStatus } = { ...props };
  const [t] = useTranslation();

  const [step, setStep] = useState(1);
  const [application, setApplication] = useState<ApplicationType>();
  const requestBody = useRef({
    website: {},
    database: {},
  });

  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const handlePreviousStep = () => {
    setStep((state) => {
      return state - 1 < 0 ? 1 : state - 1;
    });
  };

  const handleNextStep = () => {
    setStep((state) => (state + 1) % 4);
  };

  const handleSelectApplication = (data: ApplicationType) => {
    setApplication(data);
  };

  const handleDone = async () => {
    setGlobalLoadingAtom(true);

    console.log(requestBody.current);

    // create website

    let res = await fetchData({
      apiType: "website",
      init: {
        method: "POST",
        body: JSON.stringify(requestBody.current.website),
      },
    });
    let resWebsiteJson = { id: -1 };

    if (res.ok) {
      resWebsiteJson = await res.json();
    } else {
      setGlobalLoadingAtom(false);
      enqueueSnackbar(t("Create website error"), { variant: "error" });
      return;
    }

    // create database
    res = await fetchData({
      apiType: "database",
      init: {
        method: "POST",
        body: JSON.stringify({
          ...requestBody.current.database,
          website: resWebsiteJson.id,
        }),
      },
    });

    let resDatabaseJson = { id: -1 };

    if (res.ok) {
      resDatabaseJson = await res.json();
    } else {
      setGlobalLoadingAtom(false);
      enqueueSnackbar(t("Create database error"), { variant: "error" });
      return;
    }

    // create database instance on server

    res = await fetchData({
      apiType: "createDatabaseInstance",
      init: {
        method: "POST",
      },
      params: {
        pathParam: { id: String(resDatabaseJson.id) },
      },
    });

    if (!res.ok) {
      setGlobalLoadingAtom(false);
      enqueueSnackbar(t("Create database instance error"), {
        variant: "error",
      });

      return;
    }

    res = await fetchData({
      apiType: "createApplication",
      init: {
        method: "POST",
      },
      params: {
        pathParam: { id: String(resWebsiteJson.id) },
      },
    });

    if (!res.ok) {
      setGlobalLoadingAtom(false);
      enqueueSnackbar(t("Failed to deploy application"), {
        variant: "error",
      });
      return;
    }

    setGlobalLoadingAtom(false);
    enqueueSnackbar(t("Successfully deployed the application"), {
      variant: "success",
    });
    onStatus("done");
  };

  useEffect(() => {
    if (!open) {
      setStep(1);
    }
  }, [open]);

  return (
    <CardDialog
      disableEscapeKeyDown
      open={open}
      onClose={() => onStatus("cancel")}>
      <DialogTitle
        bgcolor={(theme) => theme.palette.primary.main}
        color={(theme) => theme.palette.text.disabled}>
        <div className="flex justify-between  items-center">
          <div className="capitalize">{t("website.create-new-website")}</div>
          <IconButton color="inherit" onClick={() => onStatus("cancel")}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      {open && (
        <div className={step === 1 ? "" : "hidden"}>
          <SelectApplication
            requestBody={requestBody}
            onNextStep={handleNextStep}
            onSelectApplication={handleSelectApplication}></SelectApplication>
        </div>
      )}

      {open && (
        <div className={step === 2 ? "" : "hidden"}>
          <BaseSetting
            requestBody={requestBody}
            onPreviousStep={handlePreviousStep}
            onNextStep={handleNextStep}></BaseSetting>
        </div>
      )}

      {open && step === 3 && (
        <ApplicationSettings
          onDone={handleDone}
          requestBody={requestBody}
          onPreviousStep={handlePreviousStep}
          application={application}></ApplicationSettings>
      )}
    </CardDialog>
  );
}
