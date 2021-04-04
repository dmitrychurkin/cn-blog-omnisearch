import React, { ChangeEvent, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import clsx from 'clsx';
import TextInput from '../../components/molecules/TextInput';
import {
    fetchLocationsNearby,
    fetchSuggestion,
    fetchUserCurrentLocation,
    location as locationAction,
    focus,
    resetSuggestions
} from './locationSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FetchStateEnum } from './FetchStateEnum';
import SuggestMenu from '../../components/organisms/SuggestMenu';
import { SuggestModeEnum } from '../../components/organisms/SuggestMenu/SuggestModeEnum';
import useSuggestSelect from './useSuggestSelect';

import { ReactComponent as LocationIcon } from '../../icons/Location-outlined.svg';

import styles from './Location.module.css';

const Location: React.FC = () => {
    const isLocationPristine = useRef(true);
    const dispatch = useAppDispatch();
    const {
        isFocus,
        location,
        currentLocationEntity,
        suggestionEnities,
        suggestionEnitiesFetchState,
        suggestionEnitiesNearby
    } = useAppSelector(state => state.location);

    const suggestionSelectHandler = useSuggestSelect();

    const onChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
        dispatch(locationAction(target.value));
    }, [dispatch]);

    const onClear = useCallback(() => {
        dispatch(locationAction(''));
    }, [dispatch]);

    const focusHandler = useCallback(() => {
        dispatch(focus());
    }, [dispatch]);

    const getSuggestionHandler = useMemo(() =>
        debounce(() => dispatch(fetchSuggestion()), 500, { trailing: true })
        , [dispatch]);

    // core logic :)
    const derivedSuggestProps = useMemo(() => {
        const baseProp = {
            suggestions: suggestionEnities
        };

        if (!isFocus) {
            return {
                ...baseProp,
                mode: SuggestModeEnum.VOID
            };
        }

        if (location &&
            (suggestionEnities.length <= 0) &&
            [undefined, FetchStateEnum.PENDING].includes(suggestionEnitiesFetchState)) {
            return {
                ...baseProp,
                mode: SuggestModeEnum.LOADING
            };
        }

        if (location &&
            (suggestionEnities.length > 0)) {
            return {
                ...baseProp,
                mode: SuggestModeEnum.SUGGESTION
            };
        }

        if (isLocationPristine.current &&
            (suggestionEnitiesNearby.length > 0)) {
            return {
                ...baseProp,
                suggestions: suggestionEnitiesNearby,
                mode: SuggestModeEnum.RECOMMENDED
            };
        }

        if (!isLocationPristine.current) {
            return {
                ...baseProp,
                mode: SuggestModeEnum.RECENT_SEARCH
            };
        }

        return {
            ...baseProp,
            mode: SuggestModeEnum.VOID
        };
    }, [
        isFocus,
        location,
        suggestionEnities,
        suggestionEnitiesFetchState,
        suggestionEnitiesNearby
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
        }else {
            isLocationPristine.current = false;
        }
        const promise = getSuggestionHandler();
        return () => {
            promise?.abort();
        };
    }, [
        dispatch,
        getSuggestionHandler,
        location
    ]);

    return (
        <div
            className={clsx(
                'omnisearch-location',
                styles.root
            )}
        >
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