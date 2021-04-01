import React, { memo } from 'react';
import clsx from 'clsx';
import { ITextInputProps } from './ITextInputProps';

import styles from './TextInput.module.css';

const TextInput: React.FC<ITextInputProps> = ({ startIcon: StartIcon, ...restInputProps }) => (
    <div className={clsx(styles.root, StartIcon && styles.withIcon)}>
        {StartIcon}
        <input className={styles.input} {...restInputProps} />
    </div>
);

export default memo(TextInput);
