import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGuestBase } from "./IGuestBase";
import { IGuestState } from "./IGuestState";

const initialState: IGuestState = {
  isFocus: false,
  adult: 0,
  child: 0,
  infant: 0,
};

const guestSlice = createSlice({
  name: "guest",
  initialState,
  reducers: {
    focus: (state) => {
      state.isFocus = !state.isFocus;
    },
    change: (
      state,
      { payload: { adult, child, infant } }: PayloadAction<IGuestBase>
    ) => {
      state.adult = adult;
      state.child = child;
      state.infant = infant;
    },
  },
});

export const { change, focus } = guestSlice.actions;

export default guestSlice.reducer;
