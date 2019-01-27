/**
 * Created by liaowm5 on 1/23/18.
 */

import React, {Component} from 'react';
import moment from 'moment/min/moment-with-locales';
moment.locale('zh-cn');
import {AsyncStorage,Button,ToastAndroid,Dimensions,FlatList,StyleSheet,Text,TouchableNativeFeedback, View} from 'react-native';
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
import axios from 'axios';

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');

import base from '../config/config';
const baseUrl = base.baseUrl;
export default class ProfliePage extends Component{

    constructor(props){
        super(props)
        const { navigation } = this.props;
        this.state = {
            userData: {
                id:undefined
            },
            postList:[],
            refreshing: true,
            token: '',
            userFocused: true,
            userId:navigation.getParam('userId', '1'), //动态获取barId
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
            this._onRefresh();
        });
    }

    renderListHeader() {
        return (
            this.state.userData && this.state.userData.id == undefined ? <View></View>:
            <View>
                <View style={{backgroundColor:'#eee',paddingTop:px2dp(100)}}>

                </View>
                <View style={{flexDirection:"row",alignItems:'center',margin:px2dp(14)}}>
                    <View style={{flex:15}}>
                        <Avatar
                        size="medium"
                        rounded
                        source={{uri:this.state.userData.avatar}}
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                        />
                    </View>
                    <View style={{flex:70,marginLeft: px2dp(10)}}>
                    </View>
                    <View style={{flex:15,alignItems:'flex-end'}}>
                        {this.renderFocusButton()}
                    </View>
                </View>
                <View style={{flexDirection:"column",alignItems:'flex-start',marginLeft:px2dp(14),marginRight:px2dp(14)}}>
                    <Flex>
                        <Text style={styles.userDownText}>{this.state.userData.name}</Text>
                    </Flex>
                    <Flex direction="column" alignItems='flex-start'>
                        <Text style={styles.userUpHeaderText}>268 粉丝  100 关注  46 关注的吧</Text>
                        <Text style={styles.userUpHeaderText}>吧龄: 6.8年</Text>
                        <Text style={styles.userUpHeaderText}>简介: </Text>
                    </Flex>
                </View>
                <View style={{height:px2dp(6) ,backgroundColor:"#eee"}} />
            </View>
        );
    }

    renderFocusButton(){
        //_focusBar
        return this.state.barFocused ? 
        <Flex 
        direction="row" 
        style={{borderRadius:px2dp(1),backgroundColor:'#e8e8e8',padding:px2dp(5)}}
        onPress={()=>{this._unFocusUser()}}>
            <Text style={{color:'#fff',fontSize:px2dp(12)}}>
            已关注
            </Text>
        </Flex>
        :
        <Flex 
        direction="row" 
        style={{borderRadius:px2dp(1),backgroundColor:'#2082ff',padding:px2dp(5)}}
        onPress={()=>{this._focusUser()}}>
            <Image width={px2dp(12)} source={require('../image/icon_like.png')}/>
            <Text style={{color:'#fff',fontSize:px2dp(12)}}>
            关注
            </Text>
        </Flex>
    }


    renderSeperator(){
        return (
            <View style={{height:px2dp(6) ,backgroundColor:"#eee"}} />
        );
    }

    //_onRefresh = () => ToastAndroid.show('onRefresh: nothing to refresh :P',ToastAndroid.SHORT);

    renderPostList() {
        return (
            <View>
                <FlatList
                    data={this.state.postList}
                    horizontal={false}
                    keyExtractor={(item, index) => index}
                    ListHeaderComponent={this.renderListHeader()}
                    onRefresh={()=>this._onRefresh()}
                    renderItem={this.renderPostListItem}
                    refreshing={this.state.refreshing}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={this.renderSeperator}
                />
            </View>
        )
    }

    _getMonth(i){
        const month = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
        return month[i]+'月';
    }

    renderPostListItem  = ({ item,index }) => {
        return (
            <View>
                <TouchableNativeFeedback 
                onPress={() => this.props.navigation.push('PostPage', {barId: item.bar.id,postId: item.id})}
                >
                <View style={{flex:1,padding:px2dp(14),flexDirection:"row"}}>
                    <View style={{flex:12}}>
                        <Text>{moment(item.created_time).toDate().getDate()}</Text>
                        <Text>{this._getMonth(moment(item.created_time).toDate().getMonth())}</Text>
                        <Text>{moment(item.created_time).toDate().getFullYear()}</Text>
                    </View>
                    <View style={{flex:78,flexDirection:"column",alignItems:'flex-start'}}>
                        <Text style={styles.barText}>{item.bar.name+"吧"}</Text>
                        <WhiteSpace size="lg" />
                        <View>
                            <Text style={{color:'black'}}>{item.content}</Text>
                        </View>
                        <WhiteSpace size="sm" />
                        <View style={{flexDirection:"row",alignItems:'center'}}>
                            {this.renderPostImage(index)}
                        </View>
                        <Flex style={{padding:px2dp(0),marginRight:px2dp(14)}}>
                            <TouchableNativeFeedback onPress={()=>alert("分享")}>
                            <View style={{flex:1,height:px2dp(50),alignItems: 'center',justifyContent:'center'}}>
                                <Text style={{textAlign:'center'}}>分享</Text>
                            </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={()=>alert("分享")}>
                            <View style={{flex:1,height:px2dp(50),alignItems: 'center',justifyContent:'center'}}>
                                <Text style={{textAlign:'center'}}>评论</Text>
                            </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={()=>alert("分享")}>
                            <View style={{flex:1,height:px2dp(50),alignItems: 'center',justifyContent:'center'}}>
                                <Text style={{textAlign:'center'}}>点赞</Text>
                            </View>
                            </TouchableNativeFeedback>
                        </Flex>
                    </View>
                </View>
                </TouchableNativeFeedback>
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
                    //width={Dimensions.get('window').width*11/15}
                    height={height/3}
                    width={Dimensions.get('window').width-px2dp(32)}
                    source={{uri: baseUrl+'/bar/'+item.barId+'/post/'+item.postId+'/image/'+item.ordre+''}}
                    //style={{maxHeight:height/3}}
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

    _focusUser (){
        let url = baseUrl+'/user/'+this.state.userId+'/focus';
        axios.put(url,
            "focus",{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code==0){
                this._fetchUserFocused();
            }else{
                ToastAndroid.show(response.data.msg, ToastAndroid.SHORT)
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    _unFocusUser (){
        let url = baseUrl+'/user/'+this.state.userId+'/focus';
        axios.delete(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code==0){
                this._fetchUserFocused();
            }else{
                ToastAndroid.show(response.data.msg, ToastAndroid.SHORT)
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    _fetchUserFocused (){
        let url = baseUrl+'/user/'+this.state.userId+'/focus';
        fetch(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                barFocused:responseData.data.focused,
            });
        })
        .catch(error => {
            alert.error(error);
        });
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
        this._fetchUserData();
        this._fetchPostList();
        this._fetchUserFocused();
    }

    _fetchUserData() {
        let url = baseUrl+'/user/'+this.state.userId;
        fetch(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                userData:responseData.data,
            });
        })
        .catch(error => {
            alert.error(error);
        });
    }

    _fetchPostList() {
        //alert('_fetchPostList');
        let url = baseUrl+'/user/'+this.state.userId+'/post';
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
    userDownText: {
        fontSize: px2dp(24),
        textAlignVertical:'center',
        color:'#000',
        backgroundColor: '#fff',
    },
    userUpText: {
        fontSize: px2dp(12),
        textAlign:'center',
        textAlignVertical:'center',
        color:'#999',
        backgroundColor: '#fff',
        marginTop:px2dp(5),
        marginBottom:px2dp(5),
    },
    userUpHeaderText: {
        fontSize: px2dp(12),
        textAlign:'left',
        textAlignVertical:'center',
        color:'#999',
        backgroundColor: '#fff',
        marginTop:px2dp(5),
        marginBottom:px2dp(5),
    },
    barText: {
        fontSize: px2dp(12),
        textAlign:'center',
        textAlignVertical:'center',
        color:'#999',
        backgroundColor: '#fff',
    },
});
