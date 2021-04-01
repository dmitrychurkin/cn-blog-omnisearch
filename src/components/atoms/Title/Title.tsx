import React, { memo } from 'react';

import styles from './Title.module.css';

type Props = {
    readonly children: React.ReactNode;
};

const Title: React.FC<Props> = ({ children }) => (
    <div className={styles.root}>{children}</div>
);

export default memo(Title);
