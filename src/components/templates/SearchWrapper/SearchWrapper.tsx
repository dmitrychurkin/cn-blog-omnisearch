import React, { memo } from 'react';

import styles from './SearchWrapper.module.css';

type Props = {
    readonly children: React.ReactNode;
};

const SearchWrapper: React.FC<Props> = ({ children }) => (
    <div className={styles.root}>
        {children}
    </div>
);

export default memo(SearchWrapper);
