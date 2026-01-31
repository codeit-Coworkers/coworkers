"use client";

import { useState, ReactNode } from "react";
import Searchicon from "../../../assets/search.svg";
import PasswordVisibilityFalse from "../../../assets/password-visibility-false.svg";
import PasswordVisibilityTrue from "../../../assets/password-visibility-true.svg";

/* 1. Input Size Map */
export const inputSizeMap = {
  auth: { base: { height: 44 } },
  authWide: { base: { height: 44 } },
  search: { base: { height: 48 } },
  title: { base: { height: 44 } },
  content: { base: { height: 200 } },
} as const;

export type InputSize = keyof typeof inputSizeMap;

/* 2. Variant */
type InputVariant = "default" | "search";

const inputVariantClassMap: Record<InputVariant, string> = {
  default: `
    border-color-secondary
    bg-surface-secondary
    text-color-primary
  `,
  search: `
    border-brand-primary
    bg-surface-primary
  `,
};

/* 3. Props */
interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
  "size"
> {
  label?: string;
  size?: InputSize;
  variant?: InputVariant;
  withSearchIcon?: boolean;
  rightElement?: ReactNode;
}

/* 4. Component */
export const Input = ({
  label,
  size = "auth",
  variant = "default",
  type = "text",
  withSearchIcon = false,
  rightElement,
  className = "",
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const isContent = size === "content";

  const Tag = isContent ? "textarea" : "input";

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className="text-lg-m text-color-secondary truncate text-left">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {/* 검색 아이콘: z-index 추가 및 content일 때 위치 조정 */}
        {withSearchIcon && (
          <Searchicon
            className={`absolute left-3 z-10 h-4 w-4 ${
              isContent ? "top-4" : "top-1/2 -translate-y-1/2"
            }`}
          />
        )}

        <Tag
          {...props}
          type={
            !isContent
              ? isPassword && showPassword
                ? "text"
                : type
              : undefined
          }
          className={`w-full rounded-xl border px-3 ${inputVariantClassMap[variant]} ${
            withSearchIcon ? "pl-10" : ""
          } ${rightElement ? "pr-24" : "pr-3"} ${
            isContent ? "resize-none py-3" : ""
          } ${className} `}
          style={{
            height: inputSizeMap[size].base.height,
            verticalAlign: isContent ? "top" : "middle",
          }}
        />

        {/* 비밀번호 토글: z-index 추가 */}
        {isPassword && !rightElement && !isContent && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute top-1/2 right-3 z-10 -translate-y-1/2"
          >
            {showPassword ? (
              <PasswordVisibilityTrue className="h-4 w-4" />
            ) : (
              <PasswordVisibilityFalse className="h-4 w-4" />
            )}
          </button>
        )}

        {/* 커스텀 오른쪽 요소: z-index 추가 */}
        {rightElement && (
          <div className="absolute top-1/2 right-2 z-10 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};
