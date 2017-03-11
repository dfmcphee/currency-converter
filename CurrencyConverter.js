import React, { Component } from 'react';
import {
  ActivityIndicator,
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

import {fetchRates} from './ratesService';
import CurrencyPicker from './CurrencyPicker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    height: 64,
    padding: 16,
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16
  },
  textInput: {
    fontSize: 24,
    height: 64,
    width: '100%',
    padding: 16,
    color: 'black',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 16,
  },
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

function calculateRate(input, inputRate, outputRate) {
  const exchangeRate = inputRate / outputRate;
  return (input * exchangeRate);
}

export default class CurrencyConverter extends Component {

  constructor(props) {
    super(props);

    fetchRates((rates) => {
      this.setState({
        rates,
        loading: false,
        inputValue: '1.00',
        outputValue: rates.get('USD').rate.toFixed(2).toString(),
        dataSource: dataSource.cloneWithRows(Array.from(rates.values())),
      });
    });

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.code !== r2.code
    });

    this.state = {
      loading: true,
      inputCurrency: 'CAD',
      outputCurrency: 'USD',
      activeCurrency: false,
      inputValue: '0.00',
      outputValue: '0.00',
      rates: new Map(),
      dataSource: dataSource.cloneWithRows([]),
    }
  }

  converter() {
    if (this.state.loading) { return null; }

    const rateOptions = [...this.state.rates.values()].map((rate) => {
      return (
        <Picker.Item key={rate.code} label={rate.code} value={rate.code} />
      );
    });

    return(
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          underlineColorAndroid="transparent"
          onChangeText={(inputValue) => {
            const inputRate = this.state.rates.get(this.state.inputCurrency);
            const outputRate = this.state.rates.get(this.state.outputCurrency);
            const calculatedRate = calculateRate(parseFloat(inputValue), inputRate.rate, outputRate.rate);
            const outputValue = Number.isNaN(calculatedRate) ? '0.00' : calculatedRate.toFixed(2).toString()
            this.setState({
              inputValue,
              outputValue
            });
          }}
          value={this.state.inputValue}
        />
        <TouchableHighlight style={styles.picker}
          onPress={() => this.setState({activeCurrency: 'input'})}>
          <Text>{this.state.inputCurrency}</Text>
        </TouchableHighlight>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          underlineColorAndroid="transparent"
          onChangeText={(outputValue) => {
            const inputRate = this.state.rates.get(this.state.inputCurrency);
            const outputRate = this.state.rates.get(this.state.outputCurrency);
            const inputValue = calculateRate(parseFloat(outputValue), inputRate.rate, outputRate.rate);
            this.setState({
              inputValue: inputValue.toFixed(2).toString(),
              outputValue
            });
          }}
          value={this.state.outputValue}
        />
        <TouchableHighlight style={styles.picker}
          onPress={() => this.setState({activeCurrency: 'output'})}>
          <Text>{this.state.outputCurrency}</Text>
        </TouchableHighlight>
      </View>
    );
  }

  loader() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating={this.state.loading}
            color="#9f9f9f"
            size="large"
          />
        </View>
      );
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.loader()}
        {this.converter()}
        <CurrencyPicker
          visible={this.state.activeCurrency !== false}
          dataSource={this.state.dataSource}
          selectCurrency={(code) => {
            let inputCurrency = this.state.inputCurrency;
            let outputCurrency = this.state.outputCurrency;
 
            if (this.state.activeCurrency === 'input') {
              inputCurrency = code;
            } else {
              outputCurrency = code;
            }

            const inputValue = parseFloat(this.state.inputValue);
            const inputRate = this.state.rates.get(inputCurrency);
            const outputRate = this.state.rates.get(outputCurrency);
            const outputValue = calculateRate(inputValue, inputRate.rate, outputRate.rate);

            this.setState({
              activeCurrency: false,
              inputCurrency,
              outputCurrency,
              outputValue: outputValue.toFixed(2).toString(),
            });
          }}
        />
      </View>
    );
  }
}

AppRegistry.registerComponent('CurrencyConverter', () => CurrencyConverter);
