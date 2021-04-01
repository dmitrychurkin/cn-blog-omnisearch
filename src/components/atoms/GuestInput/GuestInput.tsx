import React, { memo } from 'react';

import styles from './GuestInput.module.css';

type Props = {
    readonly startIcon?: JSX.Element;
    guestCount: number;
};

const GuestInput: React.FC<Props> = ({ startIcon: StartIcon, guestCount }) => (
    <div className={styles.root}>
        {StartIcon}
        <div className={styles.guest}>
            {guestCount > 0
                ? `${guestCount} guest${guestCount > 1 ? 's' : ''}`
                : 'Add guests'}
        </div>
    </div>
);

export default memo(GuestInput);