import React, { memo } from 'react';
import clsx from 'clsx';
import { IButtonProps } from './IButtonProps';

import styles from './Button.module.css';
import { ColorEnum, VariantEnum } from './Button.enum';

const Button: React.FC<IButtonProps> = ({
    className,
    variant,
    color,
    startIcon: StartIcon,
    children,
    ...rest
}) => (
    <button
        {...rest}
        className={clsx(
            'omnisearch-button',
            className,
            styles.root,
            styles[variant ?? VariantEnum.CONTAINED],
            styles[color ?? ColorEnum.PRIMARY]
        )}
    >
        {StartIcon}
        {children}
    </button>
);

export default memo(Button);
