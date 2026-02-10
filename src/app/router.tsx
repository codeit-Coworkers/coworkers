import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import User from "@/pages/User";
import Boards from "@/pages/Boards";
import BoardDetail from "@/pages/BoardDetail";
import BoardWrite from "@/pages/BoardWrite";
import NotFound from "@/pages/NotFound";
import { testRoutes } from "./testRoutes";
import Layout from "@/components/layout/Layout";
import { GlobalErrorFallback } from "@/providers/boundary";
import Team from "@/pages/team";
import MyHistory from "@/pages/MyHistory";

export const router = createBrowserRouter([
  {
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
        children: [
          { path: "/user", element: <User /> },
          { path: "/team", element: <Team /> },
          { path: "/team/:id", element: <Team /> },
          { path: "/boards", element: <Boards /> },
          { path: "/boards/write", element: <BoardWrite /> },
          { path: "/boards/:articleId", element: <BoardDetail /> },
          { path: "/my-history", element: <MyHistory /> },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
