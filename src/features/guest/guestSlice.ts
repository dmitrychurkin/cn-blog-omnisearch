import { createSlice } from "@reduxjs/toolkit";
import { IGuestState } from "./IGuestState";

const initialState: IGuestState = {
    adult: 0,
    child: 0,
    infant: 0
};

const guestSlice = createSlice({
    name: 'guest',
    initialState,
    reducers: {
        adultIncrement: state => {
            state.adult += 1;
        },
        adultDecrement: state => {
            state.adult -= 1;
        },

        childIncrement: state => {
            state.child += 1;
        },
        childDecrement: state => {
            state.child -= 1;
        },

        infantIncrement: state => {
            state.infant += 1;
        },
        infantDecrement: state => {
            state.infant -= 1;
        }
    }
});

export const {
    adultDecrement,
    adultIncrement,
    childDecrement,
    childIncrement,
    infantDecrement,
    infantIncrement
} = guestSlice.actions;

export default guestSlice.reducer;
