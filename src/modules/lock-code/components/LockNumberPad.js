import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { colors } from '../../../styles';
import * as Animatable from 'react-native-animatable';

export default class LockNumberPad extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            lockCode: '',
        }
    }
    _isShaking = false;
    componentDidMount() {
        
    }
    handleViewRef = ref => this.view = ref
    shake = () =>{
        this._isShaking = true;
        this.view.shake(2000).then(endState => {
            this.setState({lockCode: ''})
            this._isShaking = false;
        })
    } 

    getIndicators = () => {
        let indicators = [];
        for(let i=0; i<this.props.lockCodeLength; i++) {
            indicators.push(<View style={i< this.state.lockCode.length ? 
                                            styles.activeIndicatorCircle 
                                            :
                                            styles.inactiveIndicatorCircle
                                        }
                                        key={i+'indicator'}/>)
            
        }
        
        return indicators;
    }
    validate(lockCode) {
        return lockCode == this.props.verifyCode;
    }
    onNumberPressed = (number) => {
        if(this.state.lockCode.length< this.props.lockCodeLength-1) {
            this.setState({lockCode: this.state.lockCode + number})
        }else if(this.state.lockCode.length == this.props.lockCodeLength-1) {
    
            if(this.props.mode == 'verify') {
                if(this.validate(this.state.lockCode + number)) {
                    if(this.props.onVerified) {
                        this.props.onVerified(this.state.lockCode + number);
                    } 
                } else {
                    this.shake();
                }
            } else {
                if(this.props.onCaptured) {
                    this.props.onCaptured(this.state.lockCode + number);
                } 
            }
            this.setState({lockCode: this.state.lockCode + number})

        }

   
    }
    renderNumberIndicator = () => {
        return <View style={styles.numberIndicatorContainer}>
            <Animatable.View ref={this.handleViewRef} 
                            style={{ height: 24, width:200, 
                                     alignItems:'center', justifyContent:'center', 
                                    flexDirection:'row',}}>
            {
             this.getIndicators()
            }
            </Animatable.View>
        </View>
    }

    renderNumberButton = (number) => {
        return <TouchableOpacity onPress={()=>{this.onNumberPressed(number) }}>
            <View style={{width: 72, height: 72, borderWidth: 2, 
                                borderColor: 'white', alignItems:'center',
                                borderRadius: 36, 
                                justifyContent:'center', marginHorizontal:10}} >
                <Text style={{color: 'white', fontSize: 32, fontWeight: '900'}}>
                    {number}
                </Text>
            </View>
        </TouchableOpacity>

    }
    renderRow=(numArray) => {
        return <View style={{height:76, flexDirection:'row', alignSelf:'stretch',
                 alignItems:'center', justifyContent:'center', marginBottom:10}}>
        {
           numArray.map ( (number) =>
                this.renderNumberButton(number)
            )
        }
        </View>
  
    }
    onDelete = () => {
        if(this._isShaking) return;
        if(this.state.lockCode.length  ==  1){
            this.setState({lockCode: ''});
        } else {
            this.setState({lockCode: this.state.lockCode.substring(0, this.state.lockCode.length-1)})
        }   
        if(this.props.onReset) this.props.onReset();
    }
    renderBottom = () => {
        return <View style={{height:76, flexDirection:'row', alignSelf:'stretch', alignItems:'center', justifyContent:'center'}}>
            <View style={{width: 72, height: 72, marginHorizontal:10}}/>
            {this.renderNumberButton(0)}
            <TouchableOpacity style={{width:72, height:72, marginHorizontal:10, justifyContent:'center',alignItems:'center'}} onPress={this.onDelete}>
                <Text style={{color: 'white', fontWeight:'500', fontSize: 20}}> Delete </Text>
            </TouchableOpacity>
        </View>
  
    }
    renderNumberPad = () => {
        return <View style={{flexDirection:'column', alignItems:'center', marginTop: 16, alignSelf:'stretch'}}>
            {this.renderRow([1,2,3])}
            {this.renderRow([4,5,6])}
            {this.renderRow([7,8,9])}
            {this.renderBottom()}
        </View>
    }
    render(){
        return<View style={styles.container}>
            {this.renderNumberIndicator()}
            {this.renderNumberPad()}
        </View>
    }
}

LockNumberPad.proptypes = { 
    onCaptured: PropTypes.func,
    onVerified: PropTypes.func,
    onReset: PropTypes.func,
    mode: PropTypes.string,
    verifyCode: PropTypes.string,
    lockCodeLength: PropTypes.number,

  };
  

const styles = StyleSheet.create({
    container: {
      width: 250,
      height: 450,
      marginTop: 32
    },
    numberIndicatorContainer: {
        height: 24,
        width:250,
        alignItems:'center',
        justifyContent: 'center'
    },
    inactiveIndicatorCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'white',
        marginHorizontal: 8
    },
    activeIndicatorCircle: {
        width:16,
        height:16,
        borderRadius: 8,
        backgroundColor: colors.red,
        marginHorizontal: 8
        
    }
  });
  