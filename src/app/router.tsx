import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import User from "@/pages/User";
import { testRoutes } from "./testRoutes";
import Layout from "@/components/layout/Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/user", element: <User /> },
    ],
  },
  {
    path: "/user/:id",
    element: <User />,
  },

  ...testRoutes,
]);
