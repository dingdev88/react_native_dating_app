import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,


} from 'react-native';

import { fonts, colors } from '../../../styles'; 
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { calculatePortraitDimension, showToast } from '../../../helpers'
import ListItemSwitch from './ListItemSwitch'
  
class MultipleItemPickerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        items : props.navigation.getParam('items'),
        title: props.navigation.getParam('title'),
        selectedItems: props.navigation.getParam('selectedItems') ? props.navigation.getParam('selectedItems') : []
    }
  }

  selectItem(isSelected, item) {
    let selectedItems = this.state.selectedItems;
    if(isSelected){
        selectedItems.push(item);
        this.setState({selectedItems});
        console.log("selectedItem", selectedItems);
        if( this.props.navigation.state.params.returnData)
            this.props.navigation.state.params.returnData(selectedItems);
    }else {
        let newItems = [];
        for(let i = 0; i< selectedItems.length; i++ ) {
            if(selectedItems[i].id != item.id) {
                newItems.push(selectedItems[i]);
            }
        }
        this.setState({selectedItems: newItems});
        if( this.props.navigation.state.params.returnData)
            this.props.navigation.state.params.returnData(newItems);
            console.log("selectedItem", newItems);

    }
  }
  checkSelected(item){
    for(let i=0; i<this.state.selectedItems.length; i++){
      if(this.state.selectedItems[i].id == item.id)
      return true;
    }
    return false;
  }

  getImageFromName(name, isOn) {
   
    if(isOn) {
      switch(name){
        case 'Duo':
          return require('../../../../assets/images/lookingfors/duo_on.png');
        case 'Trio':
          return require('../../../../assets/images/lookingfors/trio_on.png');
        case 'Quatro':
          return require('../../../../assets/images/lookingfors/quatro_on.png');
        case 'Quatro+':
          return require('../../../../assets/images/lookingfors/quatroplus_on.png');
        case 'Cam Action':
          return require('../../../../assets/images/lookingfors/camaction_on.png');
        case 'Service':
          return require('../../../../assets/images/lookingfors/service_on.png');                     
        case 'SNM':
          return require('../../../../assets/images/lookingfors/snm_on.png'); 
        case 'XL':
          return require('../../../../assets/images/lookingfors/xl_on.png'); 
        case 'Glory':
          return require('../../../../assets/images/lookingfors/glory_on.png'); 
        case 'Sauna':
          return require('../../../../assets/images/lookingfors/sauna_on.png'); 
        case 'Bear':
          return require('../../../../assets/images/lookingfors/bear_on.png');
        case 'Transformation':
          return require('../../../../assets/images/lookingfors/transformation_on.png');  
        case 'Muscle':
          return require('../../../../assets/images/lookingfors/muscle_on.png');  
        case 'Pig':
          return require('../../../../assets/images/lookingfors/pig_on.png'); 
        case '4:20':
          return require('../../../../assets/images/lookingfors/420_on.png'); 
        case 'Drag':
          return require('../../../../assets/images/lookingfors/drag_on.png');
        case 'Rice':
          return require('../../../../assets/images/lookingfors/rice_on.png');
        case 'Twink':
          return require('../../../../assets/images/lookingfors/twink_on.png');
        default: 
          return  require('../../../../assets/images/lookingfors/duo_on.png');
               
      }
    } else {
      switch(name){
        case 'Duo':
          return require('../../../../assets/images/lookingfors/duo_off.png');
        case 'Trio':
          return require('../../../../assets/images/lookingfors/trio_off.png');
        case 'Quatro':
          return require('../../../../assets/images/lookingfors/quatro_off.png');
        case 'Quatro+':
          return require('../../../../assets/images/lookingfors/quatroplus_off.png');
        case 'Cam Action':
          return require('../../../../assets/images/lookingfors/camaction_off.png');
        case 'Service':
          return require('../../../../assets/images/lookingfors/service_off.png');                     
        case 'SNM':
          return require('../../../../assets/images/lookingfors/snm_off.png'); 
        case 'XL':
          return require('../../../../assets/images/lookingfors/xl_off.png'); 
        case 'Glory':
          return require('../../../../assets/images/lookingfors/glory_off.png'); 
        case 'Sauna':
          return require('../../../../assets/images/lookingfors/sauna_off.png'); 
        case 'Bear':
          return require('../../../../assets/images/lookingfors/bear_off.png');
        case 'Transformation':
          return require('../../../../assets/images/lookingfors/transformation_off.png');  
        case 'Muscle':
          return require('../../../../assets/images/lookingfors/muscle_off.png');  
        case 'Pig':
          return require('../../../../assets/images/lookingfors/pig_off.png'); 
        case '4:20':
          return require('../../../../assets/images/lookingfors/420_off.png'); 
        case 'Drag':
          return require('../../../../assets/images/lookingfors/drag_off.png');
        case 'Rice':
          return require('../../../../assets/images/lookingfors/rice_off.png');
        case 'Twink':
          return require('../../../../assets/images/lookingfors/twink_off.png');
        default: 
          return  require('../../../../assets/images/lookingfors/duo_off.png');
               
      }
    }

  }
  renderItem = ({ item }) => {
    if(item.imageOn && item.imageOff) {
        return <ListItemSwitch
            title={item.name}
            rightIconImageOn={this.getImageFromName(item.name, true)}
            rightIconImageOff={this.getImageFromName(item.name, false)}
            value={this.checkSelected(item)}
            hideText
            onChangeState={(value)=>{
                this.selectItem(value, item);
            }}
            imageStyle={{width: 100}}
        />
    } else {
        return <ListItemSwitch
            title={item.name}
            rightIconImageOn={require('../../../../assets/images/boneoncb.png')}
            rightIconImageOff={require('../../../../assets/images/boneoffcb.png')}
            value={this.checkSelected(item)}
            hideText
            onChangeState={(value)=>{
                this.selectItem(value, item);
            }}
        />
    }


  }

  renderItemList = () => {
    const { items } = this.state;
    console.log("multipleItem", items);
    return (<FlatList
      data={items} renderItem={this.renderItem}
      refreshing={false}
      keyExtractor={(item, index) => index.toString()}
      onRefresh={this.onRefresh}
    />);
  }

  
  render() {

    return (
      <View style={styles.background}>
          <View style={styles.container}>
             {this.renderItemList()}
          </View>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    marginBottom: getBottomSpace()
  },
  background: {
    flex: 1,
    backgroundColor: 'black'
  },
  
  text: {
    fontSize: 14,
    color: 'white'
  },

  textArea: {
    borderRadius: 4,
    padding: 8,
    borderColor: colors.lightGray,
    color: colors.black,
    backgroundColor: 'white',
    fontSize: 14,
    marginTop: 16,
    borderWidth: 1,
    minHeight: 120,
    flex:1,
    alignSelf:'stretch',
    marginBottom: 16
  }
});

export default MultipleItemPickerView;