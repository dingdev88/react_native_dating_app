import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  FlatList,
  TouchableOpacity
} from 'react-native';

import PropTypes from 'prop-types';
import { colors } from '../../../styles';
import { ImageView } from '../../../components';

import { calculatePortraitDimension } from '../../../helpers';
const { height : deviceHeight } = calculatePortraitDimension();


class PhotosPanel extends React.Component {

    constructor(props) {
      super(props);
      this.state={
        selectedItems : [],
        items: props.items
      }
    }
    componentWillReceiveProps(nextProps) {
      this.setState({items: nextProps.items})
    }

    changeSelection(touchedItem) {
      if(!this.checkSelected(touchedItem)) {
        let items = this.state.selectedItems;
        items.push(touchedItem);
        this.setState({selectedItems: items})
        if(this.props.onSelectionChanged) {
            this.props.onSelectionChanged(items)
        }
      }else {
          let newItems = [];
          this.state.selectedItems.map(item =>{
              if(item.id != touchedItem.id)
              newItems.push(item);
          })
          this.setState({selectedItems: newItems})
          if(this.props.onSelectionChanged) {
              this.props.onSelectionChanged(newItems)
          }
      }
    }
    checkSelected = (touchedItem) => {
      let selectedItems = this.state.selectedItems;
      for(let i=0; i<selectedItems.length; i++) {
       if(selectedItems[i].id == touchedItem.id)
        return true;
      }
      return false;
    }

    getImageItem = (item) => {
        const { smallImageUrl, bigImageUrl } = item;
        let isPrivate = item.isPrivate;
        let isAddButton = item.isAddButton;
        let touchedItem = item;
        let isSelected = this.checkSelected(touchedItem);
          return <TouchableOpacity
            onPress={()=>{
              if(isAddButton) {
                if(this.props.onAddPressed)
                  this.props.onAddPressed()
   
              }else {
                if(this.props.onImagePressed)
                  this.props.onImagePressed(item);
                if(!this.props.selectable) {
                  this.props.navigation.navigate("PhotoModal", {shortUrl: bigImageUrl})
                }else {
                  this.changeSelection(item)
                }
              }

            }}
          >
          <View style={[styles.itemContainerStyle, 
                      { justifyContent: 'center', alignItems:'center'}, 
                      this.props.itemContainerStyle,  isPrivate ? {backgroundColor:'white'}: null]}>

            {
                isAddButton ?
                    <ImageView 
                        style={styles.iconStyle} 
                        source={require('../../../../assets/images/plus_pic.png')}/>
                : 
                isPrivate ? <ImageView 
                        style={styles.iconStyle} 
                        source={require('../../../../assets/images/lock.png')}/>
                : <ImageView
                  style={[styles.itemContainerStyle, this.props.itemContainerStyle, {margin:0}]}
                  shortUrl={smallImageUrl}
                  resizeMode='cover'
                />
            }
            {
                (this.props.selectable && isSelected) && 
                <View style={{backgroundColor:'rgba(255,0,0, 0.3)', position:'absolute', left:0, top:0, right:0, bottom: 0}}/>
            }
          </View>
          </TouchableOpacity>

         
    }
    renderItem = ({ item }) => {
        return this.getImageItem(item);
    }
    
    renderHorizonalUsers = () => {
        const { items } = this.state;
        return (
          this.props.showType == 'horizontal' ? 
            <FlatList
                data={items} renderItem={this.renderItem}
                refreshing={false}
                keyExtractor={(item, index) => index.toString()}
                onRefresh={this.onRefresh}
                horizontal = {true}
                key={'horizontal'}
                extraData={this.state} 
                style={{backgroundColor:'black'}}
            />
            :
            <FlatList
              data={items} renderItem={this.renderItem}
              refreshing={false}
              keyExtractor={(item, index) => index.toString()}
              onRefresh={this.onRefresh}
              numColumns={3}
              key={'grid'}
              extraData={this.state} 
              style={{backgroundColor:'black'}}
            />
        );
      }
    render() {
        return (<View>
          {this.renderHorizonalUsers()}
        </View>);
    }

}

PhotosPanel.proptypes = { 
    itemContainerStyle: PropTypes.object,
    navigation: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired,
    onAddPressed: PropTypes.func,
    onImagePressed: PropTypes.func,
    selectable: PropTypes.bool,
    onSelectionChanged: PropTypes.func,
    horizontal: PropTypes.bool,
    showType: PropTypes.string,
    

};

const styles = StyleSheet.create({
    itemContainerStyle: {
      width : 80,
      margin: 8,
      height: 80,
      backgroundColor: colors.darkGray
    },

    iconStyle: {
      width : 40,
      height: 40
    }
  
});

export default PhotosPanel
  