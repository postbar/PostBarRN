/**
 * Created by liaowm5 on 1/21/18.
 */

import React, {Component} from 'react';
import moment from 'moment/min/moment-with-locales';
moment.locale('zh-cn');
import {AsyncStorage,Dimensions,FlatList,Keyboard,KeyboardAvoidingView,ScrollView,StyleSheet,Text,TextInput,ToastAndroid,TouchableNativeFeedback, View} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import px2dp from '../utils/px2dp';
import axios from 'axios';

import 
{ 
    ActivityIndicator,
    Button,
    Card,
    Flex,
    Icon,
    Tabs,
    WhiteSpace,
    WingBlank,
} from '@ant-design/react-native';
import { Avatar } from 'react-native-elements'

import Image from 'react-native-scalable-image';

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');
import base from '../config/config';
const baseUrl = base.baseUrl;
export default class SearchPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            postList:[],
            barList:[],
            userList:[],
            token: '',
            text:'',
            currentTab:0,
            refreshing:true,
        }
    }

    componentDidMount() {
        SplashScreen.hide();
        AsyncStorage.getItem('token').then((value)=>{
            this.setState({
                token:value
            });
            this._firstHandleSearch(0);
        });
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
                    extraData={this.state}
                    data={this.state.postList}
                    horizontal={false}
                    onRefresh={()=>this._handleSearch(this.state.currentTab)}
                    keyExtractor={(item, index) => index}
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
                        <View style={{flex:90,marginLeft: px2dp(10)}}>
                            <Flex>
                                <Text style={styles.infoDownText}>{item.user.name}</Text>
                            </Flex>
                            <Flex>
                                <Text style={styles.infoUpText}>{item.bar.name+"吧"}</Text>
                                <Text>  |  </Text>
                                <Text style={styles.infoUpText}>{moment(item.created_time).fromNow()}</Text>
                            </Flex>
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
                extraData={this.state}
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


    renderBarList() {
        return (
            <View>
                <FlatList
                    extraData={this.state}
                    data={this.state.barList}
                    horizontal={false}
                    keyExtractor={(item, index) => index}
                    onRefresh={()=>this._handleSearch(this.state.currentTab)}
                    renderItem={this.renderBarListItem}
                    refreshing={this.state.refreshing}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    renderBarListItem  = ({ item,index }) => {
        return (
            <View>
                <TouchableNativeFeedback 
                onPress={() => this.props.navigation.push('BarPage', {barId: item.id})}
                >
                <View style={{flexDirection:"row",alignItems:'center',margin:px2dp(14)}}>
                    <View style={{flex:15}}>
                        <Avatar
                        size="medium"
                        source={{uri:item.avatar}}
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                        />
                    </View>
                    <View style={{flex:70,marginLeft: px2dp(10)}}>
                        <Flex>
                            <Text style={styles.infoDownText}>{item.name+"吧"}</Text>
                        </Flex>
                        <Flex direction="column" alignItems='flex-start'>
                            <Text style={styles.infoUpHeaderText}>关注 1 帖子 1</Text>
                        </Flex>
                    </View>
                    <View style={{flex:15,alignItems:'flex-end'}}>
                        {this.renderFocusButton(index)}
                    </View>
                </View>
                </TouchableNativeFeedback>
            </View>
        );
    }

    renderFocusButton(index){
        //_focusBar
        return this.state.barList[index].focused ? 
        <Flex 
        direction="row" 
        style={{borderRadius:px2dp(1),backgroundColor:'#e8e8e8',padding:px2dp(5)}}
        onPress={()=>{this._unFocusBar(index)}}>
            <Text style={{color:'#fff',fontSize:px2dp(12)}}>
            已关注
            </Text>
        </Flex>
        :
        <Flex 
        direction="row" 
        style={{borderRadius:px2dp(1),borderColor:'#2082ff',borderWidth:px2dp(0.5),backgroundColor:'#fff',padding:px2dp(5)}}
        onPress={()=>{this._focusBar(index)}}>
            <Image width={px2dp(12)} source={require('../image/icon_like_blue.png')}/>
            <Text style={{color:'#2082ff',fontSize:px2dp(12)}}>
            关注
            </Text>
        </Flex>
    }

    renderUserList() {
        return (
            <View>
                <FlatList
                    data={this.state.userList}
                    horizontal={false}
                    keyExtractor={(item, index) => index}
                    onRefresh={()=>this._handleSearch(this.state.currentTab)}
                    renderItem={this.renderUserListItem}
                    refreshing={this.state.refreshing}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    renderUserListItem  = ({ item,index }) => {
        return (
            <View>
                <TouchableNativeFeedback 
                onPress={() => this.props.navigation.push('ProfilePage', {userId: item.id})}
                >
                <View style={{flexDirection:"row",alignItems:'center',margin:px2dp(14)}}>
                    <View style={{flex:15}}>
                        <Avatar
                        size="medium"
                        rounded
                        source={{uri:item.avatar}}
                        onPress={() => console.log("Works!")}
                        activeOpacity={0.7}
                        />
                    </View>
                    <View style={{flex:70,marginLeft: px2dp(10)}}>
                        <Flex>
                            <Text style={styles.infoDownText}>{item.name}</Text>
                        </Flex>
                        <Flex direction="column" alignItems='flex-start'>
                            <Text style={styles.infoUpHeaderText}>粉丝 1</Text>
                        </Flex>
                    </View>
                    <View style={{flex:15,alignItems:'flex-end'}}>
                        {this.renderUserFocusButton(index)}
                    </View>
                </View>
                </TouchableNativeFeedback>
            </View>
        );
    }

    renderUserFocusButton(index){
        //_focusBar
        return this.state.userList[index].focused ? 
        <Flex 
        direction="row" 
        style={{borderRadius:px2dp(1),backgroundColor:'#e8e8e8',padding:px2dp(5)}}
        onPress={()=>{this._unFocusUser(index)}}>
            <Text style={{color:'#fff',fontSize:px2dp(12)}}>
            已关注
            </Text>
        </Flex>
        :
        <Flex 
        direction="row" 
        style={{borderRadius:px2dp(1),borderColor:'#2082ff',borderWidth:px2dp(0.5),backgroundColor:'#fff',padding:px2dp(5)}}
        onPress={()=>{this._focusUser(index)}}>
            <Image width={px2dp(12)} source={require('../image/icon_like_blue.png')}/>
            <Text style={{color:'#2082ff',fontSize:px2dp(12)}}>
            关注
            </Text>
        </Flex>
    }
    
    renderContent = (tab, index) => {
        switch(index){
            case 0:
                return this.renderPostList();
            case 1:
                return this.renderBarList();
            case 2:
                return this.renderUserList();
        }
    }

    render() {
        const tabs = [
            { title: '贴',key:0 },
            { title: '吧',key:1 },
            { title: '人',key:2 },
        ];
        return (
            <View style={{ flex: 1 }}>
                <Flex style={styles.inputContainer}>
                    <Icon name='search' style={{flex:0}}/>
                    <TextInput
                    style={styles.newInput}
                    value={this.state.text}
                    blurOnSubmit={false}
                    placeholder="大家都在搜..."
                    returnKeyType="send" 
                    ref="search"
                    onChangeText={(text) => this.setState({text})}
                    onSubmitEditing={ () => this._handleSearch(this.state.currentTab) }
                    />
                    <TouchableNativeFeedback onPress={()=>this.props.navigation.goBack()}>
                        <Text style={{flex:1,color:'#1890ff'}}>取消</Text>
                    </TouchableNativeFeedback>
                </Flex>
                <Tabs tabs={tabs} 
                initialPage={0}
                tabBarActiveTextColor="black"
                tabBarUnderlineStyle={{backgroundColor: 'black'}}
                onChange={(tab,index)=>{
                    this.setState({currentTab:index})
                    this._firstHandleSearch(index);
                }}
                onTabClick={(tab,index)=>{
                    this._handleSearch(index)
                }}
                //onChange={(item)=>this.setState({currentTab:item.key})}
                >
                    {this.renderContent}
                </Tabs>
            </View>
        );
    }

    // tab首次加载 懒加载
    _firstHandleSearch(index){
        this.setState({
            refreshing:true
        });
        switch(index){
            case 0:
                this.state.postList.length!=0 ? '':this._searchPostList();
                break;
            case 1:
                this.state.barList.length!=0 ? '':this._searchBarList();
                break;
            case 2:
                this.state.userList.length!=0 ? '':this._searchUserList();
                break;
        }
    }

    _handleSearch(index){
        Keyboard.dismiss();
        this.setState({
            refreshing:true
        });
        switch(index){
            case 0:
                this._searchPostList();
                break;
            case 1:
                this._searchBarList();
                break;
            case 2:
                this._searchUserList();
                break;
        }
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

    _setBarFocusedData (data){
        for (let i=0;i<data.length;i++){
            data[i].focused=false;
        }
    }

    _setUserFocusedData (data){
        for (let i=0;i<data.length;i++){
            data[i].focused=false;
        }
    }

    _asyncSetAllBarFocusedData (){
        //alert(this.state.barList.length)
        for (let i=0;i<this.state.barList.length;i++){
            this._fetchBarFocused(i)
        }
    }

    _asyncSetAllUserFocusedData (){
        for (let i=0;i<this.state.userList.length;i++){
            this._fetchUserFocused(i)
        }
    }

    _searchPostList() {
        //alert('_fetchPostList');
        let url = baseUrl+'/search/post';
        axios.post(url,{
            'content':this.state.text
        },{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code == 0){
                this._setPostImageListData(response.data.data.content);
                this.setState({
                    postList:response.data.data.content,
                    refreshing:false,
                });
                //alert(response.data.data.content)
            }
        })
        .catch(error => {
            alert(error);
            this.setState({
                refreshing:false,
            });
        });
    }

    _searchBarList() {
        
        //alert('_fetchPostList');
        //ToastAndroid.show("_searchBarList",ToastAndroid.SHORT);
        let url = baseUrl+'/search/bar';
        axios.post(url,{
            'content':this.state.text
        },{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code == 0){
                this._setBarFocusedData(response.data.data.content);
                this.setState({
                    barList:response.data.data.content,
                });
                //alert(JSON.stringify(response.data.data.content))
                this._asyncSetAllBarFocusedData();
            }
            this.setState({
                refreshing:false,
            });
        })
        .catch(error => {
            alert(error);
            this.setState({
                refreshing:false,
            });
        });
    }

    _searchUserList() {
        //alert('_fetchPostList');
        let url = baseUrl+'/search/user';
        axios.post(url,{
            'content':this.state.text
        },{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code == 0){
                this._setUserFocusedData(response.data.data.content);
                this.setState({
                    userList:response.data.data.content,
                });
                //alert(JSON.stringify(response.data.data.content))
                this._asyncSetAllUserFocusedData();
            }
            this.setState({
                refreshing:false,
            });
        })
        .catch(error => {
            alert(error);
            this.setState({
                refreshing:false,
            });
        });
    }

    _focusBar (index){
        let url = baseUrl+'/bar/'+this.state.barList[index].id+'/focus';
        axios.put(url,
            "focus",{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code==0){
                this._fetchBarFocused(index);
            }else{
                ToastAndroid.show(response.data.msg, ToastAndroid.SHORT)
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    _unFocusBar (index){
        let url = baseUrl+'/bar/'+this.state.barList[index].id+'/focus';
        axios.delete(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code==0){
                this._fetchBarFocused(index);
            }else{
                ToastAndroid.show(response.data.msg, ToastAndroid.SHORT)
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    _fetchBarFocused (index){
        //alert(index+'[id='+this.state.barList[index].id+']')
        let url = baseUrl+'/bar/'+this.state.barList[index].id+'/focus';
        fetch(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.code!=0)
                return null;
            let barList = [ ...this.state.barList ];
            barList[index] = {...barList[index], focused: responseData.data.focused};
            //ToastAndroid.show(JSON.stringify(responseData.data.focused), ToastAndroid.SHORT);
            this.setState({
                barList
            });
        })
        .catch(error => {
            alert(error);
        });
    }

    _focusUser (index){
        let url = baseUrl+'/user/'+this.state.userList[index].id+'/focus';
        axios.put(url,
            "focus",{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code==0){
                this._fetchUserFocused(index);
            }else{
                ToastAndroid.show(response.data.msg, ToastAndroid.SHORT)
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    _unFocusUser (index){
        let url = baseUrl+'/user/'+this.state.userList[index].id+'/focus';
        axios.delete(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => {
            if(response.data.code==0){
                this._fetchUserFocused(index);
            }else{
                ToastAndroid.show(response.data.msg, ToastAndroid.SHORT)
            }
        })
        .catch((error) => {
            alert(error);
        });
    }

    _fetchUserFocused (index){
        let url = baseUrl+'/user/'+this.state.userList[index].id+'/focus';
        fetch(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => response.json())
        .then((responseData) => {
            if(responseData.code!=0)
                return null;
            let userList = [ ...this.state.userList ];
            //alert(responseData.data.focused)
            userList[index] = {...userList[index], focused: responseData.data.focused};
            this.setState({
                userList
            });
        })
        .catch(error => {
            alert(error);
        });
    }


}
const styles = StyleSheet.create({
    tabs:{
        color: 'black',
    },
    tabItem: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#fff',
        flexDirection: 'row',
        fontSize: px2dp(16),
        paddingLeft:px2dp(10),
        paddingRight:px2dp(10),
    },
    newInput: {
        flex:8,
        borderColor: '#eee',
        fontSize: px2dp(16),
        padding:px2dp(10),
        minHeight:px2dp(50),
        maxHeight:px2dp(100),
        height: 'auto'
    },
    infoDownText: {
        fontSize: px2dp(14),
        textAlignVertical:'center',
        color:'#000',
        backgroundColor: '#fff',
    },
    infoUpHeaderText: {
        fontSize: px2dp(12),
        textAlign:'left',
        textAlignVertical:'center',
        color:'#999',
        backgroundColor: '#fff',
    },
});