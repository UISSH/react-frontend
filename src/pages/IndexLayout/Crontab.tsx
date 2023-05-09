import { useSearchParams } from "react-router-dom";
import CrontabTable from "../../components/crontab/CrontabTable";
import AddScheduleJob from "../../components/crontab/AddScheduleJob";

export default function Index() {
  const [searchParams] = useSearchParams();

  const action = searchParams.get("action") || "";

  if (action === "add") {
    return <AddScheduleJob></AddScheduleJob>;
  }

  return (
    <>
      <CrontabTable></CrontabTable>
    </>
  );
}
