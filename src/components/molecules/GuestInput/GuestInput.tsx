import React, { memo } from "react";
import clsx from "clsx";

import { ButtonVariantEnum } from "components/atoms/Button/ButtonVariantEnum";
import Button from "components/atoms/Button";

import styles from "./GuestInput.module.css";

type Prop = {
  readonly guestCount: number;
  readonly startIcon?: JSX.Element;
  readonly onOpen: () => void;
  readonly isFocus: boolean;
};

const GuestInput: React.FC<Prop> = ({
  startIcon: StartIcon,
  guestCount,
  onOpen,
  isFocus,
}) => (
  <Button
    className={clsx(
      "omnisearch-guest-input",
      isFocus && ["omnisearch-guest-input--focus", styles.focus],
      guestCount > 0 && ["omnisearch-guest-input--active", styles.active],
      styles.root
    )}
    startIcon={StartIcon}
    onClick={onOpen}
    variant={ButtonVariantEnum.TEXT}
  >
    {guestCount > 0
      ? `${guestCount} guest${guestCount > 1 ? "s" : ""}`
      : "Add guests"}
  </Button>
);

export default memo(GuestInput);
