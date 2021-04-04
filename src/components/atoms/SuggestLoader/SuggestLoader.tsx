import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';

import styles from './SuggestLoder.module.css';

const SuggestLoader: React.FC = () => (
    <div className={styles.root}>
        <div className={styles.icon}>
            <Skeleton height={24} width={24} />
        </div>
        <div className={styles.text}>
            <Skeleton height={20} width='75%' />
            <Skeleton height={15} width='90%' />
        </div>
    </div>
);

export default memo(SuggestLoader);
