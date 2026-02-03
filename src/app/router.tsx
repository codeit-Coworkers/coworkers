import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import User from "@/pages/User";
import Boards from "@/pages/Boards";
import { testRoutes } from "./testRoutes";
import Layout from "@/components/layout/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/user/:id",
    element: <User />,
  },

  ...testRoutes,

  {
    element: <Layout />,
    children: [
      { path: "/user", element: <User /> },
      { path: "/boards", element: <Boards /> },
    ],
  },
]);
