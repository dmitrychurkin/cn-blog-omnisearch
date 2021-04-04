import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateInputFocusPayloadType } from "../../components/molecules/DateInput/DateInputFocusPayloadType";
import { IDateInputPayload } from "../../components/molecules/DateInput/IDateInputPayload";
import { IDateState } from "./IDateState";

const initialState: IDateState = {
  checkIn: null,
  checkOut: null,
  currentFocus: null,
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    dates: (
      state,
      { payload: { startDate, endDate } }: PayloadAction<IDateInputPayload>
    ) => {
      state.checkIn = startDate;
      state.checkOut = endDate;
    },
    focus: (state, action: PayloadAction<DateInputFocusPayloadType>) => {
      state.currentFocus = action.payload;
    },
  },
});

export const { dates, focus } = dateSlice.actions;

export default dateSlice.reducer;
