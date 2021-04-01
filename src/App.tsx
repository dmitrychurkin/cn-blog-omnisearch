import React from 'react';
import Title from './components/atoms/Title';
import SearchWrapper from './components/templates/SearchWrapper';
import Layout from './components/templates/Layout';
import Location from './features/location/Location';
// import { Counter } from './features/counter/Counter';

const App: React.FC = () => (
  <Layout>
    <Title>Search for the perfect accommodation</Title>
    <SearchWrapper>
      <Location />
    </SearchWrapper>
  </Layout>
);

export default App;
