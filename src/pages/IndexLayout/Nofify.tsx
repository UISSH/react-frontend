import { useSearchParams } from "react-router-dom";
import NotifyDetail from "../../components/notify/NotifyDetail";

export default function index() {
  let [searchParams, setSearchParams] = useSearchParams();

  let event_id = searchParams.get("id");

  return <NotifyDetail eventID={event_id}></NotifyDetail>;
}
