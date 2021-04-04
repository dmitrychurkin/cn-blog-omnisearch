import React, { memo, useCallback } from 'react';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import GuestInput from '../../components/molecules/GuestInput';
import GuestSelector from '../../components/organisms/GuestSelector';
import { ReactComponent as GuestIcon } from '../../icons/Person-outlined.svg';
import { change, focus } from './guestSlice';
import { IGuestBase } from './IGuestBase';

import styles from './Guest.module.css';

const Guest: React.FC = () => {
    const dispatch = useAppDispatch();
    const {
        adult,
        child,
        infant,
        isFocus
    } = useAppSelector(state => state.guest);

    const onChange = useCallback(({ adult, child, infant }: IGuestBase) => {
        dispatch(change({ adult, child, infant }));
    }, [dispatch]);

    const onToggleFocus = useCallback(() => {
        dispatch(focus());
    }, [dispatch]);

    return (
        <div
            className={clsx(
                'omnisearch-guest',
                styles.root
            )}
        >
            <GuestInput
                startIcon={<GuestIcon />}
                guestCount={adult + child + infant}
                onOpen={onToggleFocus}
                isFocus={isFocus}
            />
            <GuestSelector
                {...{ adult, child, infant }}
                isOpen={isFocus}
                onChange={onChange}
                onClose={onToggleFocus}
                appElement={document.getElementById('omnisearch')}
            />
        </div>
    );
};

export default memo(Guest);
