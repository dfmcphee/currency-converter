import React, { Component } from 'react';
import {
  ListView,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
} from 'react-native';

import currencyMetadata from './CurrencyMetadata';

const styles = StyleSheet.create({
  listHeader: {
    padding: 16,
    fontSize: 24
  },
  listItem: {
    padding: 8,
    paddingLeft: 16,
    borderColor: '#c2c2c2',
    borderTopWidth: 1,
    width: '100%',
  },
  currency: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default class CurrencyPicker extends Component {
  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.props.visible}
        onRequestClose={() => {}}
        >
        <View style={{marginTop: 22}}>
          <ListView
            dataSource={this.props.dataSource}
            renderHeader={() => {
              return (
                <Text style={styles.listHeader}>Choose a currency</Text>
              )
            }}
            renderRow={(rowData) => {
              if (!rowData || !currencyMetadata[rowData.code]) {
                return null;
              }
              return (
                <TouchableHighlight
                  style={styles.listItem}
                  underlayColor="#ececec"
                  onPress={() => this.props.selectCurrency(rowData.code)}>
                  <View style={styles.currency}>
                    <Image style={{width: 32, height: 32, marginRight: 8,}}
                      source={currencyMetadata[rowData.code].flag}
                    />
                    <Text>{currencyMetadata[rowData.code].label}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
          />
        </View>
      </Modal>
    );
  }
}
