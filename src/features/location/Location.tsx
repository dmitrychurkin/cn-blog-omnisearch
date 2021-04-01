import React, { memo, useEffect } from 'react';
import TextInput from '../../components/atoms/TextInput';
import { fetchUserCurrentLocation } from './locationSlice';
import { useAppDispatch } from '../../app/hooks';
import { ReactComponent as LocationIcon } from '../../icons/Location-outlined.svg';


const Location: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const promise = dispatch(fetchUserCurrentLocation());
        return () => {
            promise.abort();
        };
    }, [dispatch]);

    return (
        <TextInput
            startIcon={<LocationIcon />}
            placeholder="Add destination"
        />
    );
};

export default memo(Location);