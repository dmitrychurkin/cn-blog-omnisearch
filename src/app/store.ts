import {
  configureStore,
  // ThunkAction,
  // Action,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import locationReducer from "features/location/locationSlice";
import dateReducer from "features/date/dateSlice";
import guestReducer from "features/guest/guestSlice";

export const store = configureStore({
  devTools: process.env.NODE_ENV === "development",
  reducer: {
    location: locationReducer,
    date: dateReducer,
    guest: guestReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;
