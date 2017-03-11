import React, { Component } from 'react';
import {
  ListView,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';


const styles = StyleSheet.create({
  listHeader: {
    padding: 16,
    fontSize: 24
  },
  listItem: {
    padding: 16,
    borderColor: 'gray',
    borderTopWidth: 1,
    width: '100%',
  },
});

export default class CurrencyPicker extends Component {
  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.props.visible}
        onRequestClose={() => {alert("Picker has been closed.")}}
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
              return (
                <TouchableHighlight
                  style={styles.listItem}
                  onPress={() => this.props.selectCurrency(rowData.code)}>
                  <Text>{rowData.code}</Text>
                </TouchableHighlight>
              );
            }}
          />
        </View>
      </Modal>
    );
  }
}
