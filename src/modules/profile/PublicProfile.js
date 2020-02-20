import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  Platform,
  TouchableOpacity
} from 'react-native';


import { connect } from 'react-redux';

import { calculatePortraitDimension, showAlert } from '../../helpers';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import BottomSheet from './components/BottomSheet';
import { ImageView, TopNavigatorView, LoadingOverlay } from '../../components';
import { loadUserProfile, blockUser,unblockUser,
          boneUser,unboneUser, watchUser,unwatchUser, reportUser } from '../../actions/PublicUserActions'; 
import BlockUserModal from './components/BlockUserModal';
import ReportUserModal from './components/ReportUserModal';
const { height : deviceHeight } = calculatePortraitDimension();
import * as ACTION_TYPES from '../../actions/ActionTypes';
import StarRating from 'react-native-star-rating';

class PublicProfile extends React.Component {
  
  constructor(props) {
    super(props);
    this.state={
        userId: this.props.navigation.getParam('userId'),
        user: {},
        gallery: [],
        isBlockUserVisible: false,
        isReportUserVisible: false,
        floatButtonVisible: true
    }

  }
  componentWillReceiveProps(nextProps) {
    if(this.props.publicUser.error != nextProps.publicUser.error && nextProps.publicUser.currentAction == ACTION_TYPES.REPORT_USER_FAILURE) {
      showAlert('Whoops', nextProps.publicUser.error);
    }
  }

  componentDidMount() {
    this.props.dispatch(loadUserProfile(this.props.auth.user.id, this.state.userId))
  }
  onEyePress = (isWatching) => {
    if(isWatching)
        this.props.dispatch(unwatchUser(this.props.auth.user.id, this.state.userId))
    else
        this.props.dispatch(watchUser(this.props.auth.user.id, this.state.userId))
  }
  onBlockPress = (isBlocking) => {
    if(!isBlocking) {
        //show block dialog
        this.setState({isBlockUserVisible: true})
    }
  }
  onBonePress = (isBoning) => {
    if(isBoning) {
        this.props.dispatch(unboneUser(this.props.auth.user.id, this.state.userId))
    }else {
        this.props.dispatch(boneUser(this.props.auth.user.id, this.state.userId))
    }
  }
  onChatPress = () => {

  }
  onReportProfile = () => {
    //show report dialog
    this.setState({isReportUserVisible: true})
  }
  getRightComponent = (isBlocking, isWatching) => {
    return <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
          <TouchableOpacity 
            style={{ alignItems:'center', justifyContent: 'center', width: 40, height:40, marginRight: 36}}
            onPress={()=>{
              this.onBlockPress(isBlocking);
            }}>
            <Image style={styles.icon} source={require('../../../assets/images/block.png')}/>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ alignItems:'center', justifyContent: 'center', width: 40, height:40, marginRight: 16}}
            onPress={()=>{
              this.onEyePress(isWatching);
            }}>
            <Image style={styles.icon} source={isWatching ? require('../../../assets/images/eyeon.png') : require('../../../assets/images/eyeoff.png')}/>
          </TouchableOpacity>
    </View>
  }

  getFloatButtons = () => {
      return <View style={{position:'absolute', right: 16, bottom: 160, flexDirection: 'column', 
                           height: 180, width: 60, 
                           justifyContent:'space-between', alignItems:'center' }}>
          <TouchableOpacity 
            style={{ alignItems:'center', justifyContent: 'center', width: 60, height:60}}
            onPress={()=>{
              this.onReportProfile();
            }}>
            <Image style={{width:60, height:60}} source={require('../../../assets/images/report_profile.png') }/>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ alignItems:'center', justifyContent: 'center', width: 60, height:60}}
            onPress={()=>{
              this.onChatPress();
            }}>
            <Image style={{width:60, height:60}} source={ require('../../../assets/images/chatprofile.png') }/>
          </TouchableOpacity>

      </View>
  }
  getTopNavigator = (isBlocking, isWatching) => {
    return <TopNavigatorView
      containerStyle={{marginTop:16}}
      onBackPressed = {() => {
        this.props.navigation.goBack();
      }}
      rightComponent={this.getRightComponent(isBlocking, isWatching)}
    />
  }
  getLoading = () => {
    const {publicUser} =this.props;
    return <View style={styles.container}>
      <LoadingOverlay visible={publicUser.isLoading}/>
    </View>
  }

  getContent = (user, userToUser, gallery, ratedValue) =>{
      let isBlocking = userToUser ? userToUser.isBlocking : false;
      let isWatching = userToUser ? userToUser.isWatching : false;
    return <View style={styles.container}>

        <TouchableOpacity 
            activeOpacity={1}
            style={{position:'absolute', left:0, right:0, top:0, bottom:0}} 
            onPress = {()=>{
            this.props.navigation.navigate("PhotoModal", {shortUrl: user.bigImageUrl})
            }}>
        <ImageView shortUrl= {user.bigImageUrl} style={{position:'absolute', left:0, right:0, top:0, bottom:0}} resizeMode={'cover'}/>  
        </TouchableOpacity>
        {this.getTopNavigator(isBlocking, isWatching)}
        {
          this.state.floatButtonVisible &&
            this.getFloatButtons()
        }
        <BottomSheet
        user={user}
        ratedValue={ratedValue}
        gallery={gallery}
        isPublic={true}
        navigation={this.props.navigation}
        onBonePress={(isBoning) => {
            this.onBonePress(isBoning)
        }}
        onSheetOpening={(isOpening)=>{
          this.setState({floatButtonVisible: !isOpening})
        }}
        />
        <BlockUserModal
          onBlock={()=>{
            this.setState({isBlockUserVisible: false})
            this.props.navigation.goBack();
            this.props.dispatch(blockUser(this.props.auth.user.id, this.state.userId)) 
          }}
          onCancel={()=>{
            this.setState({isBlockUserVisible: false})
          }}
          isVisible={this.state.isBlockUserVisible}
          user={user}
          
        />
        <ReportUserModal
          onReport={(reason, comment)=>{
            this.setState({isReportUserVisible: false})
            this.props.dispatch(reportUser(this.props.auth.user.id, this.state.userId, reason, comment)) 
          }}
          onCancel={()=>{
            this.setState({isReportUserVisible: false})
          }}
          isVisible={this.state.isReportUserVisible}
          user={user}
        />

  
    </View>
  }

  render() {
    const { user, userToUser, ratedValue } = this.props.publicUser;
    return (
      <View style={styles.background}>
        {
            user ?
            this.getContent(user, userToUser, user.userPhotos, ratedValue)        
            :
            this.getLoading()
        }   

      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? getStatusBarHeight(true) : 0,
  },
  background:{
    flex: 1,
    backgroundColor:'black'
  },
  text: {
    fontSize: 14,
    color: 'white'
  },

  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  panelHeader: {
    height: 120,
    backgroundColor: '#b197fc',
    alignItems: 'center',
    justifyContent: 'center'
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
  icon: {
    width: 40,
    height: 40
  },
  settingsButton: {
    width: 48,
    height: 48,

  }
});

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, publicUser: state.publicUser });

export default connect(mapStateToProps)(PublicProfile);