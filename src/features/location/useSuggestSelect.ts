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
      dispatch(suggestion(suggest));

      const { type } = suggest;
      if (
        type &&
        [
          SuggestionTypeEnum.NEARBY,
          SuggestionTypeEnum.HOTEL,
          SuggestionTypeEnum.VR,
        ].includes(type)
      ) {
        redirect(type);
      }
    },
    [dispatch, redirect]
  );
}
