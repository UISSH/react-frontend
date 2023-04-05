import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

import DialogTitle from "@mui/material/DialogTitle";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { requestData } from "../../requests/http";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import CardDialog from "../CardDialog";
import ApplicationSettings from "./ApplicationSettings";
import BaseSetting from "./BaseSetting";
import SelectApplication from "./SelectApplication";
import { ApplicationType, RequestBodyIF } from "./interface";

interface CreateWebsiteProps {
  open: boolean;
  onStatus: (result: "done" | "cancel") => void;
}

export default function CreateWebsiteDialog(props: CreateWebsiteProps) {
  const { open, onStatus } = { ...props };
  const [t] = useTranslation();

  const [step, setStep] = useState(1);
  const [application, setApplication] = useState<ApplicationType>();
  const requestBody = useRef<RequestBodyIF>({
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
    if (requestBody.current == undefined) {
      return;
    }

    setGlobalLoadingAtom(true);

    let res = await requestData({
      url: "website",
      method: "POST",
      data: requestBody.current.website,
    });

    let resWebsiteJson = { id: -1 };

    if (res.ok) {
      resWebsiteJson = await res.json();
    } else {
      setGlobalLoadingAtom(false);
      enqueueSnackbar(t("Create website error"), { variant: "error" });
      return;
    }

    res = await requestData({
      url: "database",
      method: "POST",
      data: {
        ...requestBody.current.database,
        website: resWebsiteJson.id,
      },
    });

    let resDatabaseJson = { id: -1 };

    if (Object.keys(requestBody.current.database).length !== 0) {
      if (res.ok) {
        resDatabaseJson = await res.json();
      } else {
        setGlobalLoadingAtom(false);
        enqueueSnackbar(t("Create database error"), { variant: "error" });
        return;
      }
      res = await requestData({
        url: `/api/DataBase/${resDatabaseJson.id}/create_instance/`,
        method: "POST",
      });

      if (!res.ok) {
        setGlobalLoadingAtom(false);
        enqueueSnackbar(t("Create database instance error"), {
          variant: "error",
        });

        return;
      }
    }

    res = await requestData({
      url: `/api/Application/${resWebsiteJson.id}/app_create/`,
      method: "POST",
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

    if (res.ok && requestBody.current.website?.ssl_enable) {
      setGlobalLoadingAtom(true);
      requestData({
        url: `/api/Website/${resWebsiteJson.id}/enable_ssl/`,
        method: "POST",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.result.result === 2) {
            enqueueSnackbar(res.msg, { variant: "error" });
          } else {
            enqueueSnackbar("ok", { variant: "success" });
          }
        })
        .finally(() => {
          setGlobalLoadingAtom(false);
          onStatus("done");
        });
    }
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
        <div className="flex justify-between items-center">
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
