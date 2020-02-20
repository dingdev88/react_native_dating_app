import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';

import { colors } from '../../../styles';
import { Button } from '../../../components';
import PropTypes from 'prop-types';
import { showToast } from '../../../helpers';

export default class ReportUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            isVisible: props.isVisible,
            selectedReason : null,
            otherReason : ''
        }
    }

    getReasonItem = (title, selected, hiddenIcon = false) => {
        return <TouchableOpacity style={{alignSelf:'stretch', marginLeft:24, marginRight:24, height: 40}} onPress={()=>{
            this.onSelect(title);
        }}>
            <View style={{flex: 1, alignItems:'center', flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{fontSize: 17, color: selected? colors.red : colors.lightGray2}}>{title}</Text>
                {
                    hiddenIcon ?
                    <View/>
                    :
                    <Image style={{width:24, height:24}} 
                            source={selected? require('../../../../assets/images/boneoncb.png'): 
                                              require('../../../../assets/images/boneoffcb_gray.png')}/>
                }
                
            </View>
        </TouchableOpacity>
          
    }
    componentWillReceiveProps(nextProps) {
        if(this.state.isVisible == false && nextProps.isVisible == true) {
            this.setState({selectedReason: null, otherReason: ''})
        }
        this.setState({isVisible: nextProps.isVisible});
        
    }
    onSelect(title) {
        this.setState({selectedReason: title})
    }
    onReport() {
        const {selectedReason, otherReason, isVisible} = this.state;
        if(!selectedReason) {
            showToast('Please choose one of the reasons.')
            return;
        }
        if(selectedReason == 'OTHER' && otherReason == '') {
            showToast('Please write a comment.')
            return;
        }
        this.setState({isVisible: !isVisible})
        if(this.props.onReport) {
            this.props.onReport(selectedReason, otherReason);
        }
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
                    <TouchableOpacity style={{position:'absolute', left:0, top:0, right:0, bottom:0, backgroundColor:'transparent'}} onPress={() => {
                        this.setState({isVisible: false})  
                        if(this.props.onCancel){
                            this.props.onCancel();
                        }
                    }}>
                    </TouchableOpacity>
                    <View style={styles.modalStyle}>
                        <Text style={{marginTop: 16, fontSize: 20, fontWeight: '600', color: colors.red}}>REPORT PROFILE</Text>
                        
                        {this.getReasonItem('RACIST', this.state.selectedReason == 'RACIST')}
                        {this.getReasonItem('HARASSMENT', this.state.selectedReason == 'HARASSMENT')}
                        {this.getReasonItem('SEXUAL PICTURES', this.state.selectedReason == 'SEXUAL PICTURES')}
                        {this.getReasonItem('FRAUD', this.state.selectedReason == 'FRAUD')}
                        {this.getReasonItem('OTHER', this.state.selectedReason == 'OTHER', true)}
                        <TextInput
                            style={styles.textArea}
                            multiline
                            numberOfLines={4}
                            underlineColorAndroid='transparent'
                            placeholderTextColor={colors.lightGray2}
                            placeholder={'WRITE TEXT HERE'}
                            value={this.state.otherReason}
                            onChangeText={(text) => {
                            this.setState({ otherReason: text });
                            }}
                        />
                        <Button
                            secondary
                            style={{ alignSelf: 'stretch', marginStart: 24, marginEnd: 24, marginBottom :32, marginTop: 16}}
                            caption={'REPORT'}
                            textColor={'white'}
                            bgColor={colors.red}
                            onPress={() => {
                                this.onReport();
                            }}
                        />

                    </View>
            

                </View>
            </Modal>
    }
}

ReportUserModal.proptypes = { 
    onReport: PropTypes.func,
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
        height: 480,
        alignItems: 'center'
    },
    textArea: {
        padding: 8,
        color: colors.black,
        backgroundColor: 'white',
        fontSize: 14,
        marginStart: 24,
        marginEnd: 24,

        minHeight: 120,
        flex:1,
        alignSelf:'stretch',
        marginBottom: 16
      }
})