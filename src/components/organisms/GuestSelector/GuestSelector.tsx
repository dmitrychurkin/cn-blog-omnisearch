import clsx from "clsx";
import React, { memo, useCallback, useContext, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import { GlobalCtx, ViewportTypeEnum } from "../../../context/Global";
import { IGuestBase } from "../../../features/guest/IGuestBase";
import { ReactComponent as CarretIcon } from "../../../icons/Carret.svg";
import Button from "../../atoms/Button";
import { ButtonVariantEnum } from "../../atoms/Button/ButtonVariantEnum";
import GuestCounter from "../../molecules/GuestCounter";
import { OperationTypeEnum } from "../../molecules/GuestCounter/OperationTypeEnum";
import { GuestTypeEnum } from "./GuestTypeEnum";
import useGuestSelect from "./useGuestSelect";

import "./GuestSelector.css";
import styles from "./GuestSelector.module.css";

type Prop = {
  readonly isOpen: boolean;
  readonly appElement: HTMLElement | null;
  readonly onChange: (guestSelectorState: IGuestBase) => void;
  readonly onClose: () => void;
  readonly adult: number;
  readonly child: number;
  readonly infant: number;
};

const GuestSelector: React.FC<Prop> = ({
  isOpen,
  onChange,
  onClose,
  appElement,
  adult,
  child,
  infant,
}) => {
  const guestSelectorState = {
    adult: adult || 1,
    child,
    infant,
  };

  const guestSelectorStateRef = useRef<IGuestBase>(guestSelectorState);
  const isOpenRef = useRef<boolean>(false);

  const global = useContext(GlobalCtx);

  const [guestState, handleChange, constraint] = useGuestSelect(
    guestSelectorState
  );

  const onCountChange = useCallback(
    (guestType: GuestTypeEnum) => (op: OperationTypeEnum, count: number) => {
      handleChange(guestType, op, count);
    },
    [handleChange]
  );

  const onClick = useCallback(() => {
    onChange(guestSelectorStateRef.current);
    onClose();
  }, [onChange, onClose]);

  useEffect(() => {
    guestSelectorStateRef.current = {
      ...guestState,
    };
  }, [guestState]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = ({ target }: Event) => {
      if (
        global &&
        global.viewportType !== ViewportTypeEnum.MOBILE &&
        isOpenRef.current &&
        !(target as HTMLElement).closest(".js-popover")
      ) {
        onClose();
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [onClose, global]);

  const Component = (
    <>
      <div className={styles.wrapper}>
        <div className={styles.track}>
          <div>
            <div className={styles.title}>Adults</div>
          </div>
          <GuestCounter
            onChange={onCountChange(GuestTypeEnum.ADULT)}
            value={guestState.adult}
            minMax={constraint.get(GuestTypeEnum.ADULT)!}
          />
        </div>
        <div className={styles.track}>
          <div>
            <div className={styles.title}>Children</div>
            <div className={styles.sub}>Ages 2-12</div>
          </div>
          <GuestCounter
            onChange={onCountChange(GuestTypeEnum.CHILD)}
            value={guestState.child}
            minMax={constraint.get(GuestTypeEnum.CHILD)!}
          />
        </div>
        <div className={styles.track}>
          <div>
            <div className={styles.title}>Infants</div>
            <div className={styles.sub}>Under age 2</div>
          </div>
          <GuestCounter
            onChange={onCountChange(GuestTypeEnum.INFANT)}
            value={guestState.infant}
            minMax={constraint.get(GuestTypeEnum.INFANT)!}
          />
        </div>
      </div>
      <div className={styles.actionBar}>
        <Button className={styles.btn} onClick={onClick}>
          Apply
        </Button>
      </div>
    </>
  );

  if (global?.viewportType === ViewportTypeEnum.MOBILE) {
    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Guest selector modal"
        overlayClassName={styles.overlay}
        className={styles.root}
        appElement={appElement ?? undefined}
        ariaHideApp={Boolean(appElement)}
        closeTimeoutMS={300}
      >
        <header className={styles.header}>
          <Button
            className={clsx("omnisearch-guest-select_close-btn", styles.close)}
            variant={ButtonVariantEnum.ICON}
            onClick={onClose}
          >
            <CarretIcon />
          </Button>
          Number of guests
        </header>
        {Component}
      </ReactModal>
    );
  }

  return isOpen ? (
    <div
      className={clsx("js-popover", "omnisearch-popover", styles.popoverRoot)}
    >
      {Component}
    </div>
  ) : null;
};

export default memo(GuestSelector);
