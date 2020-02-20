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
import { calculatePortraitDimension } from '../../../helpers';
import { colors } from '../../../styles';
import { ImageView } from '../../../components';

const { width: deviceWidth, height: deviceHeight } = calculatePortraitDimension();

class UsersGrid extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //TODO if recods count saved on server pull it and show in the list

  }


  onUserPressed = (item) => {
    console.log("user pressed", item);
    this.props.navigation.navigate("PublicProfile", {userId: item.id});
  }


  onRefresh = () => {
    if(this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  getOnlineStatus = (onlineStatus) => {
    if(onlineStatus == 0)
      return <View style={[styles.statusMark, styles.offline]}/>
    else if (onlineStatus == 1)
      return <View style={[styles.statusMark, styles.online]}/>
    else if (onlineStatus == 2)
      return <View style={[styles.statusMark, styles.away]}/>
    else 
      return <View style={[styles.statusMark, styles.offline]}/>
  }

  getDistanceView = (distance) => {
    return <Text style={styles.distance}>{distance + ' km'}</Text>
  }

  getUserItem = (item) => {
      const {smallImageUrl} = item;
      return <TouchableOpacity
        style={styles.profileContainer}
        onPress={()=>{
          this.onUserPressed(item);
        }}
      >
      <View style={styles.profileContainer}>
        <ImageView style={styles.profileImage} 
          shortUrl ={ smallImageUrl } 
          defaultImage= {require('../../../../assets/images/defaultImage.png')}
          resizeMode='cover' />
        {this.getOnlineStatus(item.onlineStatus)}
        {this.getDistanceView(item.distance)}
        {
          item.role && item.role.abbreviatedName != "" &&
          <View style={{width: 24, height: 24, backgroundColor:'white', borderRadius:12, 
            position:'absolute', right:8, bottom: 8, alignItems:'center', justifyContent: 'center'}}>
            <Text style={{color: colors.red, fontWeight: 'bold'}}>
            {item.role.abbreviatedName}
            </Text>
          </View>
        }

      </View>
      </TouchableOpacity>
       
  }

  renderItem = ({ item }) => {
    return this.getUserItem(item);
  }


  renderUsersGrid = () => {
  
    const { users } = this.props;
    return (<FlatList
      data={users.users} renderItem={this.renderItem}
      ListFooterComponent={this.renderFooterComponent()}
      refreshing={false}
      keyExtractor={(item, index) => index.toString()}
      onRefresh={this.onRefresh}
      numColumns={3}
    />);
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

        <View style={styles.container}>
          {this.renderUsersGrid()}
        </View>

    );
  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  row:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: 16,
    marginEnd: 16,
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
    fontSize: 17,
    color: 'black',
  },
  text: {
    fontSize: 14,
    color: colors.gray,
  },
  profileImage: {
    backgroundColor: 'black',
    height: deviceWidth /3-1 ,
    width: deviceWidth /3-1 
  },
  profileContainer: {
    height: deviceWidth /3 ,
    width: deviceWidth /3 ,
    flexDirection: 'column',  
    borderWidth: 0.5, 
    borderColor:'white',
  },
  statusMark: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 0,
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
  distance: {
    fontSize: 12,
    color: 'white',
    position: 'absolute',
    left: 8, bottom: 8
  }
  
});



const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, users: state.users });

export default connect(mapStateToProps)(UsersGrid);