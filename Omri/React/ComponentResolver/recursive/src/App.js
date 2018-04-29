import React, { Component } from 'react';

import message from './Components/Message/Message';

import {graphql} from 'react-apollo';

const Root = message({"id":"5aa4cafcf36d28237f19be88"});

class App extends Component {

  render() {
    return <Root />;
  }
}

export default App;
