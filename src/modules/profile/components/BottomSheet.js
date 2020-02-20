import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity
} from 'react-native';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import SlidingUpPanel from 'rn-sliding-up-panel'

import { calculatePortraitDimension } from '../../../helpers';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import StarRating from 'react-native-star-rating';
import { rateUser } from '../../../actions/PublicUserActions';

import { colors } from '../../../styles';
import PhotosPanel from './PhotosPanel';
import { BlurView } from '@react-native-community/blur'
import RateUserModal from './RateUserModal'
import CommentView from './CommentView'
const { height : deviceHeight } = calculatePortraitDimension();
import * as ACTION_TYPES from '../../../actions/ActionTypes';
import { showAlertWithCallback } from '../../../helpers';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var isModalOpened = false;
class BottomSheet extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          RatingUserModalVisible: false,
          ratedValue: 0,
          viewRef: null
        }
    }
    

    componentWillReceiveProps(nextProps) {
      if( this.props.publicUser.error != nextProps.publicUser.error && nextProps.publicUser.currentAction == ACTION_TYPES.RATE_USER_FAILURE) {
        if(isModalOpened)
        return;
        isModalOpened = true;
        showAlertWithCallback('Whoops', nextProps.publicUser.error, () => {
          isModalOpened = false;
        });

        this.setState({RatingUserModalVisible: false});
      }
    }
    static defaultProps = {
        draggableRange: {
        top: deviceHeight  - getStatusBarHeight() +60,
        bottom: 160
        }
    }

    onStarRatingPress = (rating) => {
      this.setState({ratedValue: rating, RatingUserModalVisible: true})
    
    }

    getRatingSection = ( rating ) => {
      return <View style={{backgroundColor: colors.black, 
        flexDirection: 'row', height: 50, 
        alignItems:'center', justifyContent:'center', marginTop: 16}}>
          <StarRating     
            disabled={false}
            maxStars={5}
            emptyStar="ios-star-outline"
            fullStar="ios-star"
            halfStar="ios-star-half"
            iconSet="Ionicons"
            rating = {rating}
            fullStarColor={colors.red}
            starStyle={{padding:8}}
            selectedStar={(rating => this.onStarRatingPress(rating))}
            starSize={30}
        />
      </View>

    }

    getHivStatusSection = ( hivStatus, date) => {
      return <View style={{backgroundColor: colors.red, 
                           flexDirection: 'row', height: 50, 
                           alignItems:'center', marginTop: 16}}>
          <View style={{flex:3, justifyContent:'center', alignItems:'center', padding: 8}}>
            <Text style={styles.text} numberOfLines={1}>{'HIV STATUS : ' + hivStatus.toUpperCase()}</Text>
          </View>
          <View style={{height: 30, backgroundColor:'white', width:0.5}}/>
          <View style={{flex:2, justifyContent:'center', alignItems:'center', padding: 8}}>
            <Text style={styles.text}>{date.toUpperCase()}</Text>
          </View>

      </View>
    }

    getAboutSection = ( about ) => {
      return <View style={{maxHeight: 150, paddingRight: 16, paddingLeft: 16, 
                           alignSelf:'stretch'}}>
          <Text style={{fontSize: 14, color: 'white'}}>
              {`"${about}"`}
          </Text>                         
      </View>
    }

    getTribesSection = ( tribes ) => {
      let index = 0 ;
      let tribesText = tribes.map(tribe => {
        index++;
        if(index < tribes.length) {
          return tribe.name + ", ";
        }else {
          return tribe.name
        }
      
      })
      return <View style={{alignItems:'center', justifyContent:'center', padding: 16}}>
        <Text style={[styles.text, {lineHeight: 30, textAlign: 'center'}]}>
          {tribesText}
        </Text>
      </View>


    } 
 
    getPhotoSection = ( items, isPublic ) => {
      
      if(!isPublic && ( items.length == 0 ||  (items.length >0 && !(items[0].isAddButton)))) {
        
        items.unshift({isAddButton:true})
      }

      return <PhotosPanel
        items={items}
        onAddPressed={()=>{
          this.props.navigation.navigate("GalleryEdit");
        }}
        onImagePressed={(item)=>{
          console.log(item);
        }}
        showType={'horizontal'}
        navigation={this.props.navigation}
      />
    }

    getStatusSection = (weight, height, bodyType, roleShort, status) => {
      return <View style={{flexDirection:'row', alignItems:'center', margin: 16, height: 60, alignSelf:'stretch'}}>
        <View style={{flex:1, flexDirection:'column', alignItems:'center'}}>
          <View style={{flex:1, flexDirection:'row', alignItems:'center'}}>  
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
              <Text style={styles.text}>{weight}</Text>
            </View>
            <View style={{height: 20, width: 1, backgroundColor:colors.gray}}/>
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
              <Text style={styles.text} numberOfLines={1}>{height}</Text>
            </View>
          </View> 
          <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={styles.text}>{bodyType}</Text>
          </View>
        </View>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <View style={{width: 40, height: 40, borderRadius: 20, justifyContent:'center', alignItems:'center', backgroundColor:colors.red}}>
            <Text style={styles.text}>{roleShort}</Text>
          </View>
        </View>
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <Text style={styles.text}>{status}</Text>
        </View>
        
      </View>

  
    }

     _draggedValue = new Animated.Value(160)
    getOnlineStyle = (onlineStatus) => {
        switch(onlineStatus){
          case 0:
            return styles.offline;
          case 1:
            return styles.online;
          case 2:
            return styles.away;

          default: 
            return styles.online;
        }
    }
    getPanelHeaderView = ( onlineStatus, name, age, rating, isPublic, isBoning, hasPlace) => {
        return <View style={styles.panelHeader}>
            <View style={styles.panelHeaderHandleContainer}>
                <View style={styles.panelHeaderHandle}/>
            </View>

            <View style={{flex: 1, backgroundColor:'black', flexDirection: 'row', alignItems:'flex-start'}}>
                <View style={{flex: 1, flexDirection:'column', alignItems:'flex-start', justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row', alignItems:'center', marginTop: 16}}>
                        <View style={[styles.statusMark, this.getOnlineStyle(onlineStatus), {marginLeft:16}]}/>
                        <Text style={[styles.name, {marginLeft: 16, marginRight:16}]} numberOfLines={1}>{name + ', '+ age}</Text>
                    </View>
                    {
                    hasPlace &&
                    <Text style={[styles.host, {marginLeft: 42, marginTop:4}]}>{'CAN HOST'}</Text>
                     }
                    
                    <View style={{marginLeft: 36, marginBottom:6}}>
                        <StarRating     
                            disabled={true}
                            maxStars={5}
                            emptyStar="ios-star-outline"
                            fullStar="ios-star"
                            halfStar="ios-star-half"
                            iconSet="Ionicons"
                            fullStarColor={colors.red}
                            starStyle={{padding:4}}
                            rating={rating}
                            starSize={20}
                        />
                    </View>
                </View>

                <View style={{flexDirection:'row', width: 100, height:100, alignItems:'center'}}>
                    <View style={{width: 1, height: 48, backgroundColor: colors.darkGray}}/>
                    <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                      {
                        isPublic ?
                        <TouchableOpacity
                          onPress={()=>{
                            if(this.props.onBonePress) {
                              this.props.onBonePress(isBoning)
                            }
                          }}
                          >
                            <Image
                                style={{width: 64 ,height: 64, padding: 8}}
                                resizeMode='contain'
                                source={isBoning? require('../../../../assets/images/boneprofileon.png'): require('../../../../assets/images/boneprofile.png')}
                            />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                          onPress={()=>{
                            this.onProfileEdit();
                          }}
                          >
                            <Image
                                style={{width: 64 ,height: 64, padding: 8}}
                                resizeMode='contain'
                                source={require('../../../../assets/images/edit.png')}
                            />
                        </TouchableOpacity>
                      }

                    </View>
                </View>
                
            </View>
        </View>
    }
   onProfileEdit= () => {
    const{ user } = this.props;
    this.props.navigation.navigate("ProfileEdit", {user: user});
   }
  render() {
    const{ user, gallery, isPublic, ratedValue } = this.props;
    const {top, bottom} = this.props.draggableRange

    const draggedValue = this._draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [0, 1]
    })

    const transform = [{scale: draggedValue}]
    let isBoning = user.userToUser? user.userToUser.isBoning: false

    return (
        <SlidingUpPanel
          showBackdrop={true}
          ref={c => (this._panel = c)}
          snappingPoints={[160,deviceHeight- getStatusBarHeight()+60]}
          draggableRange={this.props.draggableRange}
          animatedValue={this._draggedValue}
          friction={0.1}
         >
         {dragHandler => (
          <View style={styles.panel}>
            <View style={styles.panelHeader} {...dragHandler}>
              {this.getPanelHeaderView(user.onlineStatus, user.username, 
                user.age, user.rating, isPublic, isBoning, user.hasPlace)}
            </View>
            <View style={{flex:1}}>
                <BlurView
                  style={styles.absolute}
                  viewRef={this.state.viewRef}
                  blurType="dark"
                  blurAmount={10}
                />
                <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                  <View style={styles.container}>

                    {this.getStatusSection(user.weight+' kg',
                                          user.height+' cm', 
                                          user.bodyType? user.bodyType.name : "", 
                                          user.role? user.role.abbreviatedName: "", 
                                          user.sexualStatus? user.sexualStatus.name: "")}
                    {gallery && this.getPhotoSection(gallery, isPublic)}
                    {this.getTribesSection(user.tribes)}
                    {
                      user.about != '' &&
                      this.getAboutSection(user.about)
                    }

                    {this.getHivStatusSection(user.hivStatus? user.hivStatus.name : "NONE",  user.lastTestDate || "")}

                    {isPublic && this.getRatingSection(ratedValue)}

                    <CommentView
                      user={user}
                      navigation={this.props.navigation}
                      isPublic={isPublic}
                    />
                    <RateUserModal
                      onRate={(rating)=>{
                        this.props.dispatch(rateUser(this.props.auth.user.id, this.props.user.id, rating));
                        this.setState({RatingUserModalVisible: false});
                      }}
                      onCancel={()=>{
                        this.setState({RatingUserModalVisible: false})
                      }}
                      isVisible={this.state.RatingUserModalVisible}
                      user={user}
                      rating={this.state.ratedValue}
                    />
                  </View>
          
                  </KeyboardAwareScrollView>
            </View>
            
          </View>
         
         )}
          

        </SlidingUpPanel>
    )
  }
}

BottomSheet.proptypes = { 
  user: PropTypes.object.isRequired,
  ratedValue: PropTypes.number,
  gallery: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  onSheetOpening: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  absolute: {
    position: 'absolute',
    left: 0,
    top: 0, 
    right: 0,
    bottom: 0
  },

  text: {
    fontSize: 16,
    color: 'white'
  },

  host: {
    fontSize: 17,
    color: colors.red,
    fontWeight: 'bold'
  },
  name: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold'
  },

  panel: {
    flex:1,
    backgroundColor: 'transparent',
    position: 'relative'
  },
  panelHeader: {
    height: 160,
    alignSelf:'stretch',
  },
  panelHeaderHandleContainer: {

    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    alignSelf:'stretch',
    marginBottom: 30
  },
  panelHeaderHandle: {
    height: 8,
    width: 32,
    backgroundColor: colors.gray
  },
  favoriteIcon: {
    position: 'absolute',
    top: -24,
    right: 24,
    backgroundColor: '#2b8a3e',
    width: 48,
    height: 48,
    padding: 8,
    borderRadius: 24,
    zIndex: 1
  },
  online: {
    backgroundColor: '#39b54a'
  },
  offline: {
    backgroundColor: '#808080'
  },
  away: {
    backgroundColor: '#f7931e'
  },
  statusMark: {
    width: 10,
    height: 10,
    borderRadius: 6,
  },
  blurViewContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, publicUser: state.publicUser });

export default connect(mapStateToProps)(BottomSheet);