import React, { memo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import DateInput from '../../components/molecules/DateInput';
import { DateInputFocusPayloadType } from '../../components/molecules/DateInput/DateInputFocusPayloadType';
import { IDateInputPayload } from '../../components/molecules/DateInput/IDateInputPayload';
import { ReactComponent as CalendarIcon } from '../../icons/Dates.svg';
import { dates, focus } from './dateSlice';

const Date: React.FC = () => {
    const dispatch = useAppDispatch();
    const { checkIn, checkOut, currentFocus } = useAppSelector(state => state.date);

    const onDatesChange = useCallback((datePayload: IDateInputPayload) => {
        dispatch(dates(datePayload));
    }, [dispatch]);

    const onFocusChange = useCallback((focusedInput: DateInputFocusPayloadType) => {
        dispatch(focus(focusedInput));
    }, [dispatch]);

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
