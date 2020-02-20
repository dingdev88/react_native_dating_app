import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import PropTypes from 'prop-types';
import { colors } from '../../../styles';

export default class SectionTitleItem extends React.Component {
    render () {
        const { title } = this.props; 
        return (
            <View style={[styles.itemContainerStyle, this.props.itemContainerStyle]}>
                <Text style={styles.title}>{title}</Text>
            </View>
        )
    }

}

SectionTitleItem.proptypes = { 
  title: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
    itemContainerStyle: {
        height: 32,
        backgroundColor: 'black',
        marginRight: 16,
        marginLeft: 16,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.darkGray
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    }
  
});
