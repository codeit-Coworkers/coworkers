import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import User from "@/pages/User";
import Index from "@/pages/Index";
import { testRoutes } from "./testRoutes";

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
]);
