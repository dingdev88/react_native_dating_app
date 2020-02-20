import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';
import ListItem from './ListItem';
import Picker from 'react-native-picker';

class NumberRangePickerListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: (props.fromValue != null && props.toValue != null) ? props.fromValue + '-' + props.toValue : ""
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({text: (nextProps.fromValue != null && nextProps.toValue != null) ? nextProps.fromValue + '-' + nextProps.toValue : ""})
  }

  openPicker(){
    const { min, max, fromValue, toValue } = this.props;
    let fromData = [];
    for(let i=min; i<max; i++){
        fromData.push(i);
    }
    let toData = [];
    for(let i=min; i<max; i++){
        toData.push(i);
    }
    let data = [fromData, toData];

    Picker.init({
        pickerData: data,
        selectedValue: [fromValue || min, toValue || max ],
        onPickerConfirm: data => {
          
        },
        onPickerCancel: data => {
           
        },
        onPickerSelect: data => {
            this.setState({text: data[0] +'-'+ data[1]})
            if(this.props.onPickRange) {
              this.props.onPickRange(data[0], data[1]);
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

NumberRangePickerListItem.propTypes = {
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  fromValue: PropTypes.number,
  toValue: PropTypes.number,
  title: PropTypes.string,
  onPickRange: PropTypes.func
};

export default NumberRangePickerListItem;
