import React from "react";

const DatabaseTable = React.lazy(
  () => import("../../components/database/DatabaseTable")
);

export default function Index() {
  return (
    <>
      <DatabaseTable></DatabaseTable>
    </>
  );
}
