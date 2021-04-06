import React, {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import debounce from "lodash.debounce";
import clsx from "clsx";
import TextInput from "../../components/molecules/TextInput";
import {
  fetchLocationsNearby,
  fetchSuggestion,
  fetchUserCurrentLocation,
  location as locationAction,
  focus,
  resetSuggestions,
  suggestion,
} from "./locationSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "../../app/hooks";
import { FetchStateEnum } from "./FetchStateEnum";
import SuggestMenu from "../../components/organisms/SuggestMenu";
import { SuggestModeEnum } from "../../components/organisms/SuggestMenu/SuggestModeEnum";
import useSuggestSelect from "./useSuggestSelect";

import { ReactComponent as LocationIcon } from "../../icons/Location-outlined.svg";

import styles from "./Location.module.css";
import { constructLocationString } from "../../app/util";
import useRecentSearch from "./useRecentSearch";
import { SuggestionTypeEnum } from "../../components/atoms/SuggestIcon/SuggestionTypeEnum";

const Location: React.FC = () => {
  const isLocationPristine = useRef(true);
  const store = useAppStore();
  const dispatch = useAppDispatch();
  const {
    isFocus,
    location,
    currentLocationEntity,
    suggestionEnities,
    suggestionEnitiesFetchState,
    suggestionEnitiesNearby,
  } = useAppSelector((state) => state.location);

  const suggestionSelectHandler = useSuggestSelect();
  const { getRecentSearch } = useRecentSearch();

  const onChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      dispatch(locationAction(target.value));
    },
    [dispatch]
  );

  const onClear = useCallback(() => {
    dispatch(locationAction(""));
  }, [dispatch]);

  const focusHandler = useCallback(() => {
    dispatch(focus());
  }, [dispatch]);

  const getSuggestionHandler = useMemo(
    () => debounce(() => dispatch(fetchSuggestion()), 500, { trailing: true }),
    [dispatch]
  );

  // core logic :)
  const derivedSuggestProps = useMemo(() => {
    const baseProp = {
      suggestions: suggestionEnities,
    };

    if (!isFocus) {
      return {
        ...baseProp,
        mode: SuggestModeEnum.VOID,
      };
    }

    if (
      location &&
      suggestionEnities.length <= 0 &&
      [undefined, FetchStateEnum.PENDING].includes(suggestionEnitiesFetchState)
    ) {
      return {
        ...baseProp,
        mode: SuggestModeEnum.LOADING,
      };
    }

    if (location && suggestionEnities.length > 0) {
      return {
        ...baseProp,
        mode: SuggestModeEnum.SUGGESTION,
      };
    }

    if (isLocationPristine.current && suggestionEnitiesNearby.length > 0) {
      return {
        ...baseProp,
        suggestions: suggestionEnitiesNearby,
        mode: SuggestModeEnum.RECOMMENDED,
      };
    }

    if (!isLocationPristine.current) {
      return {
        ...baseProp,
        suggestions: getRecentSearch().reduce((acc, it) => {
          const id = it?.addrData?.id;
          const slug = it?.addrData?.slug;
          const type = it?.addrData?.type;
          const formattedAddress = it?.addrData?.formattedAddress;

          const adult = it?.guests?.adults || 1;
          const child = it?.guests?.childrenVr || 0;
          const infant = it?.guests?.infants || 0;

          const checkIn = it?.startDate || null;
          const checkOut = it?.endDate || null;

          if (formattedAddress) {
            const [name, city, state, country] = formattedAddress
              .split(",")
              .map((item: string) => item.trim())
              .filter((w: string) => w);

            return [
              ...acc,
              {
                id,
                slug,
                type,
                name: name || city || state || country,
                city,
                state,
                country,
                adult,
                child,
                infant,
                checkIn,
                checkOut,
              },
            ];
          }
          return acc;
        }, []),
        mode: SuggestModeEnum.RECENT_SEARCH,
      };
    }

    return {
      ...baseProp,
      mode: SuggestModeEnum.VOID,
    };
  }, [
    isFocus,
    location,
    suggestionEnities,
    suggestionEnitiesFetchState,
    suggestionEnitiesNearby,
    getRecentSearch,
  ]);

  // user current location
  useEffect(() => {
    const promise = dispatch(fetchUserCurrentLocation());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  // searches nearby
  useEffect(() => {
    const promise = dispatch(fetchLocationsNearby());
    return () => {
      promise.abort();
    };
  }, [dispatch, currentLocationEntity.country]);

  // autosuggests
  useEffect(() => {
    if (!location) {
      dispatch(resetSuggestions());
    } else {
      isLocationPristine.current = false;
    }

    const { seletedSuggestion } = store.getState().location;
    if (
      seletedSuggestion &&
      location !==
        constructLocationString(
          seletedSuggestion.type === SuggestionTypeEnum.COUNTRY
            ? { country: seletedSuggestion.country }
            : seletedSuggestion
        )
    ) {
      dispatch(suggestion());
    }

    const promise = getSuggestionHandler();
    return () => {
      promise?.abort();
    };
  }, [store, dispatch, getSuggestionHandler, location]);

  return (
    <div className={clsx("omnisearch-location", styles.root)}>
      <TextInput
        startIcon={<LocationIcon />}
        value={location}
        onChange={onChange}
        onFocus={focusHandler}
        onBlur={focusHandler}
        onClear={onClear}
        placeholder="Add destination"
      />
      <SuggestMenu
        {...derivedSuggestProps}
        locationInput={location}
        onSelect={suggestionSelectHandler}
      />
    </div>
  );
};

export default memo(Location);
