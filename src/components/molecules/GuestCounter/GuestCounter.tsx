import clsx from "clsx";
import React, { memo, useCallback } from "react";
import Button from "../../atoms/Button";
import { ButtonVariantEnum } from "../../atoms/Button/ButtonVariantEnum";
import { ReactComponent as MinusIcon } from "../../../icons/Minus.svg";
import { ReactComponent as PlusIcon } from "../../../icons/Plus.svg";
import styles from "./GuestCounter.module.css";
import { OperationTypeEnum } from "./OperationTypeEnum";

type Prop = {
  readonly value: number;
  readonly onChange: (op: OperationTypeEnum, value: number) => void;
  readonly minMax: [number, number];
};

const GuestCounter: React.FC<Prop> = ({
  onChange,
  value,
  minMax: [min, max],
}) => {
  const handleChange = useCallback(
    (op: OperationTypeEnum, value: number) => () => {
      onChange(op, value);
    },
    [onChange]
  );

  return (
    <div className={styles.root}>
      <Button
        className={clsx(
          "omnisearch-guest-counter-btn",
          "omnisearch-guest-counter-btn_decrement",
          styles.btn
        )}
        variant={ButtonVariantEnum.ICON}
        onClick={handleChange(OperationTypeEnum.DEC, value)}
        disabled={value <= min}
      >
        <MinusIcon />
      </Button>
      <div className={styles.value}>{value}</div>
      <Button
        className={clsx(
          "omnisearch-guest-counter-btn",
          "omnisearch-guest-counter-btn_increment",
          styles.btn
        )}
        variant={ButtonVariantEnum.ICON}
        onClick={handleChange(OperationTypeEnum.INC, value)}
        disabled={value >= max}
      >
        <PlusIcon />
      </Button>
    </div>
  );
};

export default memo(GuestCounter);
