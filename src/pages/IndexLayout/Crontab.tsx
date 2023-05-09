import { useSearchParams } from "react-router-dom";
import CrontabTable from "../../components/crontab/CrontabTable";
import UpdateCrontab from "../../components/crontab/UpdateCrontab";

export default function Index() {
  const [searchParams] = useSearchParams();

  const action = searchParams.get("action") || "";

  if (action === "update") {
    return <UpdateCrontab></UpdateCrontab>;
  }

  return (
    <>
      <CrontabTable></CrontabTable>
    </>
  );
}
