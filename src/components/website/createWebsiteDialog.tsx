import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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

  const canNext = useRef(false);

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
            onNextStep={handleNextStep}
            onSelectApplication={handleSelectApplication}></SelectApplication>
        </div>
      )}

      {open && (
        <div className={step === 2 ? "" : "hidden"}>
          <BaseSetting
            onPreviousStep={handlePreviousStep}
            onNextStep={handleNextStep}></BaseSetting>
        </div>
      )}

      {open && step === 3 && (
        <ApplicationSettings
          onPreviousStep={handlePreviousStep}
          application={application}></ApplicationSettings>
      )}
    </CardDialog>
  );
}
