import { useCallback } from "react";
import { useAppDispatch, useRedirect } from "../../app/hooks";
import { SuggestionTypeEnum } from "../../components/atoms/SuggestIcon/SuggestionTypeEnum";
import { SuggestPayloadType } from "../../components/molecules/SuggestUnit/SuggestPayloadType";
import { IDateBase } from "../date/IDateBase";
import { IGuestBase } from "../guest/IGuestBase";
import { suggestion } from "./locationSlice";

export default function useSuggestSelect() {
  const dispatch = useAppDispatch();
  const redirect = useRedirect();
  return useCallback(
    (
      suggest: SuggestPayloadType &
        Partial<IDateBase> &
        Partial<IGuestBase> & { strategyType: SuggestionTypeEnum | undefined }
    ) => {
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
