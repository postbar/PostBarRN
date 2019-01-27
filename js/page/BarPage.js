/**
 * Created by liaowm5 on 1/23/18.
 */

import React, {Component} from 'react';
import moment from 'moment/min/moment-with-locales';
moment.locale('zh-cn');
import {AsyncStorage,Button,ToastAndroid,Dimensions,FlatList,StatusBar,StyleSheet,Text,TouchableNativeFeedback, View} from 'react-native';
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

import ActionButton from 'react-native-action-button';

import px2dp from '../utils/px2dp';
import axios from 'axios';

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');
import base from '../config/config';
const baseUrl = base.baseUrl;
export default class BarPage extends Component{

    constructor(props){
        super(props)
        const { navigation } = this.props;
        this.state = {
            barData: {},
            postList:[],
            refreshing: true,
            token: '',
            barFocused: true,
            barId:navigation.getParam('barId', '1'), //动态获取barId
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

    renderListHeader() {
        return (
            this.state.barData.id == undefined ? <View></View>:
            <View>
                <View style={{flexDirection:"row",alignItems:'center',margin:px2dp(14)}}>
                    <View style={{flex:15}}>
                        <Avatar
                        size="medium"
                        source={{uri:this.state.barData.avatar}}
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                        />
                    </View>
                    <View style={{flex:70,marginLeft: px2dp(10)}}>
                        <Flex>
                            <Text style={styles.infoDownText}>{this.state.barData.name+"吧"}</Text>
                        </Flex>
                        <Flex direction="column" alignItems='flex-start'>
                            <Text style={styles.infoUpHeaderText}>LV0</Text>
                            <Text style={styles.infoUpHeaderText}>经验条</Text>
                        </Flex>
                    </View>
                    <View style={{flex:15,alignItems:'flex-end'}}>
                        {this.renderFocusButton()}
                    </View>
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
        onPress={()=>{this._unFocusBar()}}>
            <Text style={{color:'#fff',fontSize:px2dp(12)}}>
            已关注
            </Text>
        </Flex>
        :
        <Flex 
        direction="row" 
        style={{borderRadius:px2dp(1),backgroundColor:'#2082ff',padding:px2dp(5)}}
        onPress={()=>{this._focusBar()}}>
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
    //'#1abc9c' '#9b59b6' '#3498db'  rgba(231,76,60,1)
    renderPostList() {
        return (
            <View height={height-StatusBar.currentHeight*2.3}>
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
                <ActionButton buttonColor='#2082ff'>
                <ActionButton.Item buttonColor='rgba(231,76,60,1)' title="刷新" onPress={() => this._onRefresh()}>
                    <Icon name="reload" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                <ActionButton.Item buttonColor='#1abc9c' title="新帖" onPress={() => this.props.navigation.push('NewPostPage', {barId: this.state.barId})}>
                    <Icon name="plus" style={styles.actionButtonIcon} />
                </ActionButton.Item>
                </ActionButton>
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

    _focusBar (){
        let url = baseUrl+'/bar/'+this.state.barId+'/focus';
        axios.put(url,
            "focus",{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code==0){
                this._fetchBarFocused();
            }else{
                ToastAndroid.show(response.data.msg, ToastAndroid.SHORT)
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    _unFocusBar (){
        let url = baseUrl+'/bar/'+this.state.barId+'/focus';
        axios.delete(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code==0){
                this._fetchBarFocused();
            }else{
                ToastAndroid.show(response.data.msg, ToastAndroid.SHORT)
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    _fetchBarFocused (){
        let url = baseUrl+'/bar/'+this.state.barId+'/focus';
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
        this._fetchBarData();
        this._fetchPostList();
        this._fetchBarFocused();
    }

    _fetchBarData() {
        let url = baseUrl+'/bar/'+this.state.barId;
        fetch(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                barData:responseData.data,
            });
        })
        .catch(error => {
            alert.error(error);
        });
    }

    _fetchPostList() {
        //alert('_fetchPostList');
        let url = baseUrl+'/bar/'+this.state.barId+'/post';
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
    infoUpHeaderText: {
        fontSize: px2dp(12),
        textAlign:'left',
        textAlignVertical:'center',
        color:'#999',
        backgroundColor: '#fff',
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
      },
});
