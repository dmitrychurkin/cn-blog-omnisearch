import React from 'react';
import Title from './components/atoms/Title';
import SearchWrapper from './components/templates/SearchWrapper';
import Layout from './components/templates/Layout';
import Location from './features/location/Location';
import Date from './features/date/Date';
import Guest from './features/guest/Guest';

const App: React.FC = () => (
  <Layout>
    <Title>Search for the perfect accommodation</Title>
    <SearchWrapper>
      <Location />
      <Date />
      <Guest />
    </SearchWrapper>
  </Layout>
);

export default App;
