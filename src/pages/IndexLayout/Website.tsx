import { useEffect } from "react";
import { useParams } from "react-router-dom";
import WebsiteSettingsTab from "../../components/website/WebsiteSettingsTab";
import WebsiteTable from "../../components/website/WebsiteTable";

export default function Index() {
  // get react router params
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      console.log(id);
    }
  }, [id]);

  return (
    <div>
      {id ? (
        <WebsiteSettingsTab id={id}></WebsiteSettingsTab>
      ) : (
        <div>
          <WebsiteTable />
        </div>
      )}
    </div>
  );
}
