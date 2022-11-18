import { createBrowserRouter, redirect } from "react-router-dom";
import LazySuspense from "../components/LazySuspense";

import { loader as indexLayoutLoader } from "../layouts/indexLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <LazySuspense import="../pages/ErrorPage" />,
    element: <LazySuspense import="../pages/Login" loading={true} />,
  },
  {
    path: "/login",
    element: <LazySuspense import="../pages/Login" loading={true} />,
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
