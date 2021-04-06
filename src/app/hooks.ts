import moment, { Moment } from "moment";
import { useCallback, useMemo } from "react";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import { SuggestionTypeEnum } from "../components/atoms/SuggestIcon/SuggestionTypeEnum";
import { SuggestPayloadType } from "../components/molecules/SuggestUnit/SuggestPayloadType";
import { IDateBase } from "../features/date/IDateBase";
import { IGuestBase } from "../features/guest/IGuestBase";
import useRecentSearch from "../features/location/useRecentSearch";
import config from "./config";
import type { RootState, AppDispatch } from "./store";
import { constructLocationString, validateDate } from "./util";

export const useAppStore = () => useStore<RootState>();
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useRedirect = () => {
  const store = useAppStore();
  const { updateRecentSearch } = useRecentSearch();

  const getSearchQueryParamsMap = useCallback(({ location, checkin, checkout, adults, children, infants, rooms }: {
    location: string;
    checkin: Moment | null | undefined;
    checkout: Moment | null | undefined;
    adults: number;
    children: number;
    infants: number;
    rooms: number;
  }) => {
    const [startDate, endDate] = validateDate(checkin, checkout) ? [checkin, checkout] : [moment(), moment().add(1, 'day')];
    return new Map<SearchQueryParamsType, string>()
      .set('location', location)
      .set('checkin', moment(startDate).format('YYYY-MM-DD'))
      .set('checkout', moment(endDate).format('YYYY-MM-DD'))
      .set('adults', String(adults || 1))
      .set('children', String(children))
      .set('infants', String(infants))
      .set('rooms', String(rooms));
  }, []);

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

      const defaultSearchQueryParams = getSearchQueryParamsMap({
        location: locationString,
        checkin: checkIn,
        checkout: checkOut,
        adults: adult,
        children: child,
        infants: infant,
        rooms: 1
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
        (strategy: SuggestionTypeEnum, manualSuggestionPayload?: SuggestPayloadType & Partial<IDateBase> & Partial<IGuestBase> & { strategyType: SuggestionTypeEnum | undefined }) => string | undefined
      >()
        .set(SuggestionTypeEnum.NEARBY, (strategy: SuggestionTypeEnum) => {
          const {
            location: {
              currentLocationEntity: { city, country },
            },
          } = store.getState();
          const redirectLink = getRedirectLink(
            getSearchQueryParams(
              new Map<SearchQueryParamsType, string>([
                ["location", constructLocationString({ city, country })],
              ])
            ),
            strategy
          );

          updateRecentSearch({ type: SuggestionTypeEnum.NEARBY, strategyType: SuggestionTypeEnum.NEARBY });
          return redirectLink;
        })
        .set(SuggestionTypeEnum.RECENT, (strategy: SuggestionTypeEnum, manualSuggestionPayload?: SuggestPayloadType & Partial<IDateBase> & Partial<IGuestBase> & { strategyType: SuggestionTypeEnum | undefined }) => {
          if (manualSuggestionPayload) {
            const { name, city, state, country, checkIn, checkOut, adult = 1, child = 0, infant = 0 } = manualSuggestionPayload;

            const redirectLink = getRedirectLink(
              getSearchQueryParamsMap({
                location: constructLocationString({ name, city, state, country}),
                checkin: checkIn,
                checkout: checkOut,
                adults: adult,
                children: child,
                infants: infant,
                rooms: 1
              }),
              strategy
            );

            updateRecentSearch(manualSuggestionPayload);
            return redirectLink;
          }
          return '';
        })
        .set(SuggestionTypeEnum.DEFAULT, (strategy: SuggestionTypeEnum) => {
          const redirectLink = getRedirectLink(getSearchQueryParams(), strategy);
          if (typeof redirectLink === "string" &&
              redirectLink.length > 0 &&
              ![SuggestionTypeEnum.HOTEL, SuggestionTypeEnum.VR].includes(strategy)) {
            updateRecentSearch();
          }
          return redirectLink;
        }),
    [
      store,
      getRedirectLink,
      getSearchQueryParams,
      getSearchQueryParamsMap,
      updateRecentSearch
    ]
  );

  return useCallback(
    (strategy: SuggestionTypeEnum, manualSuggestionPayload?: SuggestPayloadType & Partial<IDateBase> & Partial<IGuestBase> & { strategyType: SuggestionTypeEnum | undefined }) => {
      const linkGeneratedStrategy =
        generateLinkStrategies.get(strategy) ||
        generateLinkStrategies.get(SuggestionTypeEnum.DEFAULT);
      const redirectLink = linkGeneratedStrategy?.(strategy, manualSuggestionPayload);
      if (typeof redirectLink === "string" && redirectLink.length > 0) {
        window.open(redirectLink, "_self");
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
