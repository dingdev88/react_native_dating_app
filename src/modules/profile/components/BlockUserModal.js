import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  TextInput,
  Modal
} from 'react-native';

import { colors } from '../../../styles';
import { Button } from '../../../components';
import PropTypes from 'prop-types';

export default class BlockUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            isVisible: props.isVisible
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({isVisible: nextProps.isVisible});
    }
    render() {
        const { user } = this.props;

        const { isVisible } = this.state;
        return <Modal
                isVisible={isVisible}
                hardwareAccelerated
                useNativeDriver
                animationType='slide'
                transparent
                visible={isVisible}
                onRequestClose={() => this.setState({ isVisible: false })}
                style={{ zIndex: 1 }}
            >        
                <View style={styles.dim}>
                    <View style={styles.modalStyle}>
                        <Text style={{marginTop: 16, fontSize: 20, fontWeight: '600', color: colors.red}}> BLOCK USER</Text>
                        <Text style={{marginRight: 24, marginLeft: 24, fontSize: 17, color: colors.black, marginTop:8, alignSelf:'stretch', flex:1}}> 
                            {`You are about to block ${user.username} you need to know that all messages and images in the chat will be deleted and can't be backed up`}
                        </Text>
                        <Button
                            secondary
                            style={{ alignSelf: 'stretch', marginStart: 24, marginEnd: 24, marginBottom :16, marginTop: 16}}
                            caption={'BLOCK'}
                            textColor={'white'}
                            bgColor={colors.red}
                            onPress={() => {
                                this.setState({isVisible: !isVisible})
                                if(this.props.onBlock) {
                                    this.props.onBlock();
                                }
                            }}
                        />
                        <Button
                            secondary
                            style={{ alignSelf: 'stretch', marginStart: 24, marginEnd: 24, marginBottom :16}}
                            caption={'CANCEL'}
                            textColor={'red'}
                            bgColor={'white'}
                            onPress={() => {
                                this.setState({isVisible: !isVisible})
                                this.props.onCancel();
                            }}
                        />
                    </View>
            

                </View>
            </Modal>
    }
}

BlockUserModal.proptypes = { 
    onBlock: PropTypes.func,
    onCancel: PropTypes.func,
    isVisible: PropTypes.bool,
    user: PropTypes.user
};
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    dim: { flex: 1, backgroundColor: 'rgba(33, 33, 33, 0.9)', alignItems:'center', justifyContent:'center' },
    modalStyle: {
        backgroundColor: '#eeeeee',
        width: 350,
        height: 250,
        alignItems: 'center'
    },
})