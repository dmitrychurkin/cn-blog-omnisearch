import React from "react";
import Global from "./context/Global";
import Title from "./components/atoms/Title";
import SearchWrapper from "./components/templates/SearchWrapper";
import Layout from "./components/templates/Layout";
import Location from "./features/location/Location";
import Date from "./features/date/Date";
import Guest from "./features/guest/Guest";
import SearchButton from "./components/organisms/SearchButton";
import { useAppSelector } from "./app/hooks";

const App: React.FC = () => {
  const { date, guest, location } = useAppSelector((state) => state);

  return (
    <Global>
      <Layout>
        <Title>Search for the perfect accommodation</Title>
        <SearchWrapper
          isActive={
            date.currentFocus !== null || guest.isFocus || location.isFocus
          }
        >
          <Location />
          <Date />
          <Guest />
        </SearchWrapper>
        <SearchButton />
      </Layout>
    </Global>
  );
};

export default App;
