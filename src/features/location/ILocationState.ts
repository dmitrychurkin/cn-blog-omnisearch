import { FetchStateEnum } from "./FetchStateEnum";
import { ICurrentLocation } from "./ICurrentLocation";
import { ISuggestion } from "./ISuggestion";
import { ISuggestionNearby } from "./ISuggestionNearby";

export interface ILocationState {
    isFocus: boolean;
    location: string;
    suggestionEnities: Array<ISuggestion>;
    suggestionEnitiesFetchState: FetchStateEnum | undefined;
    suggestionEnitiesNearbyFetchState: FetchStateEnum | undefined;
    suggestionEnitiesNearby: Array<ISuggestionNearby>;
    readonly currentLocationEntity: ICurrentLocation;
}
