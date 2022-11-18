import BlurOnIcon from "@mui/icons-material/BlurOn";
import { lazy, Suspense } from "react";
const Loading = () => {
  return (
    <div className="grid h-screen place-items-center bg-gray-50">
      <BlurOnIcon
        className="animate-spin text-6xl"
        color="primary"
        fontSize="large"></BlurOnIcon>
    </div>
  );
};

export default function LazySuspense(props: {
  import: string;
  loading?: boolean;
}) {
  console.log(props.import);
  const Component = lazy(() => import(props.import));

  return (
    <Suspense fallback={props.loading && <Loading />}>
      <Component></Component>
    </Suspense>
  );
}
