import moment from "moment";
import { useCallback, useMemo } from "react";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import { SuggestionTypeEnum } from "../components/atoms/SuggestIcon/SuggestionTypeEnum";
import config from "./config";
import type { RootState, AppDispatch } from "./store";
import { constructLocationString } from "./util";

export const useAppStore = () => useStore<RootState>();
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useRedirect = () => {
  const store = useAppStore();

  const getBaseUri = useCallback(
    (suggestionType?: SuggestionTypeEnum) => {
      const { BASE_URI, SRP_URI, LDP_HOTEL_URI, LDP_VR_URI } = config;

      const urlString = new Map<SuggestionTypeEnum, string>([
        [SuggestionTypeEnum.HOTEL, `${BASE_URI}${LDP_HOTEL_URI}`],
        [SuggestionTypeEnum.VR, `${BASE_URI}${LDP_VR_URI}`],
      ]);

      const defaultBaseUri = `${BASE_URI}${SRP_URI}`;

      if (typeof suggestionType === "undefined") {
        return defaultBaseUri;
      }
      const baseUri = urlString.get(suggestionType);
      if (typeof baseUri === "string") {
        const { seletedSuggestion } = store.getState().location;
        if (
          typeof seletedSuggestion?.slug === "string" &&
          typeof seletedSuggestion?.id === "string"
        ) {
          const { slug, id } = seletedSuggestion;
          return `${baseUri}/${slug}-${id}`;
        }
      }
      return defaultBaseUri;
    },
    [store]
  );

  const getRedirectLink = useCallback(
    (
      searchQueryMap: Map<SearchQueryParamsType, string>,
      suggestionType?: SuggestionTypeEnum
    ) => {
      if (searchQueryMap.size === 0) {
        return;
      }

      const restrictedParams = new Map<SuggestionTypeEnum, Array<string>>()
        .set(SuggestionTypeEnum.HOTEL, ["location"])
        .set(SuggestionTypeEnum.VR, ["location"]);

      const urlInstance = new URL(getBaseUri(suggestionType));
      searchQueryMap.forEach((value: string, key: string) => {
        if (
          suggestionType &&
          restrictedParams.get(suggestionType)?.includes(key)
        ) {
          return;
        }
        urlInstance.searchParams.append(key, value);
      });
      return urlInstance.href;
    },
    [getBaseUri]
  );

  const getSearchQueryParams = useCallback(
    (additionalSearchQueryParams?: Map<SearchQueryParamsType, string>) => {
      const {
        location: {
          location,
          currentLocationEntity: { city, country },
        },
        date: { checkIn, checkOut },
        guest: { adult, child, infant },
      } = store.getState();

      const locationString =
        location.trim() || constructLocationString({ city, country });

      if (!locationString) {
        return new Map();
      }

      const defaultSearchQueryParams = new Map<SearchQueryParamsType, string>([
        ["location", locationString],
        ["checkin", (checkIn || moment()).format("YYYY-MM-DD")],
        ["checkout", (checkOut || moment().add(1, "day")).format("YYYY-MM-DD")],
        ["adults", String(adult || 1)],
        ["children", String(child)],
        ["infants", String(infant)],
        ["rooms", String(1)],
      ]);

      additionalSearchQueryParams?.forEach((value, key) => {
        defaultSearchQueryParams.set(key, value);
      });

      return defaultSearchQueryParams;
    },
    [store]
  );

  const generateLinkStrategies = useMemo(
    () =>
      new Map<
        SuggestionTypeEnum,
        (strategy: SuggestionTypeEnum) => string | undefined
      >()
        .set(SuggestionTypeEnum.NEARBY, (strategy: SuggestionTypeEnum) => {
          const {
            location: {
              currentLocationEntity: { city, country },
            },
          } = store.getState();
          return getRedirectLink(
            getSearchQueryParams(
              new Map<SearchQueryParamsType, string>([
                ["location", constructLocationString({ city, country })],
              ])
            ),
            strategy
          );
        })
        .set(SuggestionTypeEnum.DEFAULT, (strategy: SuggestionTypeEnum) =>
          getRedirectLink(getSearchQueryParams(), strategy)
        ),
    [store, getRedirectLink, getSearchQueryParams]
  );

  return useCallback(
    (strategy: SuggestionTypeEnum) => {
      const linkGeneratedStrategy =
        generateLinkStrategies.get(strategy) ||
        generateLinkStrategies.get(SuggestionTypeEnum.DEFAULT);
      const redirectLink = linkGeneratedStrategy?.(strategy);
      if (typeof redirectLink === "string" && redirectLink.length > 0) {
        window.open(redirectLink);
      }
    },
    [generateLinkStrategies]
  );
};

type SearchQueryParamsType =
  | "location"
  | "checkin"
  | "checkout"
  | "adults"
  | "children"
  | "infants"
  | "rooms";
