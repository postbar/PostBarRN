/**
 * Created by liaowm5 on 1/23/18.
 */

import React, {Component} from 'react';
import moment from 'moment/min/moment-with-locales';
moment.locale('zh-cn');
import {AsyncStorage,ToastAndroid,Dimensions,FlatList,StyleSheet,Text,TouchableNativeFeedback, View} from 'react-native';
import 
{ 
    Icon,
    Card,
    Flex,
    Tabs,
    WhiteSpace,
    WingBlank,
} from '@ant-design/react-native';

import { Avatar } from 'react-native-elements'

import Image from 'react-native-scalable-image';

import { withNavigation } from 'react-navigation';

import px2dp from '../utils/px2dp';

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');

import base from '../config/config';
const baseUrl = base.baseUrl;
class TabHomeFragment extends Component{

    constructor(props){
        super(props)
        this.state = {
            postList:[],
            refreshing: true,
            token: '',
        }
    }

    componentDidMount() {
        this.setState({
            refreshing: true
        });
        AsyncStorage.getItem('token').then((value)=>{
            this.setState({
                token:value
            });
            this._fetchPostList();
        });
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.setState({
                    refreshing: true
                });
                AsyncStorage.getItem('token').then((value)=>{
                    this.setState({
                        token:value
                    });
                    this._fetchPostList();
                });
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    renderSeperator(){
        return (
            <View style={{height:px2dp(12) ,backgroundColor:"#ddd"}} />
        );
    }

    //_onRefresh = () => alert('onRefresh: nothing to refresh :P');

    renderPostList() {
        return (
            <View>
                <FlatList
                    data={this.state.postList}
                    horizontal={false}
                    keyExtractor={(item, index) => index}
                    onRefresh={()=>this._onRefresh()}
                    renderItem={this.renderPostListItem}
                    refreshing={this.state.refreshing}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={this.renderSeperator}
                />
            </View>
        )
    }

    renderPostListItem  = ({ item,index }) => {
        return (
            <View>
                <TouchableNativeFeedback 
                onPress={() => this.props.navigation.push('PostPage', {barId: item.bar.id,postId: item.id})}
                >
                <View style={{flex:1,padding:px2dp(14)}}>
                    <View style={{flexDirection:"row",alignItems:'center'}}>
                        <View style={{flex:10}}>
                            <Avatar
                            size="small"
                            rounded
                            title="MT"
                            source={{uri:item.user.avatar}}
                            onPress={() => this.props.navigation.push('ProfilePage', {userId: item.user.id})}
                            activeOpacity={0.7}
                            />
                        </View>
                        <View style={{flex:80,marginLeft: px2dp(10)}}>
                            <Flex>
                                <Text style={styles.infoDownText}>{item.user.name}</Text>
                            </Flex>
                            <Flex>
                                <Text style={styles.infoUpText}>{item.bar.name+"吧"}</Text>
                                <Text>  |  </Text>
                                <Text style={styles.infoUpText}>{moment(item.created_time).fromNow()}</Text>
                            </Flex>
                        </View>
                        <View style={{flex:10,alignItems:'flex-end'}}>
                            <Icon name="close" onPress={()=>{alert("close")}}/>
                        </View>
                    </View>
                    <WhiteSpace size="lg" />
                    <View>
                        <Text style={{color:'black'}}>{item.content}</Text>
                    </View>
                    <WhiteSpace size="sm" />
                    <View style={{flexDirection:"row",alignItems:'center',width:width - px2dp(36)}}>
                        {this.renderPostImage(index)}
                    </View>
                </View>
                </TouchableNativeFeedback>
                <Flex style={{padding:px2dp(0)}}>
                    <TouchableNativeFeedback onPress={()=>alert("分享")}>
                    <View style={{height:px2dp(50),width:width/3,alignItems: 'center',justifyContent:'center'}}>
                        <Text style={{textAlign:'center'}}>分享</Text>
                    </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={()=>alert("分享")}>
                    <View style={{height:px2dp(50),width:width/3,alignItems: 'center',justifyContent:'center'}}>
                        <Text style={{textAlign:'center'}}>评论</Text>
                    </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={()=>alert("分享")}>
                    <View style={{height:px2dp(50),width:width/3,alignItems: 'center',justifyContent:'center'}}>
                        <Text style={{textAlign:'center'}}>点赞</Text>
                    </View>
                    </TouchableNativeFeedback>
                </Flex>
            </View>
        );
    }

    renderPostImage (i) {
        return (
            <View>
            <FlatList
                data={this.state.postList[i].images}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => 
                    <Image 
                    height={height/3}
                    width={Dimensions.get('window').width-px2dp(32)}
                    source={{uri: baseUrl+'/bar/'+item.barId+'/post/'+item.postId+'/image/'+item.ordre+''}}
                    />
                }
            />
            </View>
        );
    }

    render(){
        return (
            <View>
                 {this.renderPostList()}
            </View>
        );
    }

    _setPostImageListData (data){
        for (let i=0;i<data.length;i++){
            data[i].images=[];
            for(let j=0;j<(data[i].ordre==0? 0:1);j++){
                data[i].images.push({
                    'barId':data[i].bar.id,
                    'postId':data[i].id,
                    'ordre':j
                });
            }
        }
    }

    _onRefresh() {
        this.setState({refreshing: true});
        this._fetchPostList();
    }

    _fetchPostList() {
        //alert('_fetchPostList');
        let url = baseUrl+'/user/post/home';
        fetch(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => response.json())
        .then((responseData) => {
            this._setPostImageListData(responseData.data.content);
            this.setState({
                postList:responseData.data.content,
                refreshing:false,
            });
        })
        .catch(error => {
            alert.error(error);
        });
    }
}

const styles = StyleSheet.create({
    infoContainer:{
        width:width*13/15,
        marginLeft:px2dp(16),
        marginRight:px2dp(16),
    },
    infoDownText: {
        fontSize: px2dp(14),
        textAlignVertical:'center',
        color:'#000',
        backgroundColor: '#fff',
    },
    infoUpText: {
        fontSize: px2dp(12),
        textAlign:'center',
        textAlignVertical:'center',
        color:'#999',
        backgroundColor: '#fff',
    },
});

export default withNavigation(TabHomeFragment);