import React from 'react';
import Title from './components/atoms/Title';
import SearchWrapper from './components/templates/SearchWrapper';
import Layout from './components/templates/Layout';
import Location from './features/location/Location';
import Date from './features/date/Date';
import Guest from './features/guest/Guest';
import Button from './components/atoms/Button';

import { ReactComponent as SearchIcon } from './icons/Magnifying-glass.svg';

const App: React.FC = () => (
  <Layout>
    <Title>Search for the perfect accommodation</Title>
    <SearchWrapper>
      <Location />
      <Date />
      <Guest />
    </SearchWrapper>
    <Button startIcon={<SearchIcon />}>Search</Button>
  </Layout>
);

export default App;
