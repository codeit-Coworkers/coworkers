import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import User from "@/pages/User";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { testRoutes } from "./testRoutes";
import Layout from "@/components/layout/Layout";
import { GlobalErrorFallback } from "@/providers/boundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/user/:id",
    element: <User />,
  },
  {
    path: "/index",
    element: <Index />,
  },

  ...testRoutes,

  {
    element: <Layout />,
    children: [{ path: "/user", element: <User /> }],
    errorElement: <GlobalErrorFallback />,
    children: [
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
        children: [{ path: "/user", element: <User /> }],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
