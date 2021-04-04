import clsx from 'clsx';
import React, { memo, useCallback, useMemo } from 'react';
import Highlighter from 'react-highlight-words';
import SuggestionIcon from '../../atoms/SuggestIcon';
import { SuggestPayloadType } from './SuggestPayloadType';

import styles from './SuggestUnit.module.css';

type Prop = SuggestPayloadType & {
    readonly locationInput: string;
    readonly onSelect: (arg: SuggestPayloadType) => void;
};

const SuggestUnit: React.FC<Prop> = ({
    type,
    name,
    city,
    state,
    country,
    locationInput,
    onSelect
}) => {
    const address = useMemo(() => [city, state, country].filter(w => w).join(', '), [city, state, country]);

    const onClick = useCallback(() => {
        onSelect({
            type,
            name,
            city,
            state,
            country
        });
    }, [
        type,
        name,
        city,
        state,
        country,
        onSelect
    ]);

    return (
        <div
            className={clsx('omnisearch-suggest-unit', styles.root)}
            onMouseDown={onClick}
            onTouchStart={onClick}
        >
            <SuggestionIcon type={type} />
            <div className={styles.info}>
                <Highlighter
                    autoEscape
                    highlightClassName={styles.highlight}
                    searchWords={locationInput.split(' ')}
                    textToHighlight={name}
                >
                    {name}
                </Highlighter>
                {address && (
                    <div className={styles.address}>{address}</div>
                )}
            </div>
        </div>
    );
};

export default memo(SuggestUnit);
