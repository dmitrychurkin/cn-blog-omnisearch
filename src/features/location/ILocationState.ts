import { SuggestionTypeEnum } from "../../components/atoms/SuggestUnit/SuggestionTypeEnum";

export interface ILocationState {
    isFocus: boolean;
    location: string;
    readonly currentLocationEntity: ICurrentLocation;
    readonly suggestionEnities: Array<ISuggestion>;
    readonly suggestionEnitiesNearby: Array<ISuggestionNearby>;
}

export interface ICurrentLocation {
    readonly city?: string;
    readonly country?: string;
}

export interface ISuggestionNearby {
    readonly country: string;
    readonly name: string;
    readonly state: string;
}

export interface ISuggestion {
    readonly associate: unknown;
    readonly country: string;
    readonly location: {
        readonly lat: number;
        readonly lon: number;
    }
    readonly name: string;
    readonly slug: string;
    readonly state: string;
    readonly type: SuggestionTypeEnum;
}
