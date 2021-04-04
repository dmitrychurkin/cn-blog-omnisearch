import React, { memo } from "react";
import { SuggestionTypeEnum } from "./SuggestionTypeEnum";
import { ReactComponent as AirplaneFilled } from '../../../icons/Airplane-filled.svg';
import { ReactComponent as LocationFilled } from '../../../icons/Location-filled.svg';
import { ReactComponent as BedFilled } from '../../../icons/Bed-filled.svg';
import { ReactComponent as HomeFilled } from '../../../icons/Home-filled.svg';
import { ReactComponent as StarFilled } from '../../../icons/Star-filled.svg';

const suggestIconCollection = new Map<string, React.FC>([
    [SuggestionTypeEnum.AIRPORT, AirplaneFilled],
    [SuggestionTypeEnum.CITY, LocationFilled],
    [SuggestionTypeEnum.STATE, LocationFilled],
    [SuggestionTypeEnum.NEIGHBORHOOD, LocationFilled],
    [SuggestionTypeEnum.COUNTRY, LocationFilled],
    [SuggestionTypeEnum.HOTEL, BedFilled],
    [SuggestionTypeEnum.VR, HomeFilled],
    [SuggestionTypeEnum.NEARBY, LocationFilled],
    [SuggestionTypeEnum.DEFAULT, StarFilled]
]);

type Prop = {
    readonly type?: SuggestionTypeEnum;
};

const SuggestionIcon: React.FC<Prop> = ({ type }) => {
    const IconComponent = suggestIconCollection.get(type ?? SuggestionTypeEnum.DEFAULT) || StarFilled;
    return <IconComponent />;
};

export default memo(SuggestionIcon);
