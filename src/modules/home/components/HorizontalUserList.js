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
import { colors } from '../../../styles';
import { ImageView } from '../../../components';

class HorizontalUserList extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      type: props.type? props.type : 'home',
      showType: props.showType? props.showType :'horizontal'
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ type: nextProps.type, showType: nextProps.showType})
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

  getUserItem = (item) => {
      const {smallImageUrl} = item;
      if(this.state.type == 'search') {
        return <TouchableOpacity
          onPress={()=>{
            this.onUserPressed(item);
          }}
        >
        <View style={{ justifyContent: 'center', alignItems:'center'}}>
          <ImageView 
            style={{margin:8, width:40, height: 40, borderRadius:20}} 
            defaultImage={require('../../../../assets/images/boneprofile.png')} 
            shortUrl={smallImageUrl}/>
        </View>
        </TouchableOpacity>
      } else {
        return <TouchableOpacity
          onPress={()=>{
            this.onUserPressed(item);
          }}
        >
        <View style={{margin:4, marginTop: 8, marginBottom: 8, width:80, height: 80, borderRadius:40, justifyContent: 'center', alignItems:'center'}}>
          <ImageView 
            style={styles.profileImage} 
            defaultImage={require('../../../../assets/images/boneprofile.png')} 
            shortUrl={smallImageUrl}/>
        </View>
        </TouchableOpacity>
      }

       
  }

  renderItem = ({ item }) => {
    return this.getUserItem(item);
  }


  renderHorizonalUsers = () => {
    
    const { users } = this.props;
    
    let members = this.props.userType == 'topUsers'? users.topUsers : users.newUsers;
     
    return (
      this.state.showType == 'horizontal' ? <FlatList
        data={members} renderItem={this.renderItem}
        ListFooterComponent={this.renderFooterComponent()}
        refreshing={false}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={this.onRefresh}
        horizontal = {true}
        key={'horizontal'}
        />
      :
      <FlatList
        data={members} renderItem={this.renderItem}
        ListFooterComponent={this.renderFooterComponent()}
        refreshing={false}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={this.onRefresh}
        numColumns={6}
        key={'grid'}
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
          {this.renderHorizonalUsers()}
        </View>
        
    );
  }

}

const styles = StyleSheet.create({
  searchContainer: {
    height: 60
  },
  gridContainer: {
    height: 180
  },
  container: {
    height: 108,
    borderBottomWidth : 0.5,
    borderBottomColor: 'grey'
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
    borderRadius: 30,
    height: 60,
    width: 60
  }
});



const mapStateToProps = (state) => ({ app: state.app, auth: state.auth, users: state.users });

export default connect(mapStateToProps)(HorizontalUserList);