import React, { PureComponent } from 'react';
import { ActivityIndicator, StyleSheet, TouchableWithoutFeedback, View, Image } from 'react-native';
import { Bubble, Day, GiftedAvatar, GiftedChat, MessageImage, utils } from 'react-native-gifted-chat';
import { ImageView } from '../../../components'
import { colors } from '../../../styles';
import CustomView from './CustomView'
const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 4,
    marginStart: 8,
    overflow: 'hidden',
  },
  messageImageStyle: {
    width: 235,
    height: 150,
    borderRadius: 0,
  },
  lightColorText: {
    color: '#FFF',
  },
  delivered: {
    maxWidth: 260,
    borderBottomRightRadius: 2,
    borderColor: colors.lightGray,
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    borderWidth: 0.5,
    marginBottom: 4,
    padding: 8,
  },  
  faildToSend: {
    maxWidth: 260,
    borderBottomRightRadius: 2,
    borderColor: colors.red,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 0.5,
    marginBottom: 4,
    padding: 8,
  },
  faildToSendText: {
    color: colors.red
  },
  deliveredText: {
    color: colors.black
  },
  text: {
    color: colors.white
  },
  writing: {
    maxWidth: 100,
    borderBottomRightRadius: 2,
    borderColor: colors.red,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 0.5,
    marginBottom: 4,
    padding: 8,
  },
  seen: {
    maxWidth: 260,
    borderBottomRightRadius: 2,
    borderColor: colors.black,
    backgroundColor: colors.black,
    borderRadius: 16,
    borderWidth: 0.5,
    marginBottom: 4,
    padding: 8,
  },  
  bubbleViewRight: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubbleViewLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
  },
});
class MessagesHolder extends PureComponent {
  showLoadingIndicator = (size = 'large') => () => <ActivityIndicator size={size} color='#FFF' />;

  renderCustomDay = (props) => <Day {...props} textStyle={styles.lightColorText} />;

  renderCustomImage = (props) => <MessageImage {...props} imageStyle={styles.messageImageStyle} />;

  renderCustomAvatar = (props) => <GiftedAvatar {...props} avatarStyle={styles.avatar} />;

  getStyleForStatus = (deliveryStatus) => {
    switch(deliveryStatus) {
      case 0: 
        return styles.delivered;
      case 1:
        return styles.seen;
      case 2:
        return styles.faildToSend;
      case 3:
        return styles.writing;
      default:
        return styles.delivered
    }
  }
  getTextStyleForStatus = (deliveryStatus) => {
    switch(deliveryStatus) {
      case 0:
        return styles.deliveredText;
      case 2:
        return styles.faildToSendText;
      default:
        return styles.text;
    }
  }

  renderCustomBubble = (props) => {
    const messageToCompare = props.nextMessage;
    const { _id, name, avatar } = props.currentMessage.user;

    if (props.user._id === _id) {
      if (avatar === 'undefined') {
        props.currentMessage.user = { _id, name, avatar: this.props.sender.avatar };
      }

      return (
        <View style={styles.bubbleViewRight}>
          <Bubble
            {...props}
            textStyle={{
              right: this.getTextStyleForStatus(props.currentMessage.deliveryStatus),
              
            }}
            wrapperStyle={{
              right: this.getStyleForStatus(props.currentMessage.deliveryStatus)
            }}
          />
        </View>
      );
    }
    return (
      <View style={styles.bubbleViewLeft}>
        <Bubble
          {...props}
          textStyle={{
            left: {
              color: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          wrapperStyle={{
            left: {
              maxWidth: 260,
              borderBottomLeftRadius: 2,
              borderColor: 'rgba(255, 255, 255, 0.4)',
              backgroundColor: colors.red,
              borderRadius: 16,
              borderWidth: 0,
              marginBottom: 4,
              padding: 8,
            },
          }}
        />
        {utils.isSameUser(props.currentMessage, messageToCompare) &&
        utils.isSameDay(props.currentMessage, messageToCompare) ? (
          <View style={[styles.avatar, { marginStart: 0, marginEnd: 8, borderColor: 'transparent' }]} />
        ) : (
          <TouchableWithoutFeedback
            onPress={() => this.props.openUserProfile(props.currentMessage.user)}
            hitSlop={{ top: 4, left: 4, bottom: 4, right: 4 }}
          >
            <Image source={{uri: props.currentMessage.user.avatar}} style={[styles.avatar, { marginStart: 0, marginEnd: 8 }]}/>
          </TouchableWithoutFeedback>
        )}

      </View>
    );
  };

  renderCustomView(props) {
    return <CustomView {...props} />;
  }
  renderCustomInputToolbar = () => null;

  renderCustomTime = () => null;

  createRef = (e) => {
    this.giftedChat = e;
  };

  scrollToBottom = () => {
    if (this.giftedChat) {
      this.giftedChat.scrollToBottom();
    }
  };

  render() {
    const { sender, messages, isLoading } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {messages && messages.length > 0 && (
          <GiftedChat
            ref={this.createRef}
            messages={messages}
            renderDay={this.renderCustomDay}
            renderTime={this.renderCustomTime}
            renderCustomView={this.renderCustomView}
            renderMessageImage={this.renderCustomImage}
            renderLoading={this.showLoadingIndicator()}
            renderAvatar={null}
            renderBubble={this.renderCustomBubble}
            showAvatarForEveryMessage
            renderInputToolbar={this.renderCustomInputToolbar}
            minInputToolbarHeight={0}
            keyboardShouldPersistTaps='handled'
            loadEarlier={isLoading}
            renderLoadEarlier={this.showLoadingIndicator('small')}
            listViewProps={{
              onEndReached: () => this.props.loadMoreMessages(),
              onEndReachedThreshold: 0.25,
              initialNumToRender: 10,
              maxToRenderPerBatch: 10,
            }}
            user={{
              _id: sender.id,
              name: `${sender.name}`,
              avatar: `${sender.profileImageUrl || sender.avatar}`,
            }}
          />
        )}
      </View>
    );
  }
}

export default MessagesHolder;
