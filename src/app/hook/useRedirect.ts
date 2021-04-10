import moment from "moment";
import { useCallback, useMemo } from "react";

import config from "app/config";

import { SearchQueryParamEnum } from "app/enum/SearchQueryParamEnum";
import { SuggestionTypeEnum } from "app/enum/SuggestionTypeEnum";
import { DateInputType } from "app/type/DateInputType";
import { SuggestSelectType } from "app/type/SuggestSelectType";

import { constructLocationString, getValidDates } from "app/util";

import useAppStore from "./useAppStore";
import useRecentSearch from "./useRecentSearch";

export default function useRedirect() {
  const store = useAppStore();
  const { updateRecentSearch } = useRecentSearch();

  const getSearchQueryParamsMap = useCallback(
    ({
      location,
      checkin,
      checkout,
      adults,
      children,
      infants,
      rooms,
    }: {
      location: string;
      checkin: DateInputType;
      checkout: DateInputType;
      adults: number;
      children: number;
      infants: number;
      rooms: number;
    }) => {
      const [startDate, endDate] = getValidDates(checkin, checkout);
      return new Map<SearchQueryParamEnum, string>()
        .set(SearchQueryParamEnum.LOCATION, location)
        .set(
          SearchQueryParamEnum.CHECKIN,
          moment(startDate).format("YYYY-MM-DD")
        )
        .set(
          SearchQueryParamEnum.CHECKOUT,
          moment(endDate).format("YYYY-MM-DD")
        )
        .set(SearchQueryParamEnum.ADULTS, String(adults || 1))
        .set(SearchQueryParamEnum.CHILDREN, String(children))
        .set(SearchQueryParamEnum.INFANTS, String(infants))
        .set(SearchQueryParamEnum.ROOMS, String(rooms));
    },
    []
  );

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
      searchQueryMap: Map<SearchQueryParamEnum, string>,
      suggestionType?: SuggestionTypeEnum
    ) => {
      if (searchQueryMap.size === 0) {
        return;
      }

      const restrictedParams = new Map<SuggestionTypeEnum, Array<string>>()
        .set(SuggestionTypeEnum.HOTEL, [SearchQueryParamEnum.LOCATION])
        .set(SuggestionTypeEnum.VR, [SearchQueryParamEnum.LOCATION]);

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
    (additionalSearchQueryParams?: Map<SearchQueryParamEnum, string>) => {
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

      const defaultSearchQueryParams = getSearchQueryParamsMap({
        location: locationString,
        checkin: checkIn,
        checkout: checkOut,
        adults: adult,
        children: child,
        infants: infant,
        rooms: 1,
      });

      additionalSearchQueryParams?.forEach((value, key) => {
        defaultSearchQueryParams.set(key, value);
      });

      return defaultSearchQueryParams;
    },
    [store, getSearchQueryParamsMap]
  );

  const generateLinkStrategies = useMemo(
    () =>
      new Map<
        SuggestionTypeEnum,
        (
          strategy: SuggestionTypeEnum,
          manualSuggestionPayload?: SuggestSelectType
        ) => string | undefined
      >()
        .set(SuggestionTypeEnum.NEARBY, (strategy: SuggestionTypeEnum) => {
          const {
            location: {
              currentLocationEntity: { city, country },
            },
          } = store.getState();
          const redirectLink = getRedirectLink(
            getSearchQueryParams(
              new Map<SearchQueryParamEnum, string>([
                [
                  SearchQueryParamEnum.LOCATION,
                  constructLocationString({ city, country }),
                ],
              ])
            ),
            strategy
          );

          updateRecentSearch({
            type: SuggestionTypeEnum.NEARBY,
            strategyType: SuggestionTypeEnum.NEARBY,
          });
          return redirectLink;
        })
        .set(
          SuggestionTypeEnum.RECENT,
          (
            strategy: SuggestionTypeEnum,
            manualSuggestionPayload?: SuggestSelectType
          ) => {
            if (manualSuggestionPayload) {
              const {
                name,
                city,
                state,
                country,
                checkIn,
                checkOut,
                adult = 1,
                child = 0,
                infant = 0,
              } = manualSuggestionPayload;

              const redirectLink = getRedirectLink(
                getSearchQueryParamsMap({
                  location: constructLocationString({
                    name,
                    city,
                    state,
                    country,
                  }),
                  checkin: checkIn,
                  checkout: checkOut,
                  adults: adult,
                  children: child,
                  infants: infant,
                  rooms: 1,
                }),
                strategy
              );

              updateRecentSearch(manualSuggestionPayload);
              return redirectLink;
            }
            return "";
          }
        )
        .set(SuggestionTypeEnum.DEFAULT, (strategy: SuggestionTypeEnum) => {
          const redirectLink = getRedirectLink(
            getSearchQueryParams(),
            strategy
          );
          if (
            typeof redirectLink === "string" &&
            redirectLink.length > 0 &&
            ![SuggestionTypeEnum.HOTEL, SuggestionTypeEnum.VR].includes(
              strategy
            )
          ) {
            updateRecentSearch();
          }
          return redirectLink;
        }),
    [
      store,
      getRedirectLink,
      getSearchQueryParams,
      getSearchQueryParamsMap,
      updateRecentSearch,
    ]
  );

  return useCallback(
    (
      strategy: SuggestionTypeEnum,
      manualSuggestionPayload?: SuggestSelectType
    ) => {
      const linkGeneratedStrategy =
        generateLinkStrategies.get(strategy) ||
        generateLinkStrategies.get(SuggestionTypeEnum.DEFAULT);
      const redirectLink = linkGeneratedStrategy?.(
        strategy,
        manualSuggestionPayload
      );
      if (typeof redirectLink === "string" && redirectLink.length > 0) {
        window.open(redirectLink, "_self");
      }
    },
    [generateLinkStrategies]
  );
}
