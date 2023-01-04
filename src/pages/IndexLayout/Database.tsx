import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Settings from "../../components/database/Settings";

const DatabaseTable = React.lazy(
  () => import("../../components/database/DatabaseTable")
);

export default function Index() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      console.log(id);
    }
  }, [id]);

  return (
    <>{id ? <Settings id={id}></Settings> : <DatabaseTable></DatabaseTable>}</>
  );
}
