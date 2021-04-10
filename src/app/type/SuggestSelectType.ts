import { IDateBase } from "app/interface/IDateBase";
import { IGuestBase } from "app/interface/IGuestBase";

import { SuggestionTypeEnum } from "app/enum/SuggestionTypeEnum";

import { SuggestPayloadType } from "./SuggestPayloadType";

export type SuggestSelectType = SuggestPayloadType &
  Partial<IDateBase> &
  Partial<IGuestBase> & { strategyType: SuggestionTypeEnum | undefined };
