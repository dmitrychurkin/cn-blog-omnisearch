import React, { memo } from 'react';

import styles from './Title.module.css';

type Prop = {
    readonly children: React.ReactNode;
};

const Title: React.FC<Prop> = ({ children }) => (
    <div className={styles.root}>{children}</div>
);

export default memo(Title);
