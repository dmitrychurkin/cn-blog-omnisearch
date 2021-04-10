import { SuggestionTypeEnum } from "../enum/SuggestionTypeEnum";

export type SuggestPayloadType = {
  readonly type?: SuggestionTypeEnum;
  readonly city?: string;
  readonly name: string;
  readonly state: string;
  readonly country: string;
  // Hotel VR specific
  readonly id?: string;
  readonly slug?: string;
};
