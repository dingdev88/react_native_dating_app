import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';
import ListItem from './ListItem';
import Picker from 'react-native-picker';

class NumberPickerListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.value || props.min
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({text: nextProps.value})
  }

  openPicker(){
    const { min, max, value } = this.props;
    let data = [];
    for(let i=min; i<max; i++){
        data.push(i);
    }

    Picker.init({
        pickerData: data,
        selectedValue: [value || min],
        onPickerConfirm: data => {
          
        },
        onPickerCancel: data => {
           
        },
        onPickerSelect: data => {
            this.setState({text: data})
            if(this.props.onPickNumber) {
              this.props.onPickNumber(data);
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
          {...this.props}
          onItemPress={() => {
            console.log("onItemPress")
            this.openPicker();
          }}
        />
    );
  }
}

NumberPickerListItem.propTypes = {
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  value: PropTypes.number,
  title: PropTypes.string,
  onPickNumber: PropTypes.func
};

export default NumberPickerListItem;
