import { createBrowserRouter, json, redirect } from "react-router-dom";

import Login from "../pages/login";

import ErrorPage from "../pages/errorPage";
import IndexLayout, {
  loader as indexLayoutLoader,
} from "../layouts/indexLayout";
import Index from "../pages/indexLayout/index";
import Website from "../pages/indexLayout/website";
import Database from "../pages/indexLayout/database";
import File from "../pages/indexLayout/file";
import Terminal from "../pages/indexLayout/terminal";
import Mount from "../pages/indexLayout/mount";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Login />,
  },
  { path: "/login", element: <Login /> },
  {
    path: "/dash",
    loader: indexLayoutLoader,
    element: <IndexLayout />,
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
        element: <Index></Index>,
      },
      {
        path: "website",
        element: <Website></Website>,
      },
      {
        path: "database",
        element: <Database></Database>,
      },
      {
        path: "file",
        element: <File></File>,
      },
      {
        path: "terminal",
        element: <Terminal></Terminal>,
      },
      {
        path: "mount",
        element: <Mount></Mount>,
      },
    ],
  },
  { path: "/api" },
]);
