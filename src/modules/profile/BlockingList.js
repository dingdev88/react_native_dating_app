import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  FlatList,
  Image
} from 'react-native';


import { connect } from 'react-redux';
import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { colors } from '../../styles';
import {loadBlockUsers} from '../../actions/AuthActions';
import * as ACTION_TYPES from '../../actions/ActionTypes';
import { unblockUser } from '../../actions/PublicUserActions';
import StarRating from 'react-native-star-rating';
import { ImageView, Button } from '../../components';


class BlockingList extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.publicUser.success == false && 
      nextProps.publicUser.success == true &&
      nextProps.publicUser.currentAction == ACTION_TYPES.UNBLOCK_USER_SUCCESS) {
        this.onRefresh();
      }
  }
  componentWillMount() {
    //TODO if recods count saved on server pull it and show in the list
    this.onRefresh();
  }


  onUnBlock = (user) => {
    console.log("unblock user pressed", user);
    this.props.dispatch(unblockUser(this.props.auth.user.id, user.id));
  }


  onRefresh = () => {
    this.props.dispatch(loadBlockUsers(this.props.auth.user.id));
  }

  getUserItem = (item) => {
    let user = item.toUser;
    return <View style={styles.itemContainer}>
      <View style={{flexDirection:'row', flex:1, alignItems:'center'}}>
        <ImageView
          shortUrl={user.smallImageUrl}
          defaultImage={require('../../../assets/images/defaultImage.png')}
          style={{height: 88, width: 88, borderRadius:44, borderWidth: 1, borderColor:'white'}}
        />
        <View style={{marginLeft: 16, alignSelf:'stretch', flex:1}}>
          <View style={{flex:1, alignItems:'center',flexDirection:'row'}}>
            <StarRating     
              disabled={true}
              maxStars={5}
              emptyStar="ios-star-outline"
              fullStar="ios-star"
              halfStar="ios-star-half"
              iconSet="Ionicons"
              fullStarColor={colors.white}
              starStyle={{padding:4}}
              rating={user.rating}
              starSize={16}
            />
          </View>
          <View style={{flex:1, alignItems:'center',flexDirection:'row'}}>
            <Text style={[styles.name ]}>{user.username + ', '+ user.age}</Text>
          </View>
          <View style={{flex:1, alignItems:'center',flexDirection:'row'}}>
            <View style={{flex:1, justifyContent:'center'}}>
                <Text style={styles.text}>{user.weight+' kg'}</Text>
            </View>
            <View style={{flex:1, justifyContent:'center'}}>
                <Text style={styles.text}>{user.height+' cm'}</Text>
            </View>
            {/**
            <View style={{flex:1, justifyContent:'center'}}>
                <Text style={styles.text}>{ user.role? user.role.name: ""}</Text>
            </View>
             */}

          </View>

        </View>
        <View style={{width: 100, alignSelf:'stretch', justifyContent:'center', alignItems:'center'}}>
              <Button
                  secondary
                  style={{ alignSelf: 'stretch', padding:0, height: 36}}
                  caption={'UNBLOCK'}
                  textColor={'white'}
                  bgColor={colors.red}
                  onPress={() => {
                      this.onUnBlock(user);
                  }}
              />
          </View>

      </View>
    </View>
       
  }

  renderItem = ({ item }) => {
    return this.getUserItem(item);
  }

  renderUsers = () => {
    const { auth } = this.props;
    return (
      <FlatList
        data={auth.blocklist} renderItem={this.renderItem}
        ListFooterComponent={this.renderFooterComponent()}
        refreshing={this.props.auth.isLoading}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={this.onRefresh} 
      />
    );
  }

  renderFooterComponent() {
    if (this.props.isLoading && !this.props.isRefreshing) {
      return <View style={styles.footer}><ActivityIndicator size="small" color="white" /></View>;
    }
  }

  renderEmptyView = () => {
    if (this.props.isLoading) {
      return null;
    }
    let text = '';
    if (!this.props.hasError) {
      text = 'No medical records have been found ';
    } else {
      text = 'An error occured please retry';
    }
    return <View style={styles.emptyView}><Text style={styles.emptyText}>{text}</Text></View>;
  }

  render() {
    return (

        <View style={this.state.type == 'search'? 
                        this.state.showType == 'grid' ? styles.gridContainer 
                                                      : styles.searchContainer 
                        : styles.container}>
          {this.renderUsers()}
        </View>
        
    );
  }

}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor:'black'
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemContainer:
  {
    alignSelf:'stretch',
    height: 108,
    marginStart: 16,
    marginEnd: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'white'
  },
  separator: {
    
    height: 0.5,
    marginLeft: 64,
    backgroundColor: colors.lightGray2
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  headerView: {
    flex: 1,
    marginStart: 16,
    marginEnd: 16,
  },
  emptyView: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: 16,
    marginEnd: 16,
  },
  name: {
    fontSize: 20,
    color: 'white',
  },
  text: {
    fontSize: 17,
    color: 'white',
  },
  profileImage: {
    borderRadius: 30,
    height: 60,
    width: 60
  }
});



const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, publicUser: state.publicUser });

export default connect(mapStateToProps)(BlockingList);