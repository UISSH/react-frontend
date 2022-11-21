import { lazy, Suspense } from "react";
import { createBrowserRouter, redirect } from "react-router-dom";

import { loader as indexLayoutLoader } from "../layouts/indexLayout";
import ErrorPage from "../pages/ErrorPage";

const Login = lazy(() => import("../pages/Login"));
const IndexLayout = lazy(() => import("../layouts/indexLayout"));
const Index = lazy(() => import("../pages/IndexLayout/Index"));
const Website = lazy(() => import("../pages/IndexLayout/Website"));
const Database = lazy(() => import("../pages/IndexLayout/Database"));
const File = lazy(() => import("../pages/IndexLayout/Explorer"));
const Terminal = lazy(() => import("../pages/IndexLayout/Terminal"));
const Mount = lazy(() => import("../pages/IndexLayout/Mount"));

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <Suspense>
        <Login></Login>
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense>
        <Login></Login>
      </Suspense>
    ),
  },
  {
    path: "/dash",
    loader: indexLayoutLoader,
    element: (
      <Suspense>
        <IndexLayout></IndexLayout>
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        loader: () => {
          return redirect("/dash/index");
        },
      },
      // {
      //   path: "index",
      //   element: <LazySuspense import="../pages/IndexLayout/Index" />,
      // },
      // {
      //   path: "website",
      //   element: <LazySuspense import="../pages/IndexLayout/Website" />,
      // },
      // {
      //   path: "database",
      //   element: <LazySuspense import="../pages/IndexLayout/Database" />,
      // },
      // {
      //   path: "file",
      //   element: <LazySuspense import="../pages/IndexLayout/File" />,
      // },
      // {
      //   path: "terminal",
      //   element: <LazySuspense import="../pages/IndexLayout/Terminal" />,
      // },
      // {
      //   path: "mount",
      //   element: <LazySuspense import="../pages/IndexLayout/Mount" />,
      // },

      {
        path: "index",
        element: (
          <Suspense>
            <Index></Index>
          </Suspense>
        ),
      },
      {
        path: "website",
        element: (
          <Suspense>
            <Website></Website>
          </Suspense>
        ),
      },
      {
        path: "database",
        element: (
          <Suspense>
            <Database></Database>
          </Suspense>
        ),
      },
      {
        path: "file",
        element: (
          <Suspense>
            <File></File>
          </Suspense>
        ),
      },
      {
        path: "terminal",
        element: (
          <Suspense>
            <Terminal></Terminal>
          </Suspense>
        ),
      },
      {
        path: "mount",
        element: (
          <Suspense>
            <Mount></Mount>
          </Suspense>
        ),
      },
    ],
  },
  { path: "/api" },
]);
