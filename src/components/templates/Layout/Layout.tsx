import React, { memo } from 'react';

import styles from './Layout.module.css';

type Props = {
    readonly children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => (
    <div className={styles.root}>
        <div className={styles.wrapper}>{children}</div>
    </div>
);

export default memo(Layout);
