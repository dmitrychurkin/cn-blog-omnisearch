import { SuggestionTypeEnum } from "../../atoms/SuggestIcon/SuggestionTypeEnum";

export type SuggestPayloadType = {
    readonly type?: SuggestionTypeEnum;
    readonly city?: string;
    readonly name: string;
    readonly state: string;
    readonly country: string;
}
