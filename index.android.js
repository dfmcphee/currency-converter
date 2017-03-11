import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import CurrencyConverter from './CurrencyConverter';

export default class Index extends Component {
  render() {
    return (
      <CurrencyConverter />
    );
  }
}

AppRegistry.registerComponent('Index', () => Index);
