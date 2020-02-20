import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  InteractionManager
} from 'react-native';


import { connect } from 'react-redux';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import Permissions from 'react-native-permissions';
import { getNearByUsers, getWatchList, getNewUsers, getTopUsers, setFlag, changeLocation, refreshUsers, getFilterUsers, enableEye, enableOnline, enableLocation, enableFilter } from '../../actions/UserActions';
import { loadUserProfile, loadMyGallery, saveCurrentLocation } from '../../actions/AuthActions';
import * as ACTION_TYPES from '../../actions/ActionTypes';
import { getModifiables } from '../../actions/AppActions';
import UsersGrid from './components/UsersGrid'
import HorizontalUserList from './components/HorizontalUserList'
import UserSearchView from './components/UserSearchView'
import RelocateView from './components/RelocateView'

import SocketManager from '../../socket-manager/SocketManager';
import *  as SOCKET_ACTIONS from '../../socket-manager/SocketActions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      onlineBit: 0,
      gridType: 'nearby', // nearby, watchlist, filter
      isVisibleMap: false,
      
    }
  }

  onRefreshUsers(users) {
    console.log("Refresh Users");
    const {user} = this.props.auth;
    const {filteron, eyeon, locationon, filters, online} = users;
    if(filteron) {
      let data = {
        id: user.id,
        limit : 40, 
        offset : 0,
        online: online
      }
      this.props.dispatch(getFilterUsers(data, filters))
    } else if(eyeon) {
      let data = {
        id: user.id,
        limit : 40, 
        offset : 0,
        online: online
      }
      this.props.dispatch(getWatchList(data));
    }else if(locationon) {
      this.fetchNearByUsers(online);
    } else {
      this.fetchNearByUsers(online);
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.users.refreshUsers == false && nextProps.users.refreshUsers == true) {
      this.onRefreshUsers(nextProps.users);
      this.props.dispatch(refreshUsers(false));
    }
    if(this.props.publicUser.success == false && 
        nextProps.publicUser.success == true && 
        nextProps.publicUser.currentAction == ACTION_TYPES.BLOCK_USER_SUCCESS) {
        this.props.dispatch(refreshUsers(true));
    }
    if(this.props.users.success == false && 
      nextProps.users.success == true && 
      nextProps.users.currentAction == ACTION_TYPES.CHANGE_LOCATION_SUCCESS) {
      this.props.dispatch(refreshUsers(true));
    }
  }
  initialPermissionCheck() {
    if(!this.props.auth.activated){
      this.props.navigation.navigate('ReactivateAccount')
    } else if(this.props.lockCode.locked) {
      this.props.navigation.navigate('LockVerify', {mode: 'verify'})
    }
  }

  componentDidMount() {
    this.loadUsers();
    this.checkLocationPermission(this.props.dispatch);
    this.initialPermissionCheck();
    this.initSocket();
  }

  initSocket() {
    let userId =this.props.auth.user.id;
    let password = this.props.auth.credential.password;
    SocketManager.getInstance().addListener((event, payload)=>{
      if(event == SOCKET_ACTIONS.CONNECT) {
        SocketManager.getInstance().loginSignup(userId, password);
      }
    })
    SocketManager.getInstance().connect();

  }

  loadProfile = () => {
    const { auth, dispatch } = this.props;
    const { onlineBit } = this.state;
    if(!auth.user)
    return;
  
    dispatch(loadUserProfile(auth.user.id));
    dispatch(loadMyGallery(auth.user.id));
    dispatch(getModifiables(auth.user.id));

  }

  loadUsers = () => {
    this.loadProfile();
    this.fetchNearByUsers(false);
    this.fetchNewUsers();
    this.fetchTopUsers();

  }
  updateLocation = () => {
    const { auth, dispatch, users } = this.props;
    if(!auth.user)
    return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        
        const body = {
          id: auth.user.id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        dispatch(saveCurrentLocation(body))
        if(!users.locationon) {
          dispatch(changeLocation(body));
        }

      },
      (error) => {
        // console.log(error);
      },
      {
        enableHighAccuracy: Platform.OS != 'android',
        timeout: 20000,
        maximumAge: 1000,
      }
    );
  }

  watchLocation = () => {
    const { auth, dispatch, users } = this.props;
    if(!auth.user)
    return;

    navigator.geolocation.watchPosition(
      (position) => {
        const body = {
          id: auth.user.id,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        if(!users.locationon) {
          dispatch(changeLocation(body));
        }
        dispatch(saveCurrentLocation(body))
      },
      (error) => {
        // console.log(error);
      },
      {
        enableHighAccuracy: Platform.OS != 'android',
        timeout: 20000,
        maximumAge: 1000,
      }
    );
  }

  checkLocationPermission = (dispatch) => {
    InteractionManager.runAfterInteractions(() => {
      Permissions.checkMultiple(['location']).then((response) => {
        if (response.location === 'authorized') {
          this.watchLocation();
          this.updateLocation();
        } else if (response.location === 'undetermined') {
          this._requestLocationPermission(dispatch);
        }
      });
    });
  }

  _requestLocationPermission = (dispatch) => {
    Permissions.request('location', { type: 'always' }).then((response) => {
      if (response.location === 'authorized') {
        this.watchLocation();
        this.updateLocation();
      }
    });
  }
  
  fetchNewUsers = () => {
    const { auth, dispatch } = this.props;
    const { onlineBit } = this.state;
    if(!auth.user)
    return;
    let data = {
      id: auth.user.id,
      limit : 15, 
      offset : 0,
      online: onlineBit
    }
    console.log("fetchNewUsers", data);
    dispatch(getNewUsers(data));
  }

  fetchTopUsers = () => {
    const { auth, dispatch } = this.props;
    const { onlineBit } = this.state;
    if(!auth.user)
    return;
    let data = {
      id: auth.user.id,
      limit : 15, 
      offset : 0,
      online: onlineBit
    }
    console.log("fetchTopUsers", data);
    dispatch(getTopUsers(data));
  }


  fetchNearByUsers = (online) => {
    const { auth, dispatch } = this.props;

    if(!auth.user)
    return;
    console.log("currentUser",auth.user);
    let data = {
      id: auth.user.id,
      limit : 60, 
      offset : 0,
      online: online? 1: 0
    }
    console.log("fetchNearByUsers", data);
    dispatch(getNearByUsers(data));
  }

  onFilterPress = (filteron, locationon)=>{
    if(!filteron && locationon) {
      this.changeWithCurrentLocation();
    }
    if(!filteron && this.state.isVisibleMap)
      this.setState({isVisibleMap: false});
    this.props.dispatch(enableFilter(!filteron));
    if(!filteron) {
      this.props.navigation.navigate("UserFilter");
    }

  }
  onEyePress = (eyeon, locationon)=> {
    if(!eyeon && locationon) {
      this.changeWithCurrentLocation();
    }
    if(!eyeon && this.state.isVisibleMap)
    this.setState({isVisibleMap: false});
    this.props.dispatch(enableEye(!eyeon))
 
  }

  changeWithCurrentLocation = () => {
    const {auth, users} = this.props;
    const body = {
      id: auth.user.id,
      latitude: auth.currentLocation.latitude,
      longitude: auth.currentLocation.longitude,
    };
   
      this.props.dispatch(changeLocation(body));
   
  }

  onLocation = (locationon) => {
    if(!locationon ) {
      this.setState({isVisibleMap: !this.state.isVisibleMap});
      this.props.dispatch(enableLocation(!locationon))
    }

    if(locationon && this.state.isVisibleMap) {
      this.setState({isVisibleMap: false});

      this.props.dispatch(enableLocation(false))
      this.changeWithCurrentLocation();
    }
    if(locationon && !this.state.isVisibleMap) {
      this.props.dispatch(enableLocation(false))
      this.changeWithCurrentLocation();
    }
    
  }

  getTopToolBar = (searchon, locationon, eyeon, filteron, online ) => {
    return <View style={styles.topToolbarContainer}>
      <View style={{width:40, height:40, marginLeft: 8}}>
        <TouchableOpacity style={{flex: 1, alignItems:'center', justifyContent: 'center'}}
          onPress={this.onSearchPress}
        >
          <Image style={styles.icon} source={(searchon || online) ? require('../../../assets/images/searchon.png') : require('../../../assets/images/searchoff.png')}/>
        </TouchableOpacity>
      </View>
      <View style={{width:40, flexDirection: 'row', alignItems:'center', justifyContent:'flex-end'}}>
          <TouchableOpacity 
            style={{ alignItems:'center', justifyContent: 'center', 
                     width: 40, height:40, marginRight:16}}
            onPress={()=>{
              this.onLocation(locationon);
            }}
            >
            <Image style={styles.icon} source={locationon || this.state.isVisibleMap ? require('../../../assets/images/locationon.png') : require('../../../assets/images/locationoff.png')}/>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ alignItems:'center', justifyContent: 'center', width: 40, height:40,  marginRight:16}}
            onPress={()=>{
              this.onEyePress(eyeon, locationon);
            }}>
            <Image style={styles.icon} source={eyeon ? require('../../../assets/images/eyeon.png') : require('../../../assets/images/eyeoff.png')}/>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ alignItems:'center', justifyContent: 'center', width: 40, height:40}}
            onPress={()=>{
              this.onFilterPress(filteron, locationon);
            }}>
            <Image style={styles.icon} source={filteron ? require('../../../assets/images/filteron.png') : require('../../../assets/images/filteroff.png')}/>
          </TouchableOpacity>
      </View>
    </View>
  }

  onSearchPress = () =>{
    const { searchon, online } = this.props.users;
    if(searchon == false && online == false)
      this.props.dispatch(setFlag("searchon", true));
    else 
      this.props.dispatch(enableOnline(false))
  }
  render() {
    const { searchon, locationon, eyeon, filteron, online } = this.props.users;
    return (
      <View style={styles.background}>
          <View style={styles.container}>
            {this.getTopToolBar(searchon, locationon, eyeon, filteron, online)}
            <View style={styles.content}>

              <HorizontalUserList userType={'topUsers'} showType={'horizontal'} navigation={this.props.navigation} onRefresh={()=> {this.loadUsers()}}/>
              <UsersGrid onRefresh={()=> {this.loadUsers()}} navigation={this.props.navigation}/>
              {
                searchon &&
                <UserSearchView navigation={this.props.navigation}/>
              }
              {
                this.state.isVisibleMap &&
                <RelocateView onRelocate={()=>{
                  this.setState({isVisibleMap: false});
                  
                }} 
                location={this.props.auth.currentLocation} navigation={this.props.navigation}/>
              }
            </View>
            
          </View>
       
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? getStatusBarHeight(true) : 0,
  },
  background: {
    flex: 1,
    backgroundColor: 'black'
  },
  content: {
    flex: 1
  },
  text: {
    fontSize: 14,
    color: 'white'
  },
  topToolbarContainer: {
    height: 60,
    alignSelf: 'stretch',
    borderBottomColor: 'white',
    borderBottomWidth: 0.5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  }
});

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, users: state.users, publicUser: state.publicUser, lockCode: state.lockCode });

export default connect(mapStateToProps)(Home);