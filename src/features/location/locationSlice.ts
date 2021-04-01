import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import request from "../../app/api";
import config from "../../app/config";
import { RootState } from "../../app/store";
import { ICurrentLocation, ILocationState } from "./ILocationState";

const initialState: ILocationState = {
    isFocus: false,
    location: '',
    currentLocationEntity: {},
    suggestionEnities: [],
    suggestionEnitiesNearby: []
};

export const fetchUserCurrentLocation = createAsyncThunk<ICurrentLocation>(
    'location/fetchUserLocation',
    async (_, { signal }) => {
        const response = await request(`${config.API_SERVER_URI}/api/${config.API_VERSION}/user/location`, { signal });
        if (response.ok) {
            const { data: { result } } = await response.json();
            return result;
        }
        return {};
    },
    {
        condition: (_, { getState }) => {
            const { location } = getState() as RootState;
            return (Object.entries(location.currentLocationEntity).length === 0);
        }
    }
);

const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        focus: (state, action: PayloadAction<boolean>) => {
            state.isFocus = action.payload;
        },
        location: (state, action: PayloadAction<string>) => {
            state.location = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUserCurrentLocation.fulfilled, (state, action) => {
                console.log('action => ', action);
                state.currentLocationEntity = action.payload;
            })
    }
});

export const { focus, location } = locationSlice.actions;

export default locationSlice.reducer;
