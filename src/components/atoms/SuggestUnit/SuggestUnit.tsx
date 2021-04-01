import React, { memo } from 'react';
import Highlighter from 'react-highlight-words';
import SuggestionIcon from './SuggestIcon';
import { SuggestionTypeEnum } from './SuggestionTypeEnum';

import styles from './SuggestUnit.module.css';


type Prop = {
    readonly type: SuggestionTypeEnum;
    readonly name: string;
    readonly city: string;
    readonly state: string;
    readonly country: string;
    readonly locationInput: string;
};

const SuggestionUnit: React.FC<Prop> = ({ type, name, city, state, country, locationInput }) => {
    const address = [city, state, country].join(', ');

    return (
        <div className={styles.root}>
            <SuggestionIcon type={type} />
            <div className={styles.info}>
                <div>
                    <Highlighter
                        autoEscape
                        highlightClassName={styles.highlight}
                        searchWords={[locationInput]}
                        textToHighlight={name}
                    >
                        {name}
                    </Highlighter>
                </div>
                {address && (
                    <div className={styles.address}>{address}</div>
                )}
            </div>
        </div>
    );
};

export default memo(SuggestionUnit);
