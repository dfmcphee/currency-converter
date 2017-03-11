import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  Picker,
  TextInput,
  View,
  ListView,
  Modal,
  TouchableHighlight
} from 'react-native';

import CurrencyConverter from './CurrencyConverter';

export default class Index extends Component {
  render() {
    <CurrencyConverter />
  }
}

AppRegistry.registerComponent('Index', () => Index);
