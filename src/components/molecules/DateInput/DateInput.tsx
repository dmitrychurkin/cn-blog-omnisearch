import React, { memo, useCallback, useContext, useMemo } from "react";
import clsx from "clsx";
import moment, { Moment } from "moment";

import { DateRangePicker, FocusedInputShape } from "react-dates";

import Button from "components/atoms/Button";
import { ButtonVariantEnum } from "components/atoms/Button/ButtonVariantEnum";

import { GlobalCtx, ViewportTypeEnum } from "context/Global";

import { DateInputEnum } from "app/enum/DateInputEnum";

import { IDateInputPayload } from "app/interface/IDateInputPayload";

import { DateInputFocusPayloadType } from "app/type/DateInputFocusPayloadType";

import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "./DateInput.css";

import styles from "./DateInput.module.css";

type Prop = {
  readonly startIcon?: JSX.Element;
  readonly onDatesChange: (arg: IDateInputPayload) => void;
  readonly onFocusChange: (arg: DateInputFocusPayloadType) => void;
  readonly focusedInput: FocusedInputShape | null;
  readonly startDate: Moment | null;
  readonly endDate: Moment | null;
};

const DateInput: React.FC<Prop> = ({
  startIcon: StartIcon,
  startDate,
  endDate,
  onDatesChange,
  focusedInput,
  onFocusChange,
}) => {
  const global = useContext(GlobalCtx);

  const onStartDateClick = useCallback(() => {
    onFocusChange(DateInputEnum.START);
  }, [onFocusChange]);

  const onEndDateClick = useCallback(() => {
    onFocusChange(DateInputEnum.END);
  }, [onFocusChange]);

  const onClose = useCallback(
    ({ startDate, endDate }: IDateInputPayload) => {
      if (startDate && !endDate) {
        onDatesChange({ startDate, endDate: moment(startDate).add(1, "day") });
      } else if (!startDate && endDate) {
        onDatesChange({
          startDate: moment(endDate).subtract(1, "day"),
          endDate,
        });
      }
    },
    [onDatesChange]
  );

  const checkIn = useMemo(() => {
    if (!startDate) {
      return "";
    }
    if (startDate.isSame(endDate, "month")) {
      return startDate.format("DD");
    }
    return startDate.format("DD MMM");
  }, [startDate, endDate]);

  const checkOut = useMemo(() => {
    if (!endDate) {
      return "";
    }
    return endDate.format("DD MMM");
  }, [endDate]);

  return (
    <>
      <Button
        className={clsx(
          "omnisearch-date-input",
          focusedInput !== null && [
            "omnisearch-date-input--focus",
            styles.focus,
          ],
          Boolean(startDate || endDate) && [
            "omnisearch-date-input--active",
            styles.active,
          ],
          styles.root
        )}
        startIcon={StartIcon}
        onClick={onStartDateClick}
        variant={ButtonVariantEnum.TEXT}
      >
        <div className={styles.dates}>
          {!startDate && !endDate ? (
            "Add dates"
          ) : (
            <>
              <span onClick={onStartDateClick}>{checkIn}</span>
              <span onClick={onStartDateClick}>&nbsp;-&nbsp;</span>
              <span onClick={onEndDateClick}>{checkOut}</span>
            </>
          )}
        </div>
      </Button>
      <DateRangePicker
        startDateId={DateInputEnum.START}
        endDateId={DateInputEnum.END}
        startDate={startDate}
        endDate={endDate}
        onDatesChange={onDatesChange}
        focusedInput={focusedInput}
        onFocusChange={onFocusChange}
        onClose={onClose}
        minDate={moment().startOf("d")}
        hideKeyboardShortcutsPanel
        small
        noBorder
        {...(global?.viewportType === ViewportTypeEnum.MOBILE
          ? {
              orientation: "vertical",
              withFullScreenPortal: true,
            }
          : {
              verticalSpacing: 27,
            })}
      />
    </>
  );
};

export default memo(DateInput);
