import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';
import ListItem from './ListItem';
import Picker from 'react-native-picker';

class ItemPickerListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.value || ''
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({text: nextProps.value})
  }

  findItemWithName(name) {
    const { items } = this.props;
      for(let i=0; i< items.length; i++) {
          if(items[i].name == name) {
            return items[i];
          }
     
      }
      return null;
  }
  openPicker(){
    const { items, value } = this.props;
    let data = [];
    for(let i=0; i<items.length; i++){
        data.push(items[i].name);
    }

    Picker.init({
        pickerData: data,
        selectedValue: [value],
        onPickerConfirm: data => {
          
        },
        onPickerCancel: data => {
           
        },
        onPickerSelect: data => {
            this.setState({text: data})
             let item = this.findItemWithName(data);
            if(item && this.props.onPickItem) {
              this.props.onPickItem(item);
            }
        },
        pickerConfirmBtnText: 'Done',
        pickerCancelBtnText: '',
        pickerTitleText: ''
    });
    Picker.show();
  }

  render() {
    return (
        <ListItem
          text={this.state.text}
          title={this.props.title}
          onItemPress={() => {
            console.log("onItemPress")
            this.openPicker();
          }}
        />
    );
  }
}

ItemPickerListItem.propTypes = {
  value: PropTypes.string,
  items: PropTypes.array,
  title: PropTypes.string,
  onPickItem: PropTypes.func
};

export default ItemPickerListItem;
