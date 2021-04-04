import React, { memo } from 'react';
import clsx from 'clsx';
import { IButtonProps } from './IButtonProps';
import { ButtonVariantEnum } from './ButtonVariantEnum';
import { ButtonColorEnum } from './ButtonColorEnum';

import styles from './Button.module.css';

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
            styles.root,
            styles[variant ?? ButtonVariantEnum.CONTAINED],
            styles[color ?? ButtonColorEnum.PRIMARY],
            className
        )}
    >
        {StartIcon}
        {children}
    </button>
);

export default memo(Button);
