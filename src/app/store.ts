import { configureStore, ThunkAction, Action, getDefaultMiddleware } from "@reduxjs/toolkit";
import locationReducer from "../features/location/locationSlice";
import dateReducer from "../features/date/dateSlice";
import guestReducer from "../features/guest/guestSlice";

export const store = configureStore({
  reducer: {
    location: locationReducer,
    date: dateReducer,
    guest: guestReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
  })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
