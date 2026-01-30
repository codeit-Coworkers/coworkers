import { useState } from "react";
import NavLinks from "./NavLinks";
import Close from "@/assets/close.svg";
import Chess from "@/assets/chess.svg";
import PlusIcon from "@/assets/plus.svg";
import {
  ITEM_DELAY,
  mobileMenuItems,
  getItemIndex,
  getAnimationProps,
  type MobileMenuItem,
} from "./utils/menuSlideDown";

export default function GnbMobileMenu({
  className,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  className?: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}) {
  const [selectedItem, setSelectedItem] = useState<number | "board" | null>(
    null,
  );

  // type: "team"만 찾음
  const teamItems = mobileMenuItems.filter(
    (item): item is Extract<MobileMenuItem, { type: "team" }> =>
      item.type === "team",
  );

  return (
    <div
      className={`bg-background-primary fixed top-0 z-50 h-screen w-full transition-transform duration-300 ${
        isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
      } ${className}`}
    >
      <div className="relative px-[16px] py-[68px]">
        {/* 팀 목록 */}
        <div className="px-0 py-6">
          <ul className="mb-2 min-w-0 space-y-2 overflow-hidden">
            {teamItems.map((item, index) => {
              const isSelected = selectedItem === item.data.id;
              const animationProps = getAnimationProps(index, isMobileMenuOpen);

              return (
                <li
                  key={item.data.id}
                  className={animationProps.className}
                  style={animationProps.style}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedItem(item.data.id)}
                    className={`group text-lg-m hover:bg-brand-secondary flex h-[52px] w-full items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary text-brand-primary" : ""}`}
                  >
                    <Chess
                      className={`group-hover:text-brand-primary h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "text-brand-primary" : "text-[#CBD5E1]"}`}
                    />
                    <span
                      className={`group-hover:text-brand-primary group-hover:text-lg-sb text-lg-r line-clamp-2 ${isSelected ? "text-lg-sb text-brand-primary" : "text-color-primary"}`}
                    >
                      {item.data.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* 팀 추가하기 버튼 */}
          {(() => {
            const animationProps = getAnimationProps(
              getItemIndex("addTeamButton"),
              isMobileMenuOpen,
            );
            return (
              <div className="">
                <button
                  type="button"
                  className={`${animationProps.className} group text-md-sb text-brand-primary border-brand-primary hover:bg-brand-primary flex h-[42px] w-full justify-center rounded-[8px] border align-middle hover:text-white`}
                  style={animationProps.style}
                >
                  <span className="flex items-center gap-1">
                    <PlusIcon className="text-brand-primary h-4 w-4 group-hover:text-white" />
                    팀 추가하기
                  </span>
                </button>
              </div>
            );
          })()}
        </div>

        {/* NavLinks */}
        <NavLinks
          isMobileMenuOpen={isMobileMenuOpen}
          animationDelay={getItemIndex("navLinks") * ITEM_DELAY}
          isSelected={selectedItem === "board"}
          onSelect={() => setSelectedItem("board")}
        />

        <button
          type="button"
          className="absolute top-4 right-4"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Close />
        </button>
      </div>
    </div>
  );
}
