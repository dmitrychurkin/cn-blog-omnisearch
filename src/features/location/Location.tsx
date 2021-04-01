import React, { ChangeEvent, memo, useCallback, useEffect } from 'react';
import TextInput from '../../components/atoms/TextInput';
import { fetchUserCurrentLocation, location as locationAction } from './locationSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import { ReactComponent as LocationIcon } from '../../icons/Location-outlined.svg';


const Location: React.FC = () => {
    const dispatch = useAppDispatch();
    const location = useAppSelector(state => state.location.location);

    const onChange = useCallback(({ target }: ChangeEvent<HTMLInputElement>) => {
        dispatch(locationAction(target.value));
    }, [dispatch]);

    useEffect(() => {
        const promise = dispatch(fetchUserCurrentLocation());
        return () => {
            promise.abort();
        };
    }, [dispatch]);

    return (
        <TextInput
            startIcon={<LocationIcon />}
            value={location}
            onChange={onChange}
            placeholder="Add destination"
        />
    );
};

export default memo(Location);