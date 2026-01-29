import { useState } from "react";
import Chess from "@/assets/chess.svg";
import ArrowDown from "@/assets/arrow-down.svg";
import { MOCK_GROUPS } from "@/components/gnb/mocks/groups";

export default function TeamSelector({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  return (
    <div className={`px-4 py-6 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[36px] w-full items-center gap-3 px-4"
      >
        <Chess className="h-[20px] w-[20px] text-[#CBD5E1]" />
        <span className="text-lg-sb text-color-disabled flex-1 text-left">
          팀 선택
        </span>
        <ArrowDown
          className={`h-[20px] w-[20px] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`mt-2 grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <ul className="min-w-0 space-y-2 overflow-hidden">
          {MOCK_GROUPS.map((group) => {
            const isSelected = selectedGroupId === group.id;
            return (
              <li key={group.id}>
                <button
                  type="button"
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`text-lg-m hover:bg-surface-tertiary flex h-[52px] w-full items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary text-brand-primary" : ""}`}
                >
                  <Chess
                    className={`h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "" : "text-[#CBD5E1]"}`}
                  />
                  <span
                    className={`text-lg-r text-color-primary line-clamp-2 ${isSelected ? "text-lg-sb text-brand-primary" : ""}`}
                  >
                    {group.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <button type="button">팀 추가하기</button>
      </div>
    </div>
  );
}
