import type { ReactNode } from "react";

export type ButtonType =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "outline";

export interface ButtonProps {
  label: string;
  variant?: ButtonType;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
}
