import { createBrowserRouter } from "react-router-dom";
import Boards from "@/pages/Boards";
import BoardDetail from "@/pages/BoardDetail";
import BoardWrite from "@/pages/BoardWrite";
import NotFound from "@/pages/NotFound";
import { testRoutes } from "./testRoutes";
import Layout from "@/components/layout/Layout";
import { GlobalErrorFallback } from "@/providers/boundary";
import Index from "@/pages/Index";
import LoginPage from "@/pages/Login";
import ResetPasswordPage from "@/pages/ResetPassword";
import RootLayout from "@/components/common/Rootlayout/RootLayout";
import KakaoRedirectPage from "@/pages/KakaoRedirectPage";
import Team from "@/pages/team";
import MyHistory from "@/pages/MyHistory";
import JoinTeam from "@/pages/JoinTeam";
import AddTeam from "@/pages/AddTeam";
import EditTeam from "@/pages/EditTeam";
import MySettings from "@/pages/MySettings";
import ListPage from "@/pages/ListPage/ListPage";
import SignupPage from "@/pages/Signup";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <GlobalErrorFallback />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      ...(import.meta.env.DEV ? testRoutes : []),
      {
        element: <Layout />,
        children: [
          {
            path: "login",
            children: [
              { index: true, element: <LoginPage /> },
              { path: "kakao", element: <KakaoRedirectPage /> },
            ],
          },
          { path: "reset-password", element: <ResetPasswordPage /> },
          { path: "signup", element: <SignupPage /> },
          {
            path: "team",
            children: [
              { index: true, element: <Team /> },
              { path: ":id", element: <Team /> },
              { path: ":id/edit", element: <EditTeam /> },
              { path: ":id/my-history", element: <MyHistory /> },
              { path: "join", element: <JoinTeam /> },
              { path: "add", element: <AddTeam /> },
            ],
          },
          {
            path: "boards",
            children: [
              { index: true, element: <Boards /> },
              { path: "write", element: <BoardWrite /> },
              { path: ":articleId", element: <BoardDetail /> },
            ],
          },
          { path: "my-settings", element: <MySettings /> },
          { path: "list", element: <ListPage /> },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
