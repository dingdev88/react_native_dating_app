import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView
} from 'react-native';


import { connect } from 'react-redux';

import { calculatePortraitDimension, showAlert } from '../../helpers';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { TopNavigatorView, LoadingOverlay, PhotoPickerView } from '../../components';
import ListItem from './components/ListItem';
import SectionTitleItem from './components/SectionTitleItem';
import ListItemSwitch from './components/ListItemSwitch';
import NumberPickerListItem from './components/NumberPickerListItem';
import ItemPickerListItem from './components/ItemPickerListItem';
import DatePickerListItem from './components/DatePickerListItem';
import * as ACTION_TYPES from '../../actions/ActionTypes';

import PhotosPanel from './components/PhotosPanel';
import { uploadProfileImage, updateProfile, loadUserProfile } from '../../actions/AuthActions'
import { colors } from '../../styles';


const { height : deviceHeight, width: deviceWidth } = calculatePortraitDimension();

class ProfileEdit extends React.Component {
    constructor(props) {
      super(props);
      let user = props.navigation.getParam('user');
      this.state = {
        ...user  
      }
    }

    componentWillReceiveProps(nextProps) {
      if(this.props.auth.error != nextProps.auth.error && nextProps.auth.error) {
        showAlert("Whoops", nextProps.auth.error);
      } 
      if(this.props.auth.success == false 
          && nextProps.auth.success == true 
          && nextProps.auth.currentAction == ACTION_TYPES.UPDATE_PASSWORD ) {
        this.props.dispatch(loadUserProfile())
      }
    } 

    onSave = () => {
      const { user, gallery } = this.props.auth;
      const { username, age, about, height, weight, role, bodyType,
        sexualStatus, hasPlace, hivStatus, lastTestDate, tribes, lookingFors } = this.state;
      let tribeIds = tribes ? tribes.map(item=> item.id): [];
      let lookingForIds = lookingFors ? lookingFors.map(item=>item.id): [];
      let body = {
        username,
        age, 
        about, 
        height,
        weight,
        roleId: role.id,
        bodyTypeId: bodyType.id,
        sexualStatusId: sexualStatus.id,
        hasPlace: hasPlace ? 'true': 'false',
        hivStatusId: hivStatus.id,
        lastTestDate,
        tribeIds,
        lookingForIds
      }
      this.props.dispatch(updateProfile(user.id, body)) 
    }
    getPhotoSection = ( items ) => {
      if(items.length == 0 ||  (items.length >0 && !(items[0].isAddButton))) {
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
    
    getSaveButton = () => {
      return <TouchableOpacity 
      onPress={()=>{
        this.onSave();
      }}>
        <View style={{paddingRight: 16, height: 50, justifyContent:'center', alignItems:'center'}} >
           <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold'}}>Save</Text>
        </View>
     
      </TouchableOpacity>
    }
    getTopNavigator = () => {
      return <TopNavigatorView
        title={'Edit Profile'}
        onBackPressed = {() => {
          this.props.navigation.goBack();
        }}

        rightComponent = { this.getSaveButton()}
      />
    }


    onUpdateImage = (userId, image) => {
      this.props.dispatch(uploadProfileImage(userId, image));
    } 
    render() {
        const { user, gallery } = this.props.auth;

        const { username, age, about, height, weight, role, bodyType,
          sexualStatus, hasPlace, hivStatus, lastTestDate, tribes, lookingFors } = this.state;
        const { modifiables } = this.props.app;
        return (
            <View style={styles.background}>
              <LoadingOverlay visible={this.props.auth.isLoading}/>
              <View style={styles.container}>
              {this.getTopNavigator()}
              <ScrollView>
                <View style={styles.contentContainer}>
                  <PhotoPickerView
                    imageUrl= {user.smallImageUrl}
                    updateImage={(image)=>{this.onUpdateImage(user.id,image)}}
                  />
                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'INFO'}
                  />
                  <ListItem
                    title={'Display Name'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    text={username}
                    onItemPress={()=>{
                      this.props.navigation.navigate("TextInputView", { title: 'Display Name', value: username, inputType:'textinput', returnData: (value) => {
                        this.setState({username: value});
                      }})
                    }}
                  />
                  <ListItem
                    title={'About'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    onItemPress={()=>{
                      this.props.navigation.navigate("TextInputView", { title: 'About',value: about, inputType: 'textarea', returnData: (value) => {
                        this.setState({about: value});
                      }})
                    }}
                  />

                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'STATS'}
                  />
                  <NumberPickerListItem
                    title={'Age'}
                    max={120}
                    min={18}
                    value={age}
                    onPickNumber={(value)=>{
                      this.setState({age: value})
                    }}
                  />
                  <ListItemSwitch
                    title={'Show Age'}
                    rightIconImageOn={require('../../../assets/images/boneoncb.png')}
                    rightIconImageOff={require('../../../assets/images/boneoffcb.png')}
                    value={this.state.showAge}
                    onChangeState={(value)=>{
                      this.setState({showAge: value})
                    }}
                  />
                  <NumberPickerListItem
                    title={'Height'}
                    max={250}
                    min={100}
                    value={height}
                    onPickNumber={(value)=>{
                      this.setState({height: value})
                    }}
                  />
                  <NumberPickerListItem
                    title={'Weight'}
                    max={300}
                    min={40}
                    value={weight}
                    onPickNumber={(value)=>{
                      this.setState({weight: value})
                    }}
                  />
                  <ItemPickerListItem
                    title={'Role'}
                    value={role.name}
                    items={modifiables.roles}
                    onPickItem={(item)=> {
                      this.setState({role: item})
                    }}
                  />
                  <ItemPickerListItem
                    title={'Body Type'}
                    value={bodyType.name}
                    items={modifiables.bodyTypes}
                    onPickItem={(item)=> {
                      this.setState({bodyType: item})
                    }}
                  />
                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'PROFILE GALLERY'}
                  />

                  {gallery && this.getPhotoSection(gallery)}
                  <View style={styles.spliter}/>
                  <SectionTitleItem
                    itemContainerStyle={{marignTop:32}}
                    title={'SEXUAL TASTE'}
                  />
                  
                  <ItemPickerListItem
                    title={'Status'}
                    value={sexualStatus.name}
                    items={modifiables.sexualStatuses}
                    onPickItem={(item)=> {
                      this.setState({sexualStatus: item})
                    }}
                  />

                  <ListItemSwitch
                    title={'Place'}
                    rightIconImageOn={require('../../../assets/images/boneoncb.png')}
                    rightIconImageOff={require('../../../assets/images/boneoffcb.png')}
                    value={hasPlace}
                    onChangeState={(value)=>{
                      this.setState({hasPlace: value})
                    }}
                  />
                  <ListItem
                    title={'Tribes'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    onItemPress={()=>{
                      this.props.navigation.navigate("MultipleItemPickerView", 
                        { title: 'Tribes', 
                          items: modifiables.tribes, 
                          selectedItems: tribes, inputType:'textinput', 
                          returnData: (value) => {
                            this.setState({tribes: value});
                          }})
                    }}
                  />
                  <ListItem
                    title={'Looking For'}
                    rightIconImage={require('../../../assets/images/forward.png')}
                    onItemPress={()=>{
                      this.props.navigation.navigate("MultipleItemPickerView", 
                        { title: 'Looking For', 
                          items: modifiables.lookingFors, 
                          selectedItems: lookingFors, inputType:'textinput', 
                          returnData: (value) => {
                          this.setState({lookingFors: value});
                        }})
                    }}
                  />

                  <SectionTitleItem
                    itemContainerStyle={{marginTop:32}}
                    title={'SEXUAL HEALTH'}
                  />
                  <ItemPickerListItem
                    title={'HIV Status'}
                    value={hivStatus.name}
                    items={modifiables.hivStatus}
                    onPickItem={(item)=> {
                      this.setState({hivStatus: item})
                    }}
                  />
                <DatePickerListItem
                    title={'Last Tested Date'}
                    value={lastTestDate}
                    maxYear={new Date().getFullYear()}
                    minYear={new Date().getFullYear()-3 }
                    onPickDate={(date)=> {
                      console.log("datepicker", date);
                      this.setState({lastTestDate: date})
                    }}
                  />

                </View>
              </ScrollView>
              </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex:1,
        backgroundColor: 'black'
    },
    contentContainer: {
      flex: 1
    },  
    container: {
        flex: 1,
        marginBottom: getBottomSpace(),
        marginTop: Platform.OS === 'ios' ? getStatusBarHeight(true) : 0,
    },
    spliter: {
      alignSelf:'stretch',
      height: 0.5,
      backgroundColor: colors.darkGray,

    }

});

const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, gallery: state.gallery });

export default connect(mapStateToProps)(ProfileEdit);