import { useCallback } from "react";
import { useAppDispatch, useRedirect } from "../../app/hooks";
import { SuggestionTypeEnum } from "../../components/atoms/SuggestIcon/SuggestionTypeEnum";
import { SuggestPayloadType } from "../../components/molecules/SuggestUnit/SuggestPayloadType";
import { suggestion } from "./locationSlice";

export default function useSuggestSelect() {
  const dispatch = useAppDispatch();
  const redirect = useRedirect();
  return useCallback(
    (suggest: SuggestPayloadType) => {
      const abstractSelector = new Map<
        SuggestionTypeEnum,
        (suggest: SuggestPayloadType) => void
      >()
        .set(SuggestionTypeEnum.NEARBY, () => {
          redirect(SuggestionTypeEnum.NEARBY);
        })
        .set(
          SuggestionTypeEnum.HOTEL,
          (suggestionPayload: SuggestPayloadType) => {
            dispatch(suggestion(suggestionPayload));
            redirect(SuggestionTypeEnum.HOTEL);
          }
        )
        .set(SuggestionTypeEnum.VR, (suggestionPayload: SuggestPayloadType) => {
          dispatch(suggestion(suggestionPayload));
          redirect(SuggestionTypeEnum.VR);
        })
        .set(
          SuggestionTypeEnum.DEFAULT,
          (suggestionPayload: SuggestPayloadType) => {
            dispatch(suggestion(suggestionPayload));
          }
        );

      const { type = SuggestionTypeEnum.DEFAULT } = suggest;

      const handler =
        abstractSelector.get(type) ||
        abstractSelector.get(SuggestionTypeEnum.DEFAULT);

      return handler?.(suggest);
    },
    [dispatch, redirect]
  );
}
