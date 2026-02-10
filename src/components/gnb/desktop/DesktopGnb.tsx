import DesktopUserArea from "./DesktopUserArea";
import DesktopHeaderMenus from "./DesktopHeaderMenus";
import FoldIcon from "@/assets/fold-true.svg";
import UnFoldIcon from "@/assets/fold-false.svg";
import GnbUserProfile from "../shared/GnbUserProfile";
import { useGnbStore } from "../useGnbStore";

export default function DesktopGnb() {
  const { isFolded, toggleFolded } = useGnbStore();

  return (
    <header
      className={`border-border-primary relative z-10 flex h-screen shrink-0 flex-col border-r border-solid shadow-[2px_0_8px_rgba(0,0,0,0.02)] transition-all duration-200 ${
        isFolded ? "w-[72px]" : "w-[270px]"
      }`}
    >
      <DesktopUserArea />
      <DesktopHeaderMenus />
      <div
        className={`border-border-primary mt-auto border-t pb-6 ${
          isFolded ? "mx-0 px-[20px]" : "mx-4"
        }`}
      >
        <div className="mt-[20px]">
          <GnbUserProfile />
        </div>
      </div>

      <div
        className={`absolute ${
          isFolded ? "top-8 right-0 translate-x-1/2" : "top-[34px] right-[24px]"
        }`}
      >
        <button type="button" onClick={toggleFolded}>
          {isFolded ? (
            <div className="bg-background-primary border-border-primary flex h-8 w-8 items-center justify-center rounded-full border shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
              <UnFoldIcon className="h-6 w-6" />
            </div>
          ) : (
            <FoldIcon />
          )}
        </button>
      </div>
    </header>
  );
}
