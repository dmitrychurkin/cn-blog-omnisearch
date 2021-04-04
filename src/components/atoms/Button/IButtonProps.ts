import React from "react";
import { ButtonColorEnum } from "./ButtonColorEnum";
import { ButtonVariantEnum } from "./ButtonVariantEnum";

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariantEnum;
  readonly color?: ButtonColorEnum;
  readonly startIcon?: JSX.Element;
}
