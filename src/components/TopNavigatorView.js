import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { colors } from '../styles'
import Icon from 'react-native-vector-icons/FontAwesome';

class TopNavigatorView extends Component {
  render = () => {
    const { title, rightComponent, leftComponent } = this.props;
    return (
        <View style={[styles.container, this.props.containerStyle]}>
            <View style={styles.titleContainer}>
                {   
                    title&&
                    <Text style={styles.title}>{title}</Text>
                }
                
            </View>
            <View style={{flex: 1, alignItems:'center', flexDirection:'row'}}>
                <TouchableOpacity 
                    onPress={()=>{
                        if(this.props.onBackPressed) this.props.onBackPressed();
                    }}
                    >
                    <View style={styles.backContainer}>
                      <Icon name={'angle-left'} color={'white'} size={30} />
                    </View>
            
                </TouchableOpacity>
                <View style= {{flex:1, alignItems:'center', justifyContent:'space-between', flexDirection:'row'}}>
                    { leftComponent || <View style={{width:50, height:50}} /> }
                    { rightComponent || <View style={{width:50, height:50}}/> }
                </View>
                
            </View>
        </View>
    );
  };
}

TopNavigatorView.proptypes = { 
    title: PropTypes.string,
    onBackPressed: PropTypes.func,
    rightComponent: PropTypes.object,
    leftComponent: PropTypes.object,
    containerStyle: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
      height: 50,
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems:'center'
  },
  titleContainer: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center'
  },    
  backContainer: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems:'center'
  },

  title: {
      fontSize: 24,
      fontWeight:'bold',
      color: colors.white
  }
});

export default TopNavigatorView;
