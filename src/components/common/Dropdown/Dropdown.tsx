import { useEffect, useRef, useState } from "react";
import ArrowDown from "@/assets/arrow-down.svg";
import User from "@/assets/user.svg";
import Kebab from "@/assets/kebab.svg";

type Option = { label: string; value: string };

const DEFAULT_LIST = {
  newest: [
    { label: "최신순", value: "최신순" },
    { label: "좋아요 많은순", value: "좋아요 많은순" },
  ],
  myHistory: [
    { label: "마이 히스토리", value: "마이 히스토리" },
    { label: "계정 설정", value: "계정 설정" },
    { label: "팀 참여", value: "팀 참여" },
    { label: "로그아웃", value: "로그아웃" },
  ],
  repeat: [
    { label: "한 번", value: "한 번" },
    { label: "매일", value: "매일" },
    { label: "주 반복", value: "주 반복" },
    { label: "월 반복", value: "월 반복" },
  ],
  edit: [
    { label: "수정하기", value: "수정하기" },
    { label: "삭제하기", value: "삭제하기" },
  ],
};

type OptionsKey = keyof typeof DEFAULT_LIST;

type DropdownProps = {
  optionsKey?: OptionsKey;
  options?: Option[];
  trigger?: "text" | "user" | "kebab";
  defaultLabel?: string;

  icon?: React.ReactNode;
  listAlign?: "left" | "center";
  keepSelected?: boolean;
  onSelect?: (item: Option) => void;

  showArrow?: boolean;
};

export default function Dropdown({
  optionsKey = "newest",
  options,
  trigger = "text",
  defaultLabel = "",
  icon,
  listAlign = "left",
  keepSelected = true,
  onSelect,
  showArrow = true,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const finalOptions = options ?? DEFAULT_LIST[optionsKey];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const listItemAlign =
    listAlign === "center" ? "justify-center text-center" : "justify-start";

  const handleSelect = (item: Option) => {
    if (keepSelected) setSelected(item);
    onSelect?.(item);
    setOpen(false);
  };

  const triggerIcon =
    icon ??
    (trigger === "kebab" ? <Kebab /> : trigger === "user" ? <User /> : null);

  return (
    <div ref={rootRef}>
      {trigger === "text" ? (
        <div className="relative flex items-center">
          {showArrow && (
            <ArrowDown
              onClick={() => setOpen((item) => !item)}
              className={`absolute right-[14px] cursor-pointer ${open ? "rotate-180" : "rotate-0"}`}
            />
          )}
          <div
            onClick={() => setOpen((item) => !item)}
            className="md:text-md-m text-xs-m text-color-default border-background-tertiary flex h-[40px] w-[120px] cursor-pointer items-center rounded-[12px] border-1 px-[14px] py-[10px] md:h-[44px] md:w-[130px]"
          >
            {selected ? selected.label : defaultLabel}
          </div>
        </div>
      ) : (
        <div
          className="cursor-pointer"
          onClick={() => setOpen((item) => !item)}
        >
          {triggerIcon}
        </div>
      )}

      {open && (
        <div>
          <ul className="border-background-tertiary bg-color-inverse absolute z-50 mt-[10px] rounded-[12px] border-1">
            {finalOptions.map((item) => (
              <li
                key={item.value}
                onClick={() => {
                  handleSelect(item);
                }}
                className={`md:text-md-m text-xs-m hover:bg-brand-primary/10 text-color-default flex h-[40px] w-[120px] cursor-pointer items-center px-[14px] md:h-[47px] md:w-[130px] ${listItemAlign}`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
