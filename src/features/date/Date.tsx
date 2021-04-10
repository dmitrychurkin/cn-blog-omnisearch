import React, { memo, useCallback } from "react";

import useAppDispatch from "app/hook/useAppDispatch";
import useAppSelector from "app/hook/useAppSelector";

import DateInput from "components/molecules/DateInput";
import { DateInputFocusPayloadType } from "app/type/DateInputFocusPayloadType";

import { IDateInputPayload } from "app/interface/IDateInputPayload";

import { dates, focus } from "./dateSlice";

import { ReactComponent as CalendarIcon } from "icons/Dates.svg";

const Date: React.FC = () => {
  const dispatch = useAppDispatch();
  const { checkIn, checkOut, currentFocus } = useAppSelector(
    (state) => state.date
  );

  const onDatesChange = useCallback(
    (datePayload: IDateInputPayload) => {
      dispatch(dates(datePayload));
    },
    [dispatch]
  );

  const onFocusChange = useCallback(
    (focusedInput: DateInputFocusPayloadType) => {
      dispatch(focus(focusedInput));
    },
    [dispatch]
  );

  return (
    <DateInput
      startIcon={<CalendarIcon />}
      startDate={checkIn}
      endDate={checkOut}
      focusedInput={currentFocus}
      onDatesChange={onDatesChange}
      onFocusChange={onFocusChange}
    />
  );
};

export default memo(Date);
