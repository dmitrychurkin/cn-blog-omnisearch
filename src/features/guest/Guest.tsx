import React, { memo } from 'react';
import { useAppSelector } from '../../app/hooks';
import GuestInput from '../../components/atoms/GuestInput';
import { ReactComponent as GuestIcon } from '../../icons/Person-outlined.svg';

const Guest: React.FC = () => {
    const { adult, child, infant } = useAppSelector(state => state.guest);
    return (
        <GuestInput
            startIcon={<GuestIcon />}
            guestCount={adult + child + infant}
        />
    );
};

export default memo(Guest);
