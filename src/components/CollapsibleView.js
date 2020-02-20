import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '../styles';

export default class CollapsibleView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            collapsed : true
        }
    }

    
    render() {
        const { containerStyle, textStyle,
                collapseButtonStyle, title, 
                collapseText, viewAllText, 
                getComponent } = this.props;
        return (
            <View style={[styles.container, containerStyle]}>
                <View style={styles.header}>
                    <Text style={[styles.text, textStyle]}>{title}</Text>
                    <TouchableOpacity
                        onPress={()=>{
                            this.setState({collapsed: !this.state.collapsed})
                        }}
                    >
                        <Text style={[styles.collapseButton, collapseButtonStyle]}>
                            { !this.state.collapsed? (collapseText ? collapseText :'Collapse >') : (viewAllText? viewAllText : 'View all >')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    {
                        getComponent &&
                            getComponent(this.state.collapsed)
                    }
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        padding: 16
    },
    content: {
        alignSelf: 'stretch',
        marginTop: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 13,
        color: colors.red
    },
    collapseButton: {
        fontSize: 13,
        color: colors.lightGray
    }

    

});