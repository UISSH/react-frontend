import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  redirect,
  createHashRouter,
} from "react-router-dom";

import { loader as indexLayoutLoader } from "../layouts/indexLayout";
//import DevelopDemo from "../pages/DevelopDemo";
import ErrorPage from "../pages/ErrorPage";

const Login = lazy(() => import("../pages/Login"));
const IndexLayout = lazy(() => import("../layouts/indexLayout"));
const Index = lazy(() => import("../pages/IndexLayout/Index"));
const Website = lazy(() => import("../pages/IndexLayout/Website"));
const Database = lazy(() => import("../pages/IndexLayout/Database"));
const File = lazy(() => import("../pages/IndexLayout/Explorer"));
const Terminal = lazy(() => import("../pages/IndexLayout/Terminal"));
const FileSystem = lazy(() => import("../pages/IndexLayout/FileSystem"));
const DevelopDemo = lazy(() => import("../pages/DevelopDemo"));

const MonacoEditorPage = lazy(() => import("../pages/MonacoEditor"));
const HappyNewYear = lazy(() => import("../pages/HappyNewYear"));

export const router = createHashRouter([
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
        path: "website/:id",
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
        path: "database/:id",
        element: (
          <Suspense>
            <Database></Database>
          </Suspense>
        ),
      },
      {
        path: "explorer",
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
            <FileSystem></FileSystem>
          </Suspense>
        ),
      },
      {
        path: "editor",
        element: (
          <Suspense>
            <MonacoEditorPage></MonacoEditorPage>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "dev",
    element: (
      <Suspense>
        <DevelopDemo></DevelopDemo>
      </Suspense>
    ),
  },
  {
    path: "hny",
    element: (
      <Suspense>
        <HappyNewYear></HappyNewYear>
      </Suspense>
    ),
  },

  { path: "/api" },
]);
