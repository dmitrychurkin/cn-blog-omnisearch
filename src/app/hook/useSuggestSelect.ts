import { useCallback } from "react";

import { SuggestionTypeEnum } from "app/enum/SuggestionTypeEnum";
import { SuggestSelectType } from "app/type/SuggestSelectType";

import { suggestion } from "features/location/locationSlice";

import useAppDispatch from "./useAppDispatch";
import useRedirect from "./useRedirect";

export default function useSuggestSelect() {
  const dispatch = useAppDispatch();
  const redirect = useRedirect();
  return useCallback(
    (suggest: SuggestSelectType) => {
      const { strategyType, ...restSuggestionProps } = suggest;

      if (strategyType !== SuggestionTypeEnum.NEARBY) {
        dispatch(suggestion(restSuggestionProps));
      }

      if (
        strategyType &&
        [
          SuggestionTypeEnum.NEARBY,
          SuggestionTypeEnum.HOTEL,
          SuggestionTypeEnum.VR,
          SuggestionTypeEnum.RECENT,
        ].includes(strategyType)
      ) {
        redirect(strategyType, suggest);
      }
    },
    [dispatch, redirect]
  );
}
