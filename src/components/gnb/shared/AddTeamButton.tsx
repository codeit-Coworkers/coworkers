import PlusIcon from "@/assets/plus.svg";

interface AddTeamButtonProps {
  onClick?: () => void;
  size?: "sm" | "md";
  className?: string;
  style?: React.CSSProperties;
}

export default function AddTeamButton({
  onClick,
  size = "sm",
  className,
  style,
}: AddTeamButtonProps) {
  const heightClass = size === "md" ? "h-[42px]" : "h-[33px]";

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`group text-md-sb text-brand-primary border-brand-primary hover:bg-brand-primary flex w-full items-center justify-center rounded-[8px] border hover:text-white ${heightClass} ${className ?? ""}`} //여기에 items-center없으면 boards 페이지에서 버튼 글씨가 중앙정렬이 안됨
        style={style}
      >
        <span className="flex items-center gap-1">
          <PlusIcon className="text-brand-primary h-4 w-4 group-hover:text-white" />
          팀 추가하기
        </span>
      </button>
    </>
  );
}
