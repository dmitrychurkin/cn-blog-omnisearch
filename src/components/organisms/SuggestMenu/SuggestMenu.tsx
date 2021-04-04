import clsx from "clsx";
import React, { memo, useCallback } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import { SuggestionTypeEnum } from "../../atoms/SuggestIcon/SuggestionTypeEnum";
import SuggestLoader from "../../atoms/SuggestLoader";
import SuggestUnit from "../../molecules/SuggestUnit";
import { SuggestModeEnum } from "./SuggestModeEnum";

import styles from "./SuggestMenu.module.css";

import "./SuggestMenu.css";
import { SuggestPayloadType } from "../../molecules/SuggestUnit/SuggestPayloadType";

type SuggestionType = {
  readonly id?: string;
  readonly type?: SuggestionTypeEnum;
  readonly city?: string;
  readonly name: string;
  readonly country: string;
  readonly state: string;
};

type Prop = {
  readonly suggestions: Array<SuggestionType>;
  readonly locationInput: string;
  readonly mode: SuggestModeEnum;
  readonly onSelect: (arg: SuggestPayloadType) => void;
};

const SuggestMenu: React.FC<Prop> = ({
  locationInput,
  suggestions,
  mode,
  onSelect,
}) => {
  const defaultGlobalClassName = "omnisearch-suggest-menu";

  const getSuggestUnit = useCallback(
    (customSuggestionType?: SuggestionTypeEnum) => (
      { id, type, name, country, state, city }: SuggestionType,
      index: number
    ) => (
      <SuggestUnit
        key={id ?? String(index)}
        type={customSuggestionType ?? type}
        name={name}
        country={country}
        state={state}
        city={city}
        locationInput={locationInput}
        onSelect={onSelect}
      />
    ),
    [locationInput, onSelect]
  );

  const menu = new Map<SuggestModeEnum, JSX.Element>([
    [
      SuggestModeEnum.LOADING,
      <div
        className={clsx(
          defaultGlobalClassName,
          `${defaultGlobalClassName}--loading`,
          styles.root,
          styles.loading
        )}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <SuggestLoader key={String(i)} />
        ))}
      </div>,
    ],
    [
      SuggestModeEnum.SUGGESTION,
      <SimpleBar
        className={clsx(
          defaultGlobalClassName,
          `${defaultGlobalClassName}--suggest`,
          styles.root,
          styles.suggest
        )}
        forceVisible="y"
      >
        {suggestions.map(getSuggestUnit())}
      </SimpleBar>,
    ],
    [
      SuggestModeEnum.RECOMMENDED,
      <div
        className={clsx(
          defaultGlobalClassName,
          `${defaultGlobalClassName}--recommended`,
          styles.root,
          styles.recommended
        )}
      >
        <div className={styles.title}>destinations nearby</div>
        <SimpleBar
          className={clsx(
            defaultGlobalClassName,
            `${defaultGlobalClassName}--suggest`,
            styles.suggest,
            styles.suggestRecommended
          )}
          forceVisible="y"
        >
          {suggestions.map(getSuggestUnit(SuggestionTypeEnum.CITY))}
        </SimpleBar>
      </div>,
    ],
    [
      SuggestModeEnum.RECENT_SEARCH,
      <div
        className={clsx(
          defaultGlobalClassName,
          `${defaultGlobalClassName}--recent`,
          styles.root,
          styles.recent
        )}
      >
        <SuggestUnit
          type={SuggestionTypeEnum.NEARBY}
          country=""
          city=""
          name="Nearby"
          state=""
          locationInput=""
          onSelect={onSelect}
        />
        {/* TODO please enable once implemented
                <div className={styles.title}>recent searches</div>
                <SimpleBar
                    className={clsx(
                        defaultGlobalClassName,
                        `${defaultGlobalClassName}--suggest`,
                        styles.suggest,
                        styles.suggestRecent
                    )}
                    forceVisible="y"
                >
                    {suggestions.map(getSuggestUnit(SuggestionTypeEnum.RECENT))}
                </SimpleBar> */}
      </div>,
    ],
  ]);

  return menu.get(mode) || null;
};

export default memo(SuggestMenu);
