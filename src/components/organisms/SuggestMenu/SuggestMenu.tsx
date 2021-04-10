import clsx from "clsx";
import React, { memo, useCallback } from "react";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import SuggestLoader from "components/atoms/SuggestLoader";
import SuggestUnit from "components/molecules/SuggestUnit";

import { SuggestionTypeEnum } from "app/enum/SuggestionTypeEnum";
import { SuggestModeEnum } from "app/enum/SuggestModeEnum";
import { SuggestPayloadType } from "app/type/SuggestPayloadType";
import { SuggestSelectType } from "app/type/SuggestSelectType";

import { IDateBase } from "app/interface/IDateBase";
import { IGuestBase } from "app/interface/IGuestBase";

import styles from "./SuggestMenu.module.css";

import "./SuggestMenu.css";

type Prop = {
  readonly suggestions: Array<
    SuggestPayloadType & Partial<IDateBase> & Partial<IGuestBase>
  >;
  readonly locationInput: string;
  readonly mode: SuggestModeEnum;
  readonly onSelect: (arg: SuggestSelectType) => void;
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
      {
        id,
        slug,
        type,
        name,
        country,
        state,
        city,
        adult,
        child,
        infant,
        checkIn,
        checkOut,
      }: SuggestPayloadType & Partial<IDateBase> & Partial<IGuestBase>,
      index: number
    ) => (
      <SuggestUnit
        key={id ?? String(index)}
        id={id}
        slug={slug}
        type={type ?? SuggestionTypeEnum.NEARBY}
        strategyType={customSuggestionType ?? type}
        name={name}
        country={country}
        state={state}
        city={city}
        locationInput={locationInput}
        adult={adult}
        child={child}
        infant={infant}
        checkIn={checkIn}
        checkOut={checkOut}
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
        {suggestions.length > 0 && (
          <>
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
            </SimpleBar>
          </>
        )}
      </div>,
    ],
  ]);

  return menu.get(mode) || null;
};

export default memo(SuggestMenu);
