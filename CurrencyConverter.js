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
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
  Linking,
} from 'react-native';

import {fetchRates} from './ratesService';
import CurrencyPicker from './CurrencyPicker';
import currencyMetadata from './CurrencyMetadata';

const highlightColor = '#ececec';
const borderColor = '#c2c2c2';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    height: 52,
    padding: 8,
    borderColor: borderColor,
    borderWidth: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  textInput: {
    fontSize: 24,
    width: '100%',
    padding: 8,
    color: 'black',
    borderColor: borderColor,
    borderWidth: 1,
    marginTop: 8,
  },
});

const currency = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flag: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  label: {
    fontSize: 16
  }
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
      keyboardVisible: false,
    }
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow () {
    this.setState({
      keyboardVisible: true,
    });
  }

  keyboardDidHide () {
    this.setState({
      keyboardVisible: false,
    });
  }

  title() {
    if (this.state.keyboardVisible) {
      return null;
    }
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 20,
        width: '100%',
      }}>
        <Text style={{fontSize: 28, fontWeight: '600'}}>Currency Converter</Text>
      </View>
    );
  }

  footer() {
    if (this.state.keyboardVisible) {
      return null;
    }
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
      }}>
        <Text style={{fontSize: 14, margin: 8}}>Rates provided by the Bank of Canada</Text>
        <TouchableHighlight
          onPress={this.showTerms}
          underlayColor={highlightColor}
        >
          <Text style={{fontSize: 12, padding: 8}}>View terms and conditions</Text>
        </TouchableHighlight>
      </View>
    );
  }

  converter() {
    if (this.state.loading) { return null; }

    const rateOptions = [...this.state.rates.values()].map((rate) => {
      const label = currencyMetadata[rate.code] ? currencyMetadata[rate.code].label : rate.code;
      return (
        <Picker.Item key={rate.code} label={label} value={rate.code} />
      );
    });

    return(
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {this.title()}
          <View style={styles.inner}> 
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              keyboardAppearance="dark"
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
              onPress={() => this.setState({activeCurrency: 'input'})}
              underlayColor={highlightColor}
            >
              <View style={currency.container}>
                <Image style={currency.flag}
                  source={currencyMetadata[this.state.inputCurrency].flag}
                />
                <Text style={currency.label}>{currencyMetadata[this.state.inputCurrency].label}</Text>
              </View>
            </TouchableHighlight>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              keyboardAppearance="dark"
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
              onPress={() => this.setState({activeCurrency: 'output'})}
              underlayColor={highlightColor}
            >
              <View style={currency.container}>
                <Image
                  style={currency.flag}
                  source={currencyMetadata[this.state.outputCurrency].flag}
                />
                
                <Text style={currency.label}>{currencyMetadata[this.state.outputCurrency].label}</Text>
              </View>
            </TouchableHighlight>
          </View>
          {this.footer()}
        </View>
      </TouchableWithoutFeedback>
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

  showTerms() {
    Linking.openURL('http://www.bankofcanada.ca/terms/').catch(err => console.error('An error occurred', err));
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
