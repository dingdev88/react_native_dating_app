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

import {connect} from 'react-redux'

import { colors } from '../../../styles';
import { Button } from '../../../components';
import PropTypes from 'prop-types';

import StarRating from 'react-native-star-rating';



export class RateUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            isVisible: props.isVisible,
            rating: props.rating,
        }
    }
    
    
    componentWillReceiveProps(nextProps) {

        this.setState({isVisible: nextProps.isVisible});
  
     
    }
    onSelect(title) {
        this.setState({selectedReason: title})
    }
    onRate() {
        
        this.setState({isVisible: false});
        if(this.props.onRate) {
            this.props.onRate(this.props.rating);
        }
    }
    getRatingString(rating) {
        switch(rating) {
            case 0: return 'zero star';
            case 1: return 'one star';
            case 2: return 'two stars';
            case 3: return 'three stars';
            case 4: return 'four stars';
            case 5: return 'five stars';
            default: return 'one star';

        }
    }
    render() {
        const { user, rating } = this.props;
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
                    <TouchableOpacity  style={{position:'absolute', left:0, top:0, right:0, bottom:0, backgroundColor:'transparent'}} 
                        onPress={() => {
                        this.setState({isVisible: false})  
                    }}/>
                    <View style={styles.modalStyle}>
                        <Text style={{marginTop: 32, fontSize: 20, fontWeight: '600', color: colors.red}}>RATE PROFILE</Text>
                        
                        <Text style={{marginTop: 16, marginLeft:24, marginRight:24, numberOfLines:2, textAlign:'center',fontSize: 14, color:colors.lightGray2}}>
                            {`You just rated ${user.username} ${this.getRatingString(rating)},  are you sure about your rate?`}
                        </Text>
                        <StarRating     
                            disabled={true}
                            maxStars={5}
                            emptyStar="ios-star-outline"
                            fullStar="ios-star"
                            halfStar="ios-star-half"
                            iconSet="Ionicons"
                            rating = {rating}
                            fullStarColor={colors.red}
                            starStyle={{padding:8}}
                            starSize={30}
                        />
                        <Button
                            secondary
                            style={{ alignSelf: 'stretch', marginStart: 24, marginEnd: 24, marginBottom :32, marginTop: 16}}
                            caption={'YES AM SURE'}
                            textColor={'white'}
                            bgColor={colors.red}
                            onPress={() => {
                                this.onRate();
                            }}
                        />

                    </View>
            

                </View>
            </Modal>
    }
}

RateUserModal.proptypes = { 
    onRate: PropTypes.func,
    isVisible: PropTypes.bool,
    user: PropTypes.user,
    rating: PropTypes.number
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

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, publicUser: state.publicUser });

export default connect(mapStateToProps)(RateUserModal);