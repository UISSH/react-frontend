import { createBrowserRouter, json, redirect } from "react-router-dom";

import Login from "../pages/Login";

import ErrorPage from "../pages/ErrorPage";
import IndexLayout, {
  loader as indexLayoutLoader,
} from "../layouts/indexLayout";
import Index from "../pages/IndexLayout/Index";
import Website from "../pages/IndexLayout/Website";
import Database from "../pages/IndexLayout/Database";
import File from "../pages/IndexLayout/File";
import Terminal from "../pages/IndexLayout/Terminal";
import Mount from "../pages/IndexLayout/Mount";

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
