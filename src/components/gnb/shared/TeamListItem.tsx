import Chess from "@/assets/chess.svg";

interface TeamListItemProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export default function TeamListItem({
  name,
  isSelected,
  onClick,
  className,
}: TeamListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group text-lg-m hover:bg-brand-secondary flex h-[52px] w-full items-center gap-3 rounded-[12px] px-4 text-left ${isSelected ? "bg-brand-secondary text-brand-primary" : ""} ${className ?? ""}`}
    >
      <Chess
        className={`group-hover:text-brand-primary h-[20px] w-[20px] flex-shrink-0 ${isSelected ? "text-brand-primary" : "text-icon-gnb"}`}
      />
      <span
        className={`group-hover:text-brand-primary group-hover:text-lg-sb text-lg-r line-clamp-2 ${isSelected ? "text-lg-sb text-brand-primary" : "text-color-primary"}`}
      >
        {name}
      </span>
    </button>
  );
}
