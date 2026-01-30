import BoardIcon from "@/assets/board.svg";

export default function NavLinks({
  isMobileMenuOpen,
  animationDelay = 0,
  isSelected = false,
  onSelect,
  isFolded = false,
  className,
}: {
  className?: string;
  isMobileMenuOpen?: boolean;
  animationDelay?: number;
  isSelected?: boolean;
  onSelect?: () => void;
  isFolded?: boolean;
}) {
  if (isFolded) {
    return (
      <div className="mt-2 flex justify-center">
        <button
          type="button"
          onClick={onSelect}
          className={`group hover:bg-brand-secondary flex h-[52px] w-[52px] items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary" : ""}`}
        >
          <BoardIcon
            className={`group-hover:text-brand-primary h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "text-brand-primary" : "text-[#CBD5E1]"}`}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`border-t border-[#E2E8F0] ${
        isMobileMenuOpen
          ? "mx-0 animate-[fadeDown_0.5s_ease-out_forwards] opacity-0"
          : "mx-4"
      } ${className}`}
      style={isMobileMenuOpen ? { animationDelay: `${animationDelay}ms` } : {}}
    >
      <div className="mt-[12px]">
        <button
          type="button"
          onClick={onSelect}
          className={`group text-lg-m hover:bg-brand-secondary flex h-[52px] w-full items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary" : ""}`}
        >
          <BoardIcon
            className={`group-hover:text-brand-primary h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "text-brand-primary" : "text-[#CBD5E1]"}`}
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
