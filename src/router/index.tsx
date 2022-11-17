import { createBrowserRouter, redirect } from "react-router-dom";

import { loader as indexLayoutLoader } from "../layouts/indexLayout";

import { lazy, Suspense } from "react";
import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div className="grid h-screen place-items-center">
      <CircularProgress size={"128px"} />
    </div>
  );
};

const LazySuspense = (props: { import: string }) => {
  let Component = lazy(() => import(props.import));

  return (
    <Suspense fallback={<Loading />}>
      <Component></Component>
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <LazySuspense import="../pages/ErrorPage" />,
    element: <LazySuspense import="../pages/Login" />,
  },
  {
    path: "/login",
    element: <LazySuspense import="../pages/Login" />,
  },
  {
    path: "/dash",
    loader: indexLayoutLoader,
    element: <LazySuspense import="../layouts/indexLayout" />,
    errorElement: <LazySuspense import="../pages/ErrorPage" />,
    children: [
      {
        index: true,
        loader: () => {
          return redirect("/dash/index");
        },
      },
      {
        path: "index",
        element: <LazySuspense import="../pages/IndexLayout/Index" />,
      },
      {
        path: "website",
        element: <LazySuspense import="../pages/IndexLayout/Website" />,
      },
      {
        path: "database",
        element: <LazySuspense import="../pages/IndexLayout/Database" />,
      },
      {
        path: "file",
        element: <LazySuspense import="../pages/IndexLayout/File" />,
      },
      {
        path: "terminal",
        element: <LazySuspense import="../pages/IndexLayout/Terminal" />,
      },
      {
        path: "mount",
        element: <LazySuspense import="../pages/IndexLayout/Mount" />,
      },
    ],
  },
  { path: "/api" },
]);
