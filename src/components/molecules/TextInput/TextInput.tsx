import React, { memo, useCallback, useRef, useState } from "react";
import clsx from "clsx";

import { ButtonVariantEnum } from "components/atoms/Button/ButtonVariantEnum";
import Button from "components/atoms/Button";

import { ITextInputProps } from "./ITextInputProps";

import { ReactComponent as CloseIcon } from "icons/Close.svg";

import styles from "./TextInput.module.css";

const TextInput: React.FC<ITextInputProps> = ({
  startIcon: StartIcon,
  onFocus,
  onBlur,
  onChange,
  onClear,
  value,
  ...restInputProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocus, setFocusState] = useState(false);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(e);
      setFocusState(true);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
      setFocusState(false);
    },
    [onBlur]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
    },
    [onChange]
  );

  const handleClear = useCallback(() => {
    onClear?.();
    inputRef.current?.focus();
  }, [onClear]);

  const isClearActive = Boolean(isFocus && value);

  return (
    <div
      className={clsx(
        "omnisearch-text-input",
        styles.root,
        isFocus && ["omnisearch-text-input--focus", styles.focus],
        StartIcon && [styles.withIcon, "omnisearch-text-input--with-icon"]
      )}
    >
      {StartIcon}
      <input
        {...restInputProps}
        ref={inputRef}
        className={clsx("omnisearch-text-input_input", styles.input, {
          "omnisearch-text-input_input--focus": isFocus,
          [styles.clearActive]: isClearActive,
        })}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
      />
      {isClearActive && (
        <Button
          className={clsx("omnisearch-text-input_clear-btn", styles.clear)}
          variant={ButtonVariantEnum.ICON}
          onMouseDown={handleClear}
          onTouchStart={handleClear}
        >
          <CloseIcon className={clsx("omnisearch-text-input_clear-btn_icon")} />
        </Button>
      )}
    </div>
  );
};

export default memo(TextInput);
