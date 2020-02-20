import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, View, } from 'react-native';
import ListItem from './ListItem';
import Picker from 'react-native-picker';

class DatePickerListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.value 
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({text: nextProps.value})
  }

  getShortMonth(longMonth) {
        switch(longMonth) {
            case 'January': return 'Jan';
            case 'February': return 'Feb';
            case 'March': return 'Mar';
            case 'April': return 'April';
            case 'May': return 'May';
            case 'June': return 'Jun';
            case 'August': return 'Aug';
            case 'September': return 'Sep';
            case 'October': return 'Oct';
            case 'November': return 'Nov';
            case 'December': return 'Dec'
        }
  }
  getLongMonth(shortMonth) {
        switch(shortMonth) {
            case 'Jan': return 'January';
            case 'Feb': return 'February';
            case 'Mar': return 'March';
            case 'April': return 'April';
            case 'May': return 'May';
            case 'Jun': return 'June';
            case 'Aug': return 'August';
            case 'Sep': return 'September';
            case 'Oct': return 'October';
            case 'Nov': return 'November';
            case 'Dec': return 'December'
        }
  }
  openPicker(){
    const { minYear, maxYear, value } = this.props;
    var selectedYear = minYear;
    var selectedMonth = 'January'
    if(value && value != '') {
        let strs = value.split(" ");
        if(strs.length == 2) {
            selectedYear = Number(value.split(" ")[1])
            selectedMonth = getLongMonth(value.split(" ")[0]) 
        }
    }
    let year = [];
    for(let i=minYear; i<maxYear; i++){
        year.push(i);
    }
    let month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December']
    let data = [year, month];
    Picker.init({
        pickerData: data,
        selectedValue: [selectedYear, selectedMonth],
        onPickerConfirm: data => {
          
        },
        onPickerCancel: data => {
           
        },
        onPickerSelect: data => {
           let dateString = this.getShortMonth(data[1]) + ' ' + data[0];
           this.setState({text: dateString})
            if(this.props.onPickDate) {
              this.props.onPickDate(dateString);
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

DatePickerListItem.propTypes = {
  maxYear: PropTypes.number.isRequired,
  minYear: PropTypes.number.isRequired,
  value: PropTypes.string,
  title: PropTypes.string,
  onPickDate: PropTypes.func
};

export default DatePickerListItem;
