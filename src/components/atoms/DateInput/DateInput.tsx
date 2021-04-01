import React, { memo, useCallback } from 'react';
import type { Moment } from 'moment';
import { IDateInputPayload } from './IDateInputPayload';
import { IDateInputFocusPayload } from './IDateInputFocusPayload';
import { DateRangePicker, FocusedInputShape } from 'react-dates';
import { DateInputEnum } from './DateInput.enum';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './DateInput.css';

import styles from './DateInput.module.css';


type Props = {
    readonly startIcon?: JSX.Element;
    readonly onDatesChange: (arg: IDateInputPayload) => void;
    readonly onFocusChange: (arg: IDateInputFocusPayload) => void;
    focusedInput: FocusedInputShape | null;
    startDate: Moment | null;
    endDate: Moment | null;
};

const DateInput: React.FC<Props> = ({ startIcon: StartIcon, startDate, endDate, onDatesChange, focusedInput, onFocusChange }) => {
    const onStartDateClick = useCallback(() => {
        onFocusChange(DateInputEnum.START);
    }, [onFocusChange]);

    const onEndDateClick = useCallback(() => {
        onFocusChange(DateInputEnum.END);
    }, [onFocusChange]);

    return (
        <div className={styles.root}>
            {StartIcon}
            <div className={styles.dates}>
                <span onClick={onStartDateClick}>Start Date</span>
                <span onClick={onStartDateClick}>-</span>
                <span onClick={onEndDateClick}>End Date</span>
            </div>
            <div className={styles.calendar}>
                <DateRangePicker
                    startDateId={DateInputEnum.START}
                    endDateId={DateInputEnum.END}
                    startDate={startDate}
                    endDate={endDate}
                    onDatesChange={onDatesChange}
                    focusedInput={focusedInput}
                    onFocusChange={onFocusChange}
                    orientation="vertical"
                    withFullScreenPortal
                    small
                />
            </div>
        </div>
    );
};

export default memo(DateInput);
