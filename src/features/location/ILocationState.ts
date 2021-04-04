import { SuggestPayloadType } from "../../components/molecules/SuggestUnit/SuggestPayloadType";
import { FetchStateEnum } from "./FetchStateEnum";
import { ICurrentLocation } from "./ICurrentLocation";
import { ISuggestion } from "./ISuggestion";
import { ISuggestionNearby } from "./ISuggestionNearby";

export interface ILocationState {
  isFocus: boolean;
  location: string;
  seletedSuggestion: SuggestPayloadType | undefined;
  suggestionEnities: Array<ISuggestion>;
  suggestionEnitiesFetchState: FetchStateEnum | undefined;
  suggestionEnitiesNearbyFetchState: FetchStateEnum | undefined;
  suggestionEnitiesNearby: Array<ISuggestionNearby>;
  readonly currentLocationEntity: ICurrentLocation;
}
