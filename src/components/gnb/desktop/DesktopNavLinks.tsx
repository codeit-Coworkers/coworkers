import BoardIcon from "@/assets/board.svg";
import { useGnbStore } from "../useGnbStore";

interface DesktopNavLinksProps {
  isSelected: boolean;
  onSelect: () => void;
}

export default function DesktopNavLinks({
  isSelected,
  onSelect,
}: DesktopNavLinksProps) {
  const isFolded = useGnbStore((state) => state.isFolded);
  if (isFolded) {
    return (
      <div className="mt-2 flex justify-center">
        <button
          type="button"
          onClick={onSelect}
          className={`group hover:bg-brand-secondary flex h-[52px] w-[52px] items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary" : ""}`}
        >
          <BoardIcon
            className={`group-hover:text-brand-primary h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "text-brand-primary" : "text-icon-gnb"}`}
          />
        </button>
      </div>
    );
  }

  return (
    <div className="border-border-primary mx-4 border-t">
      <div className="mt-[12px]">
        <button
          type="button"
          onClick={onSelect}
          className={`group text-lg-m hover:bg-brand-secondary flex h-[52px] w-full items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary" : ""}`}
        >
          <BoardIcon
            className={`group-hover:text-brand-primary h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "text-brand-primary" : "text-icon-gnb"}`}
          />
          <span
            className={`text-lg-r group-hover:text-brand-primary line-clamp-2 group-hover:font-semibold ${isSelected ? "text-brand-primary font-semibold" : "text-color-primary"}`}
          >
            자유게시판
          </span>
        </button>
      </div>
    </div>
  );
}
