import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import request from "../../app/api";
import config from "../../app/config";
import { RootState } from "../../app/store";
import { constructLocationString } from "../../app/util";
import { SuggestPayloadType } from "../../components/molecules/SuggestUnit/SuggestPayloadType";
import { FetchStateEnum } from "./FetchStateEnum";
import { ICurrentLocation } from "./ICurrentLocation";
import { ILocationState } from "./ILocationState";
import { ISuggestion } from "./ISuggestion";
import { ISuggestionNearby } from "./ISuggestionNearby";

const initialState: ILocationState = {
  isFocus: false,
  location: "",
  currentLocationEntity: {},
  seletedSuggestion: undefined,
  suggestionEnitiesFetchState: undefined,
  suggestionEnitiesNearbyFetchState: undefined,
  suggestionEnities: [],
  suggestionEnitiesNearby: [],
};

export const fetchUserCurrentLocation = createAsyncThunk<
  ICurrentLocation,
  void,
  AsyncThunkApiConfig
>(
  "location/fetchUserLocation",
  async (_, { signal }) => {
    const response = await request(
      `${config.API_SERVER_URI}/api/${config.API_VERSION}/user/location`,
      { signal }
    );
    if (response.ok) {
      const {
        data: { result },
      } = await response.json();
      return result;
    }
    return {};
  },
  {
    condition: (_, { getState }) => {
      const { currentLocationEntity } = getState().location;
      return Object.entries(currentLocationEntity).length === 0;
    },
  }
);

export const fetchLocationsNearby = createAsyncThunk<
  Array<ISuggestionNearby>,
  void,
  AsyncThunkApiConfig
>(
  "location/fetchLocationsNearby",
  async (_, { signal, getState }) => {
    const { currentLocationEntity } = getState().location;
    const formattedCountry = currentLocationEntity.country?.toLowerCase();
    let country = "";
    if (formattedCountry) {
      country =
        formattedCountry === "united states"
          ? "unitedstatesofamerica"
          : formattedCountry.replace(/\s+/g, "");
    }

    const response = await request(
      `${config.GEO_SERVER_URI}/get_country_near_by`,
      {
        method: "post",
        signal,
        body: JSON.stringify({ country }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        return data.reduce(
          (
            acc: Array<ISuggestionNearby>,
            locationNearBy: { _source?: ISuggestionNearby }
          ) => {
            const suggestionNearBy = locationNearBy?._source;
            if (suggestionNearBy instanceof Object) {
              return [...acc, suggestionNearBy];
            }
            return acc;
          },
          []
        );
      }
    }
    return [];
  },
  {
    condition: (_, { getState }) => {
      const { currentLocationEntity } = getState().location;
      return typeof currentLocationEntity.country === "string";
    },
  }
);

export const fetchSuggestion = createAsyncThunk<
  Array<ISuggestion>,
  void,
  AsyncThunkApiConfig
>(
  "location/fetchSuggestion",
  async (_, { signal, getState }) => {
    const {
      location,
      currentLocationEntity,
      seletedSuggestion,
    } = getState().location;
    const response = await request(`${config.GEO_SERVER_URI}/location`, {
      method: "post",
      signal,
      body: JSON.stringify({
        data: seletedSuggestion ? seletedSuggestion.name : location,
        type: "hotel",
        country: currentLocationEntity.country,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        return data.reduce(
          (
            acc: Array<ISuggestion>,
            suggestion: { _id: string; _source?: ISuggestion }
          ) => {
            const suggestionSource = suggestion?._source;
            if (suggestionSource instanceof Object) {
              return [
                ...acc,
                {
                  ...suggestionSource,
                  id: suggestion._id.replace(/\D/g, ""),
                },
              ];
            }
            return acc;
          },
          []
        );
      }
    }
    return [];
  },
  {
    condition: (_, { getState }) => {
      const { location } = getState().location;
      return Boolean(location);
    },
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    focus: (state, { payload }: PayloadAction<boolean | undefined>) => {
      state.isFocus = typeof payload === "boolean" ? payload : !state.isFocus;
    },
    location: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    suggestion: (
      state,
      { payload }: PayloadAction<SuggestPayloadType | undefined>
    ) => {
      state.seletedSuggestion = payload;
      if (typeof payload !== "undefined") {
        state.location = constructLocationString(payload);
      }
    },
    resetSuggestions: (state) => {
      state.seletedSuggestion = undefined;
      state.suggestionEnitiesFetchState = undefined;
      state.suggestionEnities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCurrentLocation.fulfilled, (state, action) => {
        state.currentLocationEntity = action.payload;
      })
      .addCase(fetchLocationsNearby.pending, (state) => {
        state.suggestionEnitiesNearbyFetchState = FetchStateEnum.PENDING;
      })
      .addCase(fetchLocationsNearby.fulfilled, (state, action) => {
        state.suggestionEnitiesNearby = action.payload;
        state.suggestionEnitiesNearbyFetchState = FetchStateEnum.FULFILLED;
      })
      .addCase(fetchSuggestion.pending, (state) => {
        state.suggestionEnitiesFetchState = FetchStateEnum.PENDING;
      })
      .addCase(fetchSuggestion.fulfilled, (state, action) => {
        state.suggestionEnities = action.payload;
        state.suggestionEnitiesFetchState = FetchStateEnum.FULFILLED;
      });
  },
});

export const {
  focus,
  location,
  resetSuggestions,
  suggestion,
} = locationSlice.actions;

export default locationSlice.reducer;

type AsyncThunkApiConfig = { state: RootState };
