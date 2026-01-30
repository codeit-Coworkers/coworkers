import { useState } from "react";
import GnbFooter from "./GnbFooter";
import NavLinks from "./NavLinks";
import TeamSelector from "./TeamSelector";
import UserArea from "./UserArea";
import FoldIcon from "@/assets/fold-true.svg";
import UnFoldIcon from "@/assets/fold-false.svg";

export default function Gnb() {
  // TODO: 나중에 전역 상태/Context로 교체
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 사이드바 접힙/펼치기
  const [isFolded, setIsFolded] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | "board" | null>(
    null,
  );

  const handleFoldToggle = () => setIsFolded(!isFolded);

  return (
    <div>
      <header
        className={`relative w-full border-r border-solid border-[#E2E8F0] transition-all duration-300 md:flex md:h-screen md:shrink-0 md:flex-col ${
          isFolded ? "md:w-[72px]" : "md:w-[270px]"
        }`}
      >
        {/* <GnbHeader /> */}
        <div>
          <UserArea onMenuOpen={setIsMobileMenuOpen} isFolded={isFolded} />
        </div>
        <div>
          <TeamSelector
            onSelectItem={setSelectedItem}
            isFolded={isFolded}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <NavLinks
            className="hidden md:block"
            isSelected={selectedItem === "board"}
            onSelect={() => setSelectedItem("board")}
            isFolded={isFolded}
          />
        </div>
        <div
          className={`mt-auto hidden border-t border-[#E2E8F0] pb-6 md:block ${isFolded ? "mx-0 px-[20px]" : "mx-4"}`}
        >
          <GnbFooter className="mt-[20px]" isFolded={isFolded} />
        </div>

        <div
          className={`absolute hidden md:block ${isFolded ? "top-8 right-0 translate-x-1/2" : "top-[34px] right-[24px]"}`}
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
    </div>
  );
}
