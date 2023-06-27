import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import DialogContent from "@mui/material/DialogContent";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import useSWR from "swr";
import { fetchData } from "../../requests/http";
import { GlobalLoadingAtom } from "../../store/recoilStore";
import { ApplicationType, CreateWebsiteStepProps } from "./interface";

export default function SelectApplication(
  props: CreateWebsiteStepProps & {
    onSelectApplication: (application: ApplicationType) => void;
  }
) {
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [globalLoadingAtom, setGlobalLoadingAtom] =
    useRecoilState(GlobalLoadingAtom);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let key = (event.target as HTMLInputElement).value;
    setSelectedApplicaiton(key);
    props.onSelectApplication(application.data[key]);
  };

  const [selectedApplication, setSelectedApplicaiton] = useState("");

  const application = useSWR("listApplication", (url) =>
    fetchData({ apiType: url }).then((res) => res.json())
  );

  const handleNextStep = () => {
    props.requestBody.current.website = {
      ...props.requestBody.current.website,
      application: selectedApplication,
    };
    props.onNextStep ? props.onNextStep() : null;
  };

  if (!application.data && !application.error)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (application.error)
    return <>"An error has occurred: " + application.error</>;

  let data: { [propName: string]: ApplicationType } = application.data;

  return (
    <>
      <DialogContent>
        <FormControl>
          <FormLabel id="application-radio-buttons-group-label">
            {t("Select Application")}
          </FormLabel>
          <RadioGroup
            row
            value={selectedApplication}
            aria-labelledby="application-radio-buttons-group-label"
            name="radio-buttons-group"
            onChange={handleChange}
          >
            {Object.keys(data).map((item) => {
              let name = data[item].info.name;
              return (
                <FormControlLabel
                  key={item}
                  value={item}
                  control={<Radio />}
                  label={name}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        {props.onNextStep && (
          <Button
            disabled={!selectedApplication}
            variant="contained"
            onClick={handleNextStep}
          >
            {t("next")}
          </Button>
        )}
      </DialogActions>
    </>
  );
}
