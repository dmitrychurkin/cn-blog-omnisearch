import { useCallback } from "react";
import { useAppDispatch } from "../../app/hooks";
import { SuggestionTypeEnum } from "../../components/atoms/SuggestIcon/SuggestionTypeEnum";
import { SuggestPayloadType } from "../../components/molecules/SuggestUnit/SuggestPayloadType";
import { location } from "./locationSlice";

export default function useSuggestSelect() {
  const dispatch = useAppDispatch();
  return useCallback(
    (suggest: SuggestPayloadType) => {
      const abstractSelector = new Map<
        SuggestionTypeEnum,
        (suggest: SuggestPayloadType) => void
      >()
        .set(SuggestionTypeEnum.NEARBY, ({ country, city }) => {
          console.log("Do redirect to SRP!");
        })
        .set(SuggestionTypeEnum.DEFAULT, ({ name, city, state, country }) => {
          dispatch(
            location(
              [name, city, state, country]
                .map((w) => w?.trim())
                .filter((w) => w)
                .join(", ")
            )
          );
        });

      const { type = SuggestionTypeEnum.DEFAULT } = suggest;

      const handler =
        abstractSelector.get(type) ||
        abstractSelector.get(SuggestionTypeEnum.DEFAULT);

      return handler?.(suggest);
    },
    [dispatch]
  );
}
