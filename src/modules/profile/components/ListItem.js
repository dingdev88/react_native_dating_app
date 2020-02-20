import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';

import PropTypes from 'prop-types';
import { colors } from '../../../styles';

export default class ListItem extends React.Component {
    onItemPress = () => {
        if(this.props.onItemPress)
            this.props.onItemPress();
    }
    render () {
        const { title, text, rightIconImage } = this.props; 

        return (
            <TouchableOpacity
            onPress={()=>{
                this.onItemPress();
            }}
            >
            <View style={[styles.itemContainerStyle, this.props.itemContainerStyle]}>
                <Text style={styles.title}>{title}</Text>
                {
                ((text != undefined && text != "") || rightIconImage) &&
                <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'flex-end', marginRight:0, marginLeft:8, flex:1}}>
                    {
                        (text != undefined && text != "") &&
                         <Text style= {[styles.text, {paddingRight: 16, paddingLeft: 16, flex:1, textAlign:'right' }]} numberOfLines={1}>{text}</Text>
                    }
                    {
                        rightIconImage && 
                        <Image source={rightIconImage}  style={{width: 24, height:24}}/>
                    }
 
                </View>
                }

            </View>
            </TouchableOpacity>
        )
    }

}

ListItem.proptypes = { 
  title: PropTypes.object.isRequired,
  text: PropTypes.string,
  rightIconImage: PropTypes.object,
  onItemPress: PropTypes.func

};

const styles = StyleSheet.create({
    itemContainerStyle: {
        height: 48,
        backgroundColor: 'black',
        marginLeft: 16,
        marginRight: 16,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: colors.darkGray
    },
    title: {
        fontSize: 17,
        color: 'white'
    },
    text: {
        fontSize: 17,
        color: colors.red
    }
});
