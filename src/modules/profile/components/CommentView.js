import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Animated,
  Image,
  TouchableOpacity
} from 'react-native';

import PropTypes from 'prop-types';
import ActionSheet from 'react-native-actionsheet'

import { connect } from 'react-redux';
import {colors} from '../../../styles';
import { showAlert } from '../../../helpers'; 
import * as ACTION_TYPES from '../../../actions/ActionTypes';

import { postComment, getAcceptedComments } from '../../../actions/CommentActions';
import { getMyAcceptedComments, deleteComment, reportUserComment } from '../../../actions/AuthActions';

import { ImageView } from '../../../components';
import ReportUserModal from './ReportUserModal';

class CommentView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            comment : "",
            selectedComment : null,
            isReportUserVisible : false
        }
    }
    componentDidMount() {
        this.onRefresh();
    }


    componentWillReceiveProps(nextProps) {
        if(this.props.isPublic) {
            if(this.props.comment.success == false && nextProps.comment.success == true &&
                nextProps.comment.currentAction == ACTION_TYPES.POST_COMMENT_SUCCESS) {
                    this.onRefresh();

            } 
    
            if(this.props.comment.error != nextProps.comment.error && nextProps.comment.error &&
                nextProps.comment.currentAction == ACTION_TYPES.POST_COMMENT_FAILURE) {
                    showAlert("Whoops", nextProps.comment.error);
            } 
        }

    }

    onRefresh = () => {
        const { user, isPublic } = this.props; 
        if(user && user.id) {
            if(isPublic) {
                this.props.dispatch(getAcceptedComments(user.id))
            } else {
                this.props.dispatch(getMyAcceptedComments(user.id))
            }
           
        }
       
    }

    onSend = (text) => {
        const { auth, user} = this.props;
        console.log("onSend", user);
        if(text && text.length >0) {
            console.log("commentView write text",text);
            this.props.dispatch(postComment(auth.user.id, user.id, text));
            this.setState({comment: ''})
        }
    }
    onDeleteComment = () => {
        const {selectedComment} = this.state;
        if(selectedComment) {
            this.props.dispatch(deleteComment(selectedComment.id, selectedComment.reviewedById));
        }
    }

    onReportUser = () => {
        this.setState({isReportUserVisible: true});
    }

    onChatUser = () => {

    }
    onMenuPress = (index) => {
        switch(index) {
            case 0: 
                this.onDeleteComment()
                return;
            case 1:
                this.onReportUser()
                return;
            case 2:
                this.onChatUser()
                return;
        }
    }
    getWriteComment(){
        return <View style={{height: 64, backgroundColor: colors.red, 
                alignSelf:'stretch', marginTop: 8}}>
            <View style={{ flex:1, 
                         backgroundColor:'#ddc2b7', marginHorizontal:16, marginVertical:8,
                         borderRadius: 8, paddingVertical:8}}>
                <TextInput
                    style={{marginLeft:16, flex:1, fontSize: 17}}
                    placeholder="Write a comment ..."
                    placeholderTextColor={'#6c6f6d'}
                    value={this.state.comment}
                    onChangeText={text => {
                        this.setState({comment: text})
                    }}
                    multiline={false}
                    onSubmitEditing={text => {
                    
                        this.onSend(this.state.comment);
                    }}
                    returnKeyType={'send'}
                />
            </View>
            
        </View>
    }
    getCommentItem = (comment) => {
        return <View style={{alignSelf:'stretch', height: 65, 
               }}
               key={'commentitem'+comment.id}
               >
            <View style={{alignSelf:'stretch', height: 64, 
               flexDirection:'row', alignItems:'center', marginLeft: 16}}
               key={'commentitem'+comment.id}>
                <ImageView
                    shortUrl={comment.smallImageUrl}
                    defaultImage={require('../../../../assets/images/boneprofile.png')}
                    style={{width: 48, height: 48, borderRadius: 24}}
                />
                <Text style={{fontSize: 17, color: 'white', marginEnd:16, marginStart: 16, flex:1}} numberOfLines={2}> 
                    {comment.review}
                </Text>
                {
                    !this.props.isPublic && 
                    <View style={{height: 48, width: 0.5, backgroundColor: colors.gray}}/>
                }
                {
                    !this.props.isPublic && 
                    
                    <TouchableOpacity 
                    style={{ width:64, height:64, justifyContent:'center',
                    alignItems:'center', alignSelf:'flex-end'}}
                        onPress={()=>{
                            this.openMenu(comment);
                        }}
                    >
                        <Image style={{width: 32, height: 32}} source={require('../../../../assets/images/dot_chat.png')} resizeMode='contain'/>
                    </TouchableOpacity>
                }
            </View>
            <View style={{alignSelf:'stretch',height:0.5, marginHorizontal:16, backgroundColor:colors.gray}}/>
        </View>
    }
    openMenu(comment) {
        this.setState({selectedComment : comment}, () => {
            this.ActionSheet.show();
        })
    }
    getComments(isPublic) {
        const { comments } =  isPublic ? this.props.comment : this.props.auth;

        return <View style={{alignSelf:'stretch', backgroundColor:colors.black, marginBottom:32 }}>
      
            {
                comments.map(comment => {return this.getCommentItem(comment)})
            }
        </View>
       
    }
    render() {
        return (<View  style={styles.container}>
            {
                this.props.isPublic &&
                this.getWriteComment()
            }
            {
                this.getComments(this.props.isPublic)
            }
        {
            !this.props.isPublic &&
            <ActionSheet
                ref={o => this.ActionSheet = o}
                options={['Delete', 'Report', 'Chat', 'Cancel']}
                cancelButtonIndex={3}
                onPress={(index) => { 
                    this.onMenuPress(index);
                }}
            />
        }
        {
           !this.props.isPublic &&
            <ReportUserModal
            onReport={(reason, comment)=>{
                this.setState({isReportUserVisible: false})
                this.props.dispatch(reportUserComment(this.props.auth.user.id, this.state.selectedComment.reviewedById, reason, comment)) 
            }}
            onCancel={()=>{
                this.setState({isReportUserVisible: false})
            }}
            isVisible={this.state.isReportUserVisible}
            />
        }


        </View>
        );
    }
}


CommentView.proptypes = { 
    user: PropTypes.object.isRequired,
    isPublic: PropTypes.bool
};

const styles = StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      alignItems: 'center',
      backgroundColor: 'transparent'
    },
});

const mapStateToProps = (state) => ({ auth: state.auth, comment: state.comment,  });

export default connect(mapStateToProps)(CommentView);
  