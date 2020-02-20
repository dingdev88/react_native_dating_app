import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform
} from 'react-native';

import { getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import { connect } from 'react-redux';
import { colors } from '../../../styles';
import { getChatroomList, removeChatroom } from '../../../actions/ChatActions';
import { ImageView, Button } from '../../../components';
import { unitSystems } from '../../../config';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/FontAwesome';

class ChatRoomList extends React.Component {
    constructor(props) {
      super(props);
    }
   
    componentDidMount() {
      this.onRefresh();
    }
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
    getItemData (chatrooms, userId) {
        return chatrooms.map(item => {
            let name = "";
            let firstMessage= "";
            let imageUrl = "";
            let onlineStatus = 0;
            let toUser = null;
            if(item.isGroup) {
                name = item.name;  
            }else {
                if(item.groupUsers) {
                    item.groupUsers.map(user => {
                        if(user.id != userId) {
                            //id it other user.
                            toUser = user.user_id;
                            name = user.chatUserInfo.username;
                            imageUrl = user.chatUserInfo.smallImageUrl;
                            onlineStatus = user.chatUserInfo.onlineStatus;
                        }
                    })
                }
            }
            if(item.roomMessage && item.roomMessage.length > 0) {
                firstMessage = item.roomMessage[0].message || "";
            }

            return { name, firstMessage, imageUrl, onlineStatus,
                     id: item.id, isGroup: item.isGroup, toUser: toUser }
        }) 
    }

    onItemPress = ( item ) => {
        this.props.navigation.navigate("Messages", {chatroom: item});
        console.log("chatroom press", item);
    }
    onItemDelete = ( item ) => {
        console.log("chatroom delete", item);
        this.props.dispatch(removeChatroom(item.id))
    }
     
    renderItem = ({ item }) => {
        return <TouchableOpacity activeOpacity={1} style={[styles.itemTouchable, {backgroundColor:'black'} ]} onPress={()=>{ this.onItemPress(item);}} >
            <View style={styles.itemContainer}>
                <ImageView
                shortUrl={item.imageUrl}
                defaultImage={require('../../../../assets/images/defaultImage.png')}
                style={styles.logo}
                />
                <View style={styles.itemMiddleContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.name} numberOfLines={1}>{item.name.toUpperCase()}</Text>
                </View>
                <View style={styles.textContainer} numberOfLines={1}>
                    <Text style={styles.message}>{item.firstMessage}</Text>
                </View>
        
                </View>
                <View style={{width: 40, alignSelf:'stretch', justifyContent:'center', alignItems:'center'}}>
                    <View style={[styles.statusMark, this.getOnlineStyle(item.onlineStatus)]}/>
                </View>
            
            </View>
        </TouchableOpacity>

    }
    renderHiddenItem= ({item}) => {
        return <View style={styles.rowBackground}>
            <TouchableOpacity style={styles.deleteButton} onPress={() => {this.onItemDelete(item);}}>
                <Icon name={'trash'} color={'white'} size={24} />
            </TouchableOpacity>
        </View>
    }
    onRefresh = () => {
        this.props.dispatch(getChatroomList(this.props.auth.user.id));
    }
    renderList = () => {
        const { chat } = this.props;
        let itemData = this.getItemData(chat.chatrooms, this.props.auth.user.id);
        return (
          <SwipeListView
            useFlatList
            data={itemData} 
            renderItem={this.renderItem}
            renderHiddenItem = {this.renderHiddenItem}
            ListFooterComponent={this.renderFooterComponent()}
            refreshing={chat.isLoading}
            keyExtractor={(item, index) => index.toString()}
            onRefresh={this.onRefresh} 
            rightOpenValue={-108}
          />
        );
    }

    renderFooterComponent() {
        if (this.props.isLoading && !this.props.isRefreshing) {
          return <View style={styles.footer}><ActivityIndicator size="small" color="white" /></View>;
        }
      }
    
    render() {
        return (
        <View style={styles.container}>
            {this.renderList()}
        </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  name: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold'
  },
  message: {
    fontSize: 14,
    color: 'white'
  },
  itemContainer:
  {
    flexDirection:'row', 
    alignItems:'center',
    flex:1
  },
  itemTouchable:{
    alignSelf:'stretch',
    height: 108,
  },
  rowBackground: {
    alignSelf:'stretch',
    height: 108,
    flexDirection: 'row',
    justifyContent:'flex-end',
    backgroundColor: colors.redLight
  },
  deleteButton: {
    width : 108,
    height: 108,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7
  },
  logo: {
      height: 88, 
      width: 88, 
      borderRadius:44
  },
  itemMiddleContainer: {
    flex:1,
    marginLeft: 16, 
    alignSelf:'stretch',
    justifyContent:'center'
  },
  textContainer: {
    height: 30,
    alignSelf: 'stretch',
    alignItems:'center',
    flexDirection:'row'
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

});

const mapStateToProps = (state) => ({ auth: state.auth, chat: state.chat });

export default connect(mapStateToProps)(ChatRoomList);