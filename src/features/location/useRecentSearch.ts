import { useCallback } from "react";
import { useAppStore } from "../../app/hooks";
import { constructLocationString } from "../../app/util";
import { SuggestionTypeEnum } from "../../components/atoms/SuggestIcon/SuggestionTypeEnum";
import { SuggestPayloadType } from "../../components/molecules/SuggestUnit/SuggestPayloadType";
import { IDateBase } from "../date/IDateBase";
import { IGuestBase } from "../guest/IGuestBase";

export default function useRecentSearch() {
  const store = useAppStore();

  const getRecentSearch = useCallback((lsKey = "recentSearch") => {
    const recentSearch = localStorage.getItem(lsKey);
    if (recentSearch) {
      try {
        const recentSearchParsed = JSON.parse(recentSearch);
        return Array.isArray(recentSearchParsed) ? recentSearchParsed : [];
      } catch {}
    }
    return [];
  }, []);

  const updateRecentSearch = useCallback(
    (
      data?: Partial<SuggestPayloadType> &
        Partial<IDateBase> &
        Partial<IGuestBase> & { strategyType: SuggestionTypeEnum | undefined },
      lsKey = "recentSearch"
    ) => {
      const {
        location: { seletedSuggestion: ss, currentLocationEntity },
        date,
        guest,
      } = store.getState();
      const dataToSet = {
        id: ss?.id,
        type: ss?.type,
        slug: ss?.slug,
        name: ss?.name,
        city: ss?.city,
        state: ss?.state,
        country: ss?.country,
        checkIn: date.checkIn ?? null,
        checkOut: date.checkOut ?? null,
        adult: guest.adult || 1,
        child: guest.child || 0,
        infant: guest.infant || 0,
      };

      if (data?.type === SuggestionTypeEnum.NEARBY) {
        dataToSet.name = currentLocationEntity.city;
        dataToSet.country = currentLocationEntity.country;
        dataToSet.city = currentLocationEntity.city;
        delete dataToSet.id;
        delete dataToSet.slug;
        delete dataToSet.state;
      } else if (data?.strategyType === SuggestionTypeEnum.RECENT) {
        dataToSet.id = data?.id;
        dataToSet.type = data?.type;
        dataToSet.slug = data?.slug;
        dataToSet.name = data?.name;
        dataToSet.city = data?.city;
        dataToSet.state = data?.state;
        dataToSet.country = data?.country;
        dataToSet.checkIn = data.checkIn ?? null;
        dataToSet.checkOut = data.checkOut ?? null;
        dataToSet.adult = data?.adult || 1;
        dataToSet.child = data?.child || 0;
        dataToSet.infant = data?.infant || 0;
      }

      const {
        id,
        type,
        slug,
        name,
        city,
        state,
        country,
        checkIn,
        checkOut,
        adult,
        child,
        infant,
      } = dataToSet;

      if (!(name || city || state || country)) {
        return;
      }

      const seletedSuggestion =
        data?.strategyType === SuggestionTypeEnum.NEARBY ||
        dataToSet.type === SuggestionTypeEnum.NEARBY
          ? { city, country }
          : { name, city, state, country };

      const filteredState = getRecentSearch().filter((it) => {
        if (id && it?.addrData?.id === id) {
          return false;
        }

        const formattedLocationArray = it?.addrData?.formattedAddress
          .split(",")
          .map((item: string) => item.trim());

        if (!Array.isArray(formattedLocationArray)) {
          return false;
        }

        const localCity = formattedLocationArray[0];
        const localCountry = formattedLocationArray.slice(-1)[0];

        if (
          localCity === (seletedSuggestion.city || seletedSuggestion.name) &&
          localCountry === seletedSuggestion.country
        ) {
          return false;
        }

        const currentLocationArray = constructLocationString(
          seletedSuggestion,
          ","
        ).split(",");

        return (
          JSON.stringify(formattedLocationArray) !==
          JSON.stringify(currentLocationArray)
        );
      });

      const updatedState = [
        {
          activeTab: "home",
          addrData: {
            address:
              type !== SuggestionTypeEnum.COUNTRY
                ? constructLocationString({ city, state, country })
                : "",
            formattedAddress: constructLocationString(
              type === SuggestionTypeEnum.NEARBY
                ? { city, country }
                : seletedSuggestion
            ),
            id,
            name,
            slug,
            type,
          },
          guests: {
            adults: adult,
            children: [],
            childrenVr: child,
            infants: infant,
            rooms: 1,
          },
          startDate: checkIn,
          endDate: checkOut,
        },
        ...filteredState.slice(0, 4),
      ];

      localStorage.setItem(lsKey, JSON.stringify(updatedState));
    },
    [store, getRecentSearch]
  );

  return {
    getRecentSearch,
    updateRecentSearch,
  };
}
