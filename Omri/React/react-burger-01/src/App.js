import React, { Component } from 'react';

import Layout from './components/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Layout>
            <BurgerBuilder/>
          </Layout>
        </div>
    </MuiThemeProvider>
      
    );
  }
}

export default App;
