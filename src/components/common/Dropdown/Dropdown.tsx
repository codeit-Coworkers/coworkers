import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowDown from "@/assets/arrow-down.svg";
import User from "@/assets/user.svg";
import Kebab from "@/assets/kebab.svg";
import Set from "@/assets/set.svg";

export type Option = {
  label: string;
  value: string;
  link?: string;
  action?: () => void;
};

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
    { label: "반복 안함", value: "반복 안함" },
  ],
  edit: [
    { label: "수정하기", value: "수정하기" },
    { label: "삭제하기", value: "삭제하기" },
  ],
  myList: [
    { label: "마이 히스토리", value: "마이 히스토리" },
    { label: "로그아웃", value: "로그아웃" },
  ],
};

type OptionsKey = keyof typeof DEFAULT_LIST;

type DropdownProps = {
  optionsKey?: OptionsKey;
  options?: Option[];
  trigger?: "text" | "user" | "kebab" | "set";
  defaultLabel?: string;
  icon?: React.ReactNode;
  listAlign?: "left" | "center";
  keepSelected?: boolean;
  onSelect?: (item: Option) => void;
  showArrow?: boolean;
  listClassName?: string;
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
  listClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const finalOptions = options ?? DEFAULT_LIST[optionsKey];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // rootRef 영역 밖을 클릭했을 때만 닫기
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside); // click보다 mousedown이 더 정확하게 반응할 때가 많습니다.
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const listItemAlign =
    listAlign === "center" ? "justify-center text-center" : "justify-start";

  const handleSelect = (item: Option) => {
    if (keepSelected) setSelected(item);
    onSelect?.(item);

    if (item.action) {
      item.action();
    } else if (item.link) {
      navigate(item.link);
    }
    setOpen(false);
  };

  const triggerIcon =
    icon ??
    (trigger === "kebab" ? (
      <Kebab />
    ) : trigger === "user" ? (
      <User />
    ) : trigger === "set" ? (
      <Set />
    ) : null);

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      {trigger === "text" ? (
        <div
          className="relative flex items-center"
          onClick={(e) => {
            e.stopPropagation(); // 👈 부모 모달이나 document로 클릭 전파 방지
            setOpen((prev) => !prev);
          }}
        >
          {showArrow && (
            <ArrowDown
              className={`absolute right-[14px] cursor-pointer transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
            />
          )}
          <div className="md:text-md-m text-xs-m text-color-default border-background-tertiary active:bg-background-tertiary hover:bg-background-tertiary flex h-[40px] w-[120px] cursor-pointer items-center rounded-[12px] border-1 px-[14px] py-[10px] md:h-[44px] md:w-[130px]">
            {selected ? selected.label : defaultLabel}
          </div>
        </div>
      ) : (
        <div
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // 👈 부모 모달이나 document로 클릭 전파 방지
            setOpen((prev) => !prev);
          }}
        >
          {triggerIcon}
        </div>
      )}

      {open && (
        <div
          className="absolute z-50 mt-[10px]"
          onClick={(e) => e.stopPropagation()}
        >
          <ul
            className={`border-background-tertiary bg-color-inverse rounded-[12px] border-1 shadow-lg ${listClassName}`}
          >
            {finalOptions.map((item) => (
              <li
                key={item.value}
                onClick={() => handleSelect(item)}
                className={`md:text-md-m text-xs-m text-color-default hover:bg-background-secondary flex h-[40px] w-[120px] cursor-pointer items-center px-[14px] first:rounded-t-[12px] last:rounded-b-[12px] md:h-[47px] md:w-[130px] ${listItemAlign}`}
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
