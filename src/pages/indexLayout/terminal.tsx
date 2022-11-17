import { useLoaderData } from "react-router-dom";
import SystemStatus from "../../components/overview/SystemStatus";

export async function loader(props: { params: object }) {
  let data = useLoaderData();
}

export async function action(props: { params: any; request: any }) {
  let formData = await props.request.formData();
}

export default function Index() {
  return (
    <>
      <div></div>
    </>
  );
}
