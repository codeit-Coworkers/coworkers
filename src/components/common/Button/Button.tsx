import React, { ReactNode } from "react";

type ButtonVariant = "default" | "outline_blue" | "danger" | "close";

/* 버튼 사이즈 맵 */
export const buttonSizeMap = {
  landing: { width: 160, height: 48, fontSize: "lg-m", radius: 12 },

  authWide: { width: 300, height: 48, fontSize: "lg-m", radius: 12 },

  teamMedium: { width: 186, height: 48, fontSize: "lg-m", radius: 12 },

  teamAdd: { width: 172, height: 33, fontSize: "md-m", radius: 8 },

  todoAdd: { width: 112, height: 40, fontSize: "md-m", radius: 40 },

  todoAction: { width: 132, height: 40, fontSize: "md-m", radius: 40 },

  smallAction: { width: 73, height: 33, fontSize: "md-m", radius: 8 },

  todoCreate: { width: 336, height: 48, fontSize: "lg-m", radius: 12 },

  normal: { width: 136, height: 48, fontSize: "lg-m", radius: 12 },

  wide: { width: 280, height: 48, fontSize: "lg-m", radius: 12 },

  save: { width: 141, height: 33, fontSize: "md-m", radius: 8 },

  post: { width: 300, height: 48, fontSize: "lg-m", radius: 12 },
} as const;

export type ButtonSize = keyof typeof buttonSizeMap;

/* 버튼 스타일 */
const variantClassMap: Record<ButtonVariant, string> = {
  default: `
    bg-brand-primary
    text-color-inverse
    hover:bg-interaction-hover
    active:bg-interaction-pressed
  `,

  outline_blue: `
    border
    border-brand-primary
    text-brand-primary
    bg-surface-primary
    hover:bg-brand-primary/10
  `,

  danger: `
    bg-status-danger
    text-color-inverse
    hover:bg-status-danger/90
  `,

  close: `
    border
    border-color-secondary
    text-color-default
    bg-surface-primary
    hover:bg-background-secondary
    active:bg-background-tertiary
  `,
};

/* Props */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: ReactNode;
}

/* 버튼 컴포넌트 */
export const Button = ({
  size = "normal",
  variant = "default",
  icon,
  children,
  className = "",
  ...props
}: ButtonProps) => {
  const s = buttonSizeMap[size];

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 transition-colors ${variantClassMap[variant]} ${className} `}
      style={{
        width: s.width,
        height: s.height,
        borderRadius: s.radius,
      }}
    >
      {/* 아이콘 */}
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </button>
  );
};
