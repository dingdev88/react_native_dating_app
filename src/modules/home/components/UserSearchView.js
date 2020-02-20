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
import { ImageView, CollapsibleView, Button } from '../../../components';
import Autocomplete from 'react-native-autocomplete-input';
import HorizontalUserList from './HorizontalUserList';
import { search, emptySearch, enableOnline } from '../../../actions/UserActions';

const { width :deviceWidth, height: deviceHeight } = calculatePortraitDimension();

class UserSearchView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query : ''
        }
    }
    onSearch = (text, userId) => {
        if(text && text.length > 0) {
            let data = {
                id: userId,
                query: text,
                offset: 0,
                limit: 50,

            }
            this.props.dispatch(search(data));
        }else {
            this.props.dispatch(emptySearch());
        }
        
    }

    getSearchItemView = (item, i) => {
        return <TouchableOpacity onPress={() => {
            console.log('search item clinck', item);
            this.props.navigation.navigate("PublicProfile", {userId: item.id});
        }}>
        <View style={{flexDirection: 'row', height: 40, alignItems:'center', marginLeft:8}}>
            <ImageView style={styles.userImage} 
                shortUrl={item.smallImageUrl} 
                resizeMode='contain'/>
            <Text style={styles.username} > {item.username}</Text>
        </View>
      </TouchableOpacity>
    }

    getSearchBox = () => {
        const { searchUsers } = this.props.users;
        const { user } = this.props.auth;
        const { query } = this.state;
        return <View style={{flexDirection:'column', alignItems:'center', backgroundColor: colors.red, zIndex: 100}}>
            <Text style={[styles.text, {padding: 16, }]}>{'SEARCH BY NAME'}</Text>
            <View style={{marginLeft:16, marginRight:16, marginBottom:16, backgroundColor:'white', height: 40, alignSelf:'stretch' }}>
                <Autocomplete containerStyle={styles.autocompleteContainer}
                    data={searchUsers}
                    autoCapitalize="none"
                    autoCorrect={false}
                    defaultValue={query}
                    placeholder={'@username'}
                    onChangeText={text => {
                        if(user && user.id)
                            this.onSearch(text, user.id);
                        
                    }}
                    listStyle={{maxHeight: deviceHeight/3*2}}
                    renderItem={({ item, i }) => (
                        this.getSearchItemView(item, i)
                    )}
                />
            </View>
        </View>
    }

    getBottomView = () =>  {
        return <View style={{alignSelf: 'stretch', paddingHorizontal: 16}}>
            <Text style={[styles.title]}>{"WHO'S ONLINE"}</Text>
            <View style={{alignItems: 'center', alignSelf:'stretch',justifyContent:'center'}}>
                <Button
                    secondary
                    style={{ alignSelf: 'stretch', marginBottom: 32, marginTop:16, marignLeft :0, marginRight:0 }}
                    caption={'ONLINE NOW'}
                    textColor={'white'}
                    bgColor={colors.red}
                    onPress={() => {
                        this.props.dispatch(enableOnline(true))
                    }}
                />
            </View>

          </View>
      }
    
    render() {
        return (
            <View style={styles.transparentOverlay}>
                <View style={styles.container}>
                    {this.getSearchBox()}
                    <CollapsibleView
                        title={'NEW GUYS'}
                        getComponent={(collapsed)=>{
                      
                                return <HorizontalUserList
                                    type={'search'}
                                    navigation={this.props.navigation}
                                    showType={collapsed? 'horizontal': 'grid'}
                                />
                       
                            return null;
                           
                        }}
                    />
                    {this.getBottomView()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    transparentOverlay: {
        backgroundColor: colors.transparentBlack,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
 
    },
    container: {
        backgroundColor: 'white',
        flexDirection:'column'
    },
    text: {
        fontSize: 13,
        color: 'white'
    },
    autocompleteContainer: {
        flex: 1,
        
    },
    userImage: {
        padding: 8,
        width : 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.gray,
        backgroundColor: colors.gray
        
    },
    title: {
        fontSize: 13,
        color: colors.red
    },
    username: {
        marginLeft: 16,
        fontSize: 12,
        color: 'black',
        
    }
    

});
  
  
  
const mapStateToProps = (state) => ({auth: state.auth, users: state.users });
  
export default connect(mapStateToProps)(UserSearchView);