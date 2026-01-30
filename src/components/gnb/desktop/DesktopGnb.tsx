import { useState } from "react";
import DesktopUserArea from "./DesktopUserArea";
import DesktopHeaderMenus from "./DesktopHeaderMenus";
import FoldIcon from "@/assets/fold-true.svg";
import UnFoldIcon from "@/assets/fold-false.svg";
import GnbUserProfile from "../shared/GnbUserProfile";

export default function DesktopGnb() {
  const [isFolded, setIsFolded] = useState(false);

  const handleFoldToggle = () => setIsFolded(!isFolded);

  return (
    <header
      className={`relative flex h-screen shrink-0 flex-col border-r border-solid border-[#E2E8F0] transition-all duration-300 ${
        isFolded ? "w-[72px]" : "w-[270px]"
      }`}
    >
      <DesktopUserArea isFolded={isFolded} />
      <DesktopHeaderMenus isFolded={isFolded} />
      <div
        className={`mt-auto border-t border-[#E2E8F0] pb-6 ${
          isFolded ? "mx-0 px-[20px]" : "mx-4"
        }`}
      >
        <div className="mt-[20px]">
          <GnbUserProfile isFolded={isFolded} />
        </div>
      </div>

      <div
        className={`absolute ${
          isFolded ? "top-8 right-0 translate-x-1/2" : "top-[34px] right-[24px]"
        }`}
      >
        <button type="button" onClick={handleFoldToggle}>
          {isFolded ? (
            <div className="bg-background-primary flex h-8 w-8 items-center justify-center rounded-full border border-[#E2E8F0]">
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
