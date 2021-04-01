import React, { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
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

    const checkIn = useMemo(() => {
        if (!startDate) {
            return 'Check-in';
        }
        if (startDate.isSame(endDate, 'month')) {
            return startDate.format('DD');
        }
        return startDate.format('DD MMM');
    }, [startDate, endDate]);

    const checkOut = useMemo(() => {
        if (!endDate) {
            return 'Check-out';
        }
        return endDate.format('DD MMM');
    }, [endDate]);

    return (
        <div className={clsx('omnisearch-date-input', styles.root)}>
            {StartIcon}
            <div className={styles.dates}>
                {(!startDate && !endDate) ? (
                    <span onClick={onStartDateClick}>Add dates</span>
                ): (
                    <>
                        <span onClick={onStartDateClick}>{checkIn}</span>
                        <span onClick={onStartDateClick}>-</span>
                        <span onClick={onEndDateClick}>{checkOut}</span>
                    </>
    )
}
            </div >
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
        </div >
    );
};

export default memo(DateInput);
