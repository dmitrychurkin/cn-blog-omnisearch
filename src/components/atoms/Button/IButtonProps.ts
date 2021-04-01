import React from "react";
import { ColorEnum, VariantEnum } from "./Button.enum";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    readonly variant?: VariantEnum;
    readonly color?: ColorEnum;
    readonly startIcon?: JSX.Element;
}