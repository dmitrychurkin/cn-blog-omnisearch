import React from "react";

export interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    readonly startIcon?: JSX.Element;
    readonly onClear: () => void;
}
