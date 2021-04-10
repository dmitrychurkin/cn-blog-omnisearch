import { SuggestionTypeEnum } from "app/enum/SuggestionTypeEnum";
import { ISuggestionNearby } from "./ISuggestionNearby";

export interface ISuggestion extends ISuggestionNearby {
  readonly id: string;
  readonly associate: unknown;
  readonly city: string;
  readonly location: {
    readonly lat: number;
    readonly lon: number;
  };
  readonly slug: string;
  readonly type: SuggestionTypeEnum;
}
