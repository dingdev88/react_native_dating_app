import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { TopNavigatorView } from '../../components' 
import { CustomActions, CustomView, ComposerContainer, MessagesHolder} from './components';
import { colors } from '../../styles';
import { getMessages } from '../../actions/ChatActions'
import * as ACTION_TYPES from '../../actions/ActionTypes';
import { connect } from 'react-redux';
import SocketManager from '../../socket-manager/SocketManager'
import * as SOCKET_ACTIONS from '../../socket-manager/SocketActions';

class Messages extends React.Component {

    constructor(props) {
        super(props);
        let chatroom  = props.navigation.state.params.chatroom;
        this.state = {
            loadCount: 20,
            messages: [],
            offset: 0,
            limit: 20,
            roomId: chatroom.id,
            toUserId: chatroom.toUser,
            isGroup: chatroom.isGroup,
            loadEarlier: true,
            typingText: null,
            isLoadingEarlier: false,
            userParams: {
                onlineStatus: chatroom.onlineStatus,
                userName: chatroom.name,
                userAvatar: chatroom.avatar
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.chat.success == false && nextProps.chat.success == true && 
            nextProps.chat.currentAction == ACTION_TYPES.GET_MESSAGES) {
                let loadCount = nextProps.chat.messages.length;
                let offset = this.state.offset + loadCount;
            this.setState({offset, loadCount,
                messages: [...nextProps.messages, ...this.state.messages]
            })
        }
    }

    componentDidMount() {
        this.loadMoreMessages();
        SocketManager.getInstance().addListener(this.eventListener);
    }
    getMessageFromData (data) {
        let message  = {
            _id : data.id,
            text: data.messageContent? data.messageContent.message : "",
            createdAt: data.createdAt,
            user: {
                
            }
        }
    }
    eventListener = (event, payload) => {
        if(event == SOCKET_ACTIONS.PRIVATE_MESSAGE_SENT) {
            
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    onLoadEarlier() {
        this.setState(() => ({
            isLoadingEarlier: true,
        }));

        setTimeout(() => {
            if (this._isMounted === true) {
                const messages = require('./data/old_messages.js').map(message => {
                    if (message.user.id !== 1) {
                        message.user.avatar = this.state.userParams.userAvatar;
                        message.user.name = this.state.userParams.userName;
                    }
                    return message;
                });

                this.setState(previousState => ({
                    messages: GiftedChat.prepend(previousState.messages, messages),
                    loadEarlier: false,
                    isLoadingEarlier: false,
                }));
            }
        }, 1000); // simulating network
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));

        // for demo purpose
        this.answerDemo(messages);
    }

    onReceive(text) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, {
                _id: Math.round(Math.random() * 1000000),
                text,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    // eslint-disable-next-line react/no-access-state-in-setstate
                    name: this.state.userParams.userName,
                    // eslint-disable-next-line react/no-access-state-in-setstate
                    avatar: this.state.userParams.userAvatar,
                },
            }),
        }));
    }


    createMessage = ({messageType, messageContent}) => {
        const { auth } = this.props;
        const { toUserId, roomId } = this.state;
        let data = {
            fromUserId : auth.user.id,
            toUserId: toUserId,
            roomId : roomId,
            messageType,
            messageContent
        }
        console.log("data", data);
        if(!this.state.isGroup) {
            SocketManager.getInstance().privateMessage(data);
        }
        SocketManager.getInstance().typing(roomId, toUserId, auth.user.id);
        
    }

    onOpenMenu = () => {
        console.log("onOpenMenu");
    }

    onOpenCall = () => {
        console.log("onOpenCall");
    }

    onOpenCamera = () => {
        console.log("onOpenCamera");
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
    
    getTopBarLeftComponent = (onlineStatus, name) => {
        return <View style={styles.topBarLeftContainer}>
            <View style={[styles.statusMark, this.getOnlineStyle(onlineStatus)]}/>
            <Text numberOfLines={1} style={styles.topBarTitle}>{name}</Text>
        </View>
    }

    getTopBarRightComponent = () => {
        return <View style={styles.topBarRightContainer}>
            <TouchableOpacity 
                style={[styles.topBarIconContainer, {marginRight: 24}]}
                onPress={()=>{
                    this.onOpenCamera()
                }}>
                <Image style={styles.icon} source={require('../../../assets/images/video_cam_on.png')}/>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.topBarIconContainer, {marginRight: 24}]}
                onPress={()=>{
                    this.onOpenMenu()
                }}>
                <Image style={{width: 24, height: 24}} source={require('../../../assets/images/voicecall.png')}/>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.topBarIconContainer, {marginRight: 16}]}
                onPress={()=>{
                    this.onOpenCall()
                }}>
                <Image style={styles.icon} source={require('../../../assets/images/three_dots.png')}/>
            </TouchableOpacity>
        </View>
    }
    handleUserProfile = ({})=>{

    }
    loadMoreMessages = () => {
        let data = {
            limit: this.state.limit,
            offset: this.state.offset,
            roomId: this.state.roomId
        }
        this.props.dispatch(getMessages(data))
    }
    renderAllMessages = (sender) => {
        return sender && Object.keys(sender).length ? (
            <MessagesHolder
              ref={this.createRef}
              messages={this.state.messages}
              sender={sender}
              loadMoreMessages={this.loadMoreMessages}
              isLoading={this.props.isLoading}
              navigation={this.props.navigation}
              openUserProfile={this.handleUserProfile}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size='large' color='#FFF' />
            </View>
          );
    }


    render() {
        let sender = {
            id: 1,
            avatar: '',
            name: 'Ding'
        }
        return (
            <View style={{flex:1, backgroundColor :'black'}}>
                <SafeAreaView style={{ flex: 1 }}>
                    <TopNavigatorView leftComponent={
                                        this.getTopBarLeftComponent(
                                            this.state.userParams.onlineStatus, 
                                            this.state.userParams.userName)
                                    }
                                    rightComponent={
                                        this.getTopBarRightComponent()
                                    }
                                    onBackPressed = {() => {
                                        this.props.navigation.goBack();
                                    }}
                                    containerStyle={styles.topBar}
                    />
                    <View style={{flex: 1, backgroundColor: colors.darkBackground}}>
                        {this.renderAllMessages(sender)}
                        {/*<GiftedChat
                            messages={this.state.messages}
                            onSend={this.onSend}
                            loadEarlier={this.state.loadEarlier}
                            onLoadEarlier={this.onLoadEarlier}
                            isLoadingEarlier={this.state.isLoadingEarlier}
                            user={{
                                _id: 1, // sent messages should have same user._id
                            }}
                            renderActions={this.renderCustomActions}
                            renderBubble={this.renderBubble}
                            renderCustomView={this.renderCustomView}
                            renderFooter={this.renderFooter}
                        />*/}
                         <ComposerContainer showComposer={true} createMessage={this.createMessage} />
                    </View>
                    
                </SafeAreaView>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    topBarIconContainer: {
        alignItems:'center', 
        justifyContent: 'center', 
        width: 32, 
        height:32
    },
    topBarLeftContainer: {
        flexDirection:'row', 
        justifyContent:'flex-start',
        alignItems:'center',
        width: 180,
        height: 50,
    },
    topBarRightContainer: {
        flexDirection:'row', 
        justifyContent:'flex-end',
        alignItems:'center'
    },
    icon: {
        width: 30,
        height: 30
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
    topBarTitle: {
        fontSize: 24,
        fontWeight:'bold',
        color: colors.white,
        marginLeft: 8
    },
    topBar: {
        backgroundColor: colors.black
    }
});


const mapStateToProps = (state) => ({ auth: state.auth, chat: state.chat });

export default connect(mapStateToProps)(Messages);