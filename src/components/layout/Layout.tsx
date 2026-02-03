import { Outlet } from "react-router-dom";
import Gnb from "../gnb/Gnb";

export default function Layout() {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <Gnb />
        <main className="bg-brand-primary flex-1">
          {/* 각 페이지 랜더링 */}
          <Outlet />
        </main>
      </div>
    </>
  );
}
