import { useState } from "react";
import NavLinks from "./NavLinks";
import Close from "@/assets/close.svg";
import Chess from "@/assets/chess.svg";
import { MOCK_GROUPS } from "@/components/gnb/mocks/groups";
import type { Group } from "@/types/group";

const ITEM_DELAY = 1000; // 각 항목 간 딜레이 (ms)

// 모바일 메뉴 아이템 타입 정의
type MobileMenuItem =
  | { type: "team"; data: Group }
  | { type: "addTeamButton" }
  | { type: "navLinks" };

// 전체 아이템 순서 정의 - 이 배열 순서가 애니메이션 순서
const mobileMenuItems: MobileMenuItem[] = [
  ...MOCK_GROUPS.map((group) => ({ type: "team" as const, data: group })),
  { type: "addTeamButton" as const },
  { type: "navLinks" as const },
];

// 특정 타입 아이템의 인덱스 찾기
const getItemIndex = (type: Exclude<MobileMenuItem["type"], "team">) =>
  mobileMenuItems.findIndex((item) => item.type === type);

export default function GnbMobileMenu({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // type: "team"만 찾음
  const teamItems = mobileMenuItems.filter(
    (item): item is Extract<MobileMenuItem, { type: "team" }> =>
      item.type === "team",
  );

  const getAnimationProps = (index: number) => {
    if (!isMobileMenuOpen) return {};

    return {
      className: "opacity-0 animate-[fadeDown_0.5s_ease-out_forwards]",
      style: { animationDelay: `${index * ITEM_DELAY}ms` },
    };
  };

  return (
    <div
      className={`bg-background-primary fixed top-0 z-50 w-full transition-all duration-300 ${
        isMobileMenuOpen
          ? "h-screen opacity-100"
          : "h-0 overflow-hidden opacity-50"
      }`}
    >
      <div className="relative px-[12px] py-[68px]">
        {/* 팀 목록 */}
        <div className="px-0 py-6">
          <ul className="min-w-0 space-y-2 overflow-hidden">
            {teamItems.map((item, index) => {
              const isSelected = selectedGroupId === item.data.id;
              const animationProps = getAnimationProps(index);

              return (
                <li
                  key={item.data.id}
                  className={animationProps.className}
                  style={animationProps.style}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedGroupId(item.data.id)}
                    className={`text-lg-m hover:bg-surface-tertiary flex h-[52px] w-full items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary text-brand-primary" : ""}`}
                  >
                    <Chess
                      className={`h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "" : "text-[#CBD5E1]"}`}
                    />
                    <span
                      className={`text-lg-r text-color-primary line-clamp-2 ${isSelected ? "text-lg-sb text-brand-primary" : ""}`}
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
            );
            return (
              <button
                type="button"
                className={animationProps.className}
                style={animationProps.style}
              >
                팀 추가하기
              </button>
            );
          })()}
        </div>

        {/* NavLinks */}
        <NavLinks
          isMobileMenuOpen={isMobileMenuOpen}
          animationDelay={getItemIndex("navLinks") * ITEM_DELAY}
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
