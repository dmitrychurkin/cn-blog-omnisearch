import React, { memo, useMemo } from "react";
import clsx from "clsx";
import moment from "moment";
import Highlighter from "react-highlight-words";

import { constructLocationString } from "app/util";

import { IDateBase } from "app/interface/IDateBase";
import { IGuestBase } from "app/interface/IGuestBase";

import SuggestionIcon from "components/atoms/SuggestIcon";

import { SuggestionTypeEnum } from "app/enum/SuggestionTypeEnum";
import { SuggestPayloadType } from "app/type/SuggestPayloadType";
import { SuggestSelectType } from "app/type/SuggestSelectType";

import styles from "./SuggestUnit.module.css";

type Prop = SuggestPayloadType &
  Partial<IDateBase> &
  Partial<IGuestBase> & {
    readonly locationInput: string;
    readonly onSelect: (arg: SuggestSelectType) => void;
    readonly strategyType?: SuggestionTypeEnum | undefined;
  };

const SuggestUnit: React.FC<Prop> = ({
  type,
  name,
  city,
  state,
  country,
  id,
  slug,
  locationInput,
  adult,
  child,
  infant,
  checkIn,
  checkOut,
  onSelect,
  strategyType,
}) => {
  const address = useMemo(() => {
    if (strategyType === SuggestionTypeEnum.RECENT) {
      const guestsCount = (adult || 1) + (child || 0) + (infant || 0);

      return [
        moment(checkIn).isValid() && moment(checkOut).isValid()
          ? `${moment(checkIn).format("DD MMM")} - ${moment(checkOut).format(
              "DD MMM"
            )}`
          : "",
        `${guestsCount} guest${guestsCount > 1 ? "s" : ""}`,
      ]
        .filter((w) => w)
        .join(" ");
    }
    if (type === SuggestionTypeEnum.COUNTRY) {
      return "";
    }
    return constructLocationString({ city, state, country });
  }, [
    city,
    state,
    country,
    strategyType,
    checkIn,
    checkOut,
    adult,
    child,
    infant,
    type,
  ]);

  const onClick = () => {
    onSelect({
      type,
      name,
      city,
      state,
      country,
      id,
      slug,
      adult,
      child,
      infant,
      checkIn,
      checkOut,
      strategyType: strategyType ?? type,
    });
  };

  return (
    <div
      className={clsx("omnisearch-suggest-unit", styles.root)}
      onMouseDown={onClick}
      onTouchStart={onClick}
    >
      <SuggestionIcon type={strategyType ?? type} />
      <div className={styles.info}>
        <Highlighter
          autoEscape
          highlightClassName={styles.highlight}
          searchWords={locationInput.split(" ")}
          textToHighlight={name}
        >
          {name}
        </Highlighter>
        {address && <div className={styles.address}>{address}</div>}
      </div>
    </div>
  );
};

export default memo(SuggestUnit);
