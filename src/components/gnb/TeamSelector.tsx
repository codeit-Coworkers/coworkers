import { useState } from "react";
import PlusIcon from "@/assets/plus.svg";
import Chess from "@/assets/chess.svg";
import ArrowDown from "@/assets/arrow-down.svg";
import { MOCK_GROUPS } from "@/components/gnb/mocks/groups";
import Close from "@/assets/close.svg";
import { useIsMobile } from "@/hooks/useMediaQuery";

import {
  ITEM_DELAY,
  mobileMenuItems,
  getItemIndex,
  getAnimationProps,
  type MobileMenuItem,
} from "./utils/menuSlideDown";
import NavLinks from "./NavLinks";

export default function TeamSelector({
  className,
  onSelectItem,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isFolded = false,
}: {
  className?: string;
  onSelectItem?: (item: number | "board" | null) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  isFolded?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const [selectedItem, setSelectedItem] = useState<number | "board" | null>(
    null,
  );

  const isTeamSelected = typeof selectedItem === "number";

  const isMobile = useIsMobile();

  // 모바일 일 때
  if (isMobile) {
    // type: "team"만 찾음
    const teamItems = mobileMenuItems.filter(
      (item): item is Extract<MobileMenuItem, { type: "team" }> =>
        item.type === "team",
    );

    return (
      <>
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
                  const animationProps = getAnimationProps(
                    index,
                    isMobileMenuOpen,
                  );

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
      </>
    );
  }

  // 접혔을 때
  if (isFolded) {
    const firstGroupId = MOCK_GROUPS[0]?.id;
    return (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => onSelectItem?.(firstGroupId)}
          className={`group hover:bg-brand-secondary flex h-[52px] w-[52px] items-center justify-center rounded-[12px] ${isTeamSelected ? "bg-brand-secondary" : ""}`}
        >
          <Chess
            className={`group-hover:text-brand-primary h-[24px] w-[24px] ${isTeamSelected ? "text-brand-primary" : "text-[#CBD5E1]"}`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className={`px-4 py-6 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group hover:bg-brand-secondary flex h-[36px] w-full items-center gap-3 px-4"
      >
        <Chess
          className={`group-hover:text-brand-primary h-[20px] w-[20px] text-[#CBD5E1] ${isOpen ? "text-brand-primary" : "text-[#CBD5E1]"}`}
        />
        <span
          className={`text-lg-sb group-hover:text-brand-primary flex-1 text-left ${isOpen ? "text-brand-primary" : "text-color-disabled"}`}
        >
          팀 선택
        </span>
        <ArrowDown
          className={`h-[20px] w-[20px] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`mt-2 grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <ul className="mb-2 min-w-0 space-y-2 overflow-hidden">
          {MOCK_GROUPS.map((group) => {
            const isSelected = selectedItem === group.id;
            return (
              <li key={group.id}>
                <button
                  type="button"
                  onClick={() => onSelectItem?.(group.id)}
                  className={`group text-lg-m hover:bg-brand-secondary flex h-[52px] w-full items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary text-brand-primary" : ""}`}
                >
                  <Chess
                    className={`group-hover:text-brand-primary h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "text-brand-primary" : "text-[#CBD5E1]"}`}
                  />
                  <span
                    className={`text-lg-r group-hover:text-brand-primary group-hover:text-lg-sb line-clamp-2 ${isSelected ? "text-lg-sb text-brand-primary" : "text-color-primary"}`}
                  >
                    {group.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className="group text-md-sb text-brand-primary border-brand-primary hover:bg-brand-primary flex h-[33px] w-full justify-center rounded-[8px] border align-middle hover:text-white"
        >
          <span className="flex items-center gap-1">
            <PlusIcon className="text-brand-primary h-4 w-4 group-hover:text-white" />
            팀 추가하기
          </span>
        </button>
      </div>
    </div>
  );
}
