import useSWR from "swr";
import { requestOsqueryData } from "../../requests/http";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

interface ContainerProps {
  id: string;
}
export default function ContainerPort(props: ContainerProps) {
  const { data, isLoading, error, mutate } = useSWR(props.id, async () => {
    let res = await requestOsqueryData(
      "select * from docker_container_ports where id = '" + props.id + "';"
    );
    return res.json();
  });
  if (isLoading) return <div>loading...</div>;
  if (error) return <div>error</div>;
  if (!data) return <div>no data</div>;
  return (
    <div>
      {data.results.map((row: any) => {
        return (
          <div className="flex  justify-end items-center">
            {row.port} {<ArrowRightAltIcon></ArrowRightAltIcon>} [{row.host_ip}
            ]:
            {row.host_port}
          </div>
        );
      })}
    </div>
  );
}
