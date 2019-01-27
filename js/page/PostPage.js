/**
 * Created by liaowm5 on 1/23/18.
 */

import React, {Component} from 'react';
//import moment from 'moment';
import moment from 'moment/min/moment-with-locales';
moment.locale('zh-cn');
import {AsyncStorage,Dimensions,FlatList,Keyboard,KeyboardAvoidingView,ScrollView,StyleSheet,Text,TextInput,ToastAndroid,TouchableNativeFeedback, View} from 'react-native';
import 
{ 
    ActionSheet,
    ActivityIndicator,
    Button,
    Card,
    Flex,
    Icon,
    Tabs,
    WhiteSpace,
    WingBlank,
} from '@ant-design/react-native';

import { Avatar,Divider } from 'react-native-elements'

import Image from 'react-native-scalable-image';

import px2dp from '../utils/px2dp';
import axios from 'axios';

import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');
import base from '../config/config';
const baseUrl = base.baseUrl;
export default class PostPage extends Component{
    static navigationOptions = ({ navigation }) => {
        return {
          headerRight: (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator animating={navigation.getParam('pending')} text=" " /></View>
          ),
        };
    };
    constructor(props){
        super(props)
        const { navigation } = this.props;
        this.state = {
            refreshing: true,
            loading: false,
            hasScrolled: false,
            isCommentLoadEnd: false,
            commentPage: 0,
            postData:{},
            postImageList:[
            ],
            commentList: [
            ],
            clicked: 'none',
            modalVisible: false,
            picBtnVisible: false,
            images: [
                
            ],
            text:'',
            token:'',
            userFocused: true,
            userId:1,
            barId:navigation.getParam('barId', '1'), //动态获取barId
            postId:navigation.getParam('postId', '1'),//动态获取postId
        }
        this.showActionSheet = () => {
            const BUTTONS = [
              'Operation1',
              'Operation2',
              'Operation3',
              'Delete',
              'Cancel',
            ];
            ActionSheet.showActionSheetWithOptions(
              {
                title: 'Title',
                message: 'Description',
                options: BUTTONS,
                cancelButtonIndex: 4,
                destructiveButtonIndex: 3,
              },
              buttonIndex => {
                this.setState({ clicked: BUTTONS[buttonIndex] });
              }
            );
        };
        this.showShareActionSheet = () => {
            const opts = {
              message: 'Message to go with the shared url',
              title: 'Share Actionsheet',
            };
            ActionSheet.showShareActionSheetWithOptions(
              opts,
              error => alert(error),
              (success, method) => {
                let text;
                if (success) {
                  text = `Shared with ${method}`;
                } else {
                  text = 'Did not share';
                }
                this.setState({ text });
              }
            );
          };
    }

    componentWillMount () {
        // Todo : TextInput+ScrollView在光标丢失时 键盘收起 导致 按键事件没有触发
        //this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',()=> this.setState({picBtnVisible:true}));
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',()=> this.setState({picBtnVisible:false}));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',()=> this.setState({picBtnVisible:false}));
      }

    componentDidMount() {
        Keyboard
        AsyncStorage.getItem('token').then((value)=>{
            this.setState({
                token:value
            });
            this._onRefresh();
        });
        //this._fetchPostData();
        //this._fetchCommentList();
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
                    this._onRefresh();
                });
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    renderListHeader() {
        const tabs = [
            { title: '全部回复' },
            { title: '只看楼主' },
        ];
        return (
            this.state.postData.user == undefined ? <View></View>:
            <View style={{ flex: 1 }}>
                <View>
                    <TouchableNativeFeedback 
                    onPress={() => ToastAndroid.show("暂未实现",ToastAndroid.SHORT)}
                    >
                    <View style={{padding:px2dp(14)}}>
                        <View style={{flexDirection:"row",alignItems:'center'}}>
                            <View style={{flex:10}}>
                                <Avatar
                                size="small"
                                rounded
                                title="MT"
                                source={{uri:this.state.postData.user.avatar}}
                                onPress={() => this.props.navigation.push('ProfilePage', {userId: this.state.postData.user.id})}
                                activeOpacity={0.7}
                                />
                            </View>
                            <View direction="row" style={{flex:75,marginLeft: px2dp(10)}}>
                                <Flex>
                                    <Text style={styles.infoDownText}>{this.state.postData.user.name}</Text>
                                </Flex>
                                <Flex>
                                    <Text style={styles.infoUpText}>{this.state.postData.bar.name+"吧"}</Text>
                                    <Text>  |  </Text>
                                    <Text style={styles.infoUpText}>{moment(this.state.postData.created_time).fromNow()}</Text>
                                </Flex>
                            </View>
                            <View style={{flex:15,alignItems:'flex-end'}}>
                                {this.renderFocusButton()}
                            </View>
                        </View>
                        <WhiteSpace size="lg" />
                        <View>
                            <Text style={{color:'black'}}>{this.state.postData.content}</Text>
                        </View>
                        <WhiteSpace size="sm" />
                        <View>
                            {this.renderImage()}
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
                    <TouchableNativeFeedback onPress={()=>this.props.navigation.push('BarPage', {barId: this.state.postData.bar.id})}>
                    <View style={{flexDirection:"row",alignItems:'center',margin:px2dp(14),backgroundColor:'#e8e8e8'}}>
                        <View style={{flex:15}}>
                            <Avatar
                            size="medium"
                            source={{uri:this.state.postData.user.avatar}}
                            onPress={() => {}}
                            activeOpacity={0.7}
                            />
                        </View>
                        <View style={{flex:75,marginLeft: px2dp(10)}}>
                            <Flex>
                                <Text style={styles.barDownText}>{this.state.postData.bar.name+"吧"}</Text>
                            </Flex>
                            <Flex direction="column" alignItems='flex-start'>
                                <Text style={styles.barUpHeaderText}>关注 帖子</Text>
                            </Flex>
                        </View>
                        <View style={{flex: 10, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Icon name="right" style={{fontSize: px2dp(22),color: "#999",paddingRight: px2dp(10)}} />
                        </View>
                    </View>
                    </TouchableNativeFeedback>
                </View>
                <Divider style={{ backgroundColor: '#eee' }} />
                <Tabs tabs={tabs} 
                tabBarActiveTextColor="black"
                initialPage={0}
                tabBarUnderlineStyle={{backgroundColor: 'black'}}
                >
                    <View style={styles.tabItem}>
                        <Text>全部回复</Text>
                    </View>
                    <View style={styles.tabItem}>
                        <Text>只看楼主</Text>
                    </View>
                </Tabs>
            </View>
        );
    }

    renderFocusButton(){
        //_focusBar
        return this.state.userFocused ? 
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

    //animating={this.state.loading}
    renderSeparator () {
        return <Divider style={{ backgroundColor: '#eee' }} />;
    }

    renderWhiteSpaceSeparator () {
        return <View style={{ height: px2dp(10) }} />;
    }

    renderFooter () {
        return  this.state.isCommentLoadEnd ? <Flex style={{backgroundColor:'#eee',padding:px2dp(30),}}><Text style={{flex:1,textAlign:'center'}}>- -  已到底部  - -</Text></Flex>:
        <View style={{backgroundColor:'#eee',padding:px2dp(30),paddingBottom:px2dp(60)}}><ActivityIndicator animating={this.state.loading} text="加载中..." /></View>
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
            if(responseData.code!=0)
                return null;
            this.setState({
                userFocused:responseData.data.focused,
            });
        })
        .catch(error => {
            alert(error);
        });
    }

    //style={{backgroundColor:'grey',width: width - px2dp(32), height: (width-px2dp(32))*16/25}} 
    //'http://127.0.0.1:8088/bar/0/post/0/image/0',
    // 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548331300109&di=6bc9b6185561bb5aceb0ae19ce64d48b&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F59886a92b19083f7355cfef7236036635c165d46eb1e-w7zyQW_fw658'
    _setPostImageListData (data){
        let imagess = [];
        let imageList = [];
        for (let i=0;i<data.ordre;i++){
            imageList.push({
                'barId':data.bar.id,
                'postId':data.id,
                'ordre':i
            });
            imagess.push(
                {
                    'url':baseUrl+'/bar/'+data.bar.id+'/post/'+data.id+'/image/'+i+''
                }
            );
        }
        
        this.setState({
            images:[...this.state.images,
            ...imagess]
        });
        this.setState({
            postImageList:imageList,
        })
    }

    _setCommentImageListData (data){
        let imagess = [];
        for (let i=0;i<data.length;i++){
            data[i].images=[];
            for(let j=0;j<data[i].ordre;j++){
                data[i].images.push({
                    'barId':data[i].post.bar.id,
                    'postId':data[i].post.id,
                    'commentId':data[i].id,
                    'ordre':j
                });
                imagess.push(
                    {
                        'url':baseUrl+'/bar/'+data[i].post.bar.id+'/post/'+data[i].post.id+'/comment/'+data[i].id+'/image/'+j+''
                    }
                );
            }
        }
        this.setState({
            images:[...this.state.images,
                ...imagess]
        });
    }

    renderImageZommer() {
        //alert(this.state.images);
        this.setState({
            modalVisible:true,
        })
    }

    renderImage () {
        //alert(JSON.stringify(imageList));
        //alert(JSON.stringify(this.state.postImageList))
        //'http://192.168.2.181:8088/bar/'+item.barId+'/post/'+item.postId+'/image/'+item.i+''
        //'http://192.168.2.181:8088/bar/0/post/0/image/0'

        /*
        <Image source={{uri: baseUrl+'/bar/'+item.barId+'/post/'+item.postId+'/image/'+item.ordre+''}}
                        width={width - px2dp(32)}
                    />
        */
        return (
            <View>
            <FlatList
                data={this.state.postImageList}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => 
                <TouchableNativeFeedback onPress={()=>this.renderImageZommer()}>
                    <Image source={{uri: baseUrl+'/bar/'+item.barId+'/post/'+item.postId+'/image/'+item.ordre+''}}
                        width={width - px2dp(32)}
                    />
                </TouchableNativeFeedback>
                }
                ItemSeparatorComponent={this.renderWhiteSpaceSeparator.bind(this)}
            />
            </View>
        );
    }

    /*
    <Image source={{uri: baseUrl+'/bar/'+item.barId+'/post/'+item.postId+'/comment/'+item.commentId+'/image/'+item.ordre+''}}/>
    */

    renderCommentImage (i) {
        return (
            <View>
            <FlatList
                data={this.state.commentList[i].images}
                keyExtractor={(item, index) => index}
                renderItem={({item}) => 
                <TouchableNativeFeedback onPress={()=>this.renderImageZommer()}>
                    <Image width={width*11/15} source={{uri: baseUrl+'/bar/'+item.barId+'/post/'+item.postId+'/comment/'+item.commentId+'/image/'+item.ordre+''}}/>
                </TouchableNativeFeedback>
                }
                ItemSeparatorComponent={this.renderWhiteSpaceSeparator.bind(this)}
            />
            </View>
        );
    }

    /*
    inputFocused(refName) {
        this.setTimeout(
          () => {
            var scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
              React.findNodeHandle(this.refs[refName]),
              60, //additionalOffset
              true
            );
          },
          50
        );
    }*/
      
    _sendMessage =() => {

        const { text } = this.state
        // Send your message via Flux
        //alert("Sending: "+text);
        let url = baseUrl+'/bar/'+this.state.barId+'/post/'+this.state.postId+'/comment';

        if(text.trim().length==0){
            ToastAndroid.show("请输入非空字符", ToastAndroid.SHORT);
            return null;
        }

        //alert(this.state.token)
        axios.put(url,
            {
                "content": text,
                "ordre": 0,
	            "images":[]
            }
            ,{
            headers: {
                "Authorization":this.state.token
            }
        }).then((response)=>{
            if(response.data.code == 0){
                ToastAndroid.show("评论成功" , ToastAndroid.SHORT);
                this._onRefresh();
                this.setState({
                    text:''
                });
            }else{
                ToastAndroid.show("评论失败，请检查网络" , ToastAndroid.SHORT);
            }
        }).catch((error)=>{
            ToastAndroid.show(error.message , ToastAndroid.SHORT);
        });
        //ToastAndroid.show("Sending: " + this.state.text, ToastAndroid.SHORT);
    }

    //KeyboardAvoidingView
    //<View  style={styles.barHistory} behavior="padding" enabled>
    /*
    ListHeaderComponent={this.renderListHeader()}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    ItemSeparatorComponent={this.renderSeparator.bind(this)}
    */

    /*
    keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps='never'
    */
    
    render () {
        return (
            <ScrollView
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}
            ref='scrollView'
            contentContainerStyle={styles.container}>
                <FlatList
                    data={this.state.commentList}
                    keyExtractor={(item, index) => index}
                    ListHeaderComponent={this.renderListHeader()}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    ItemSeparatorComponent={this.renderSeparator.bind(this)}
                    onScroll={this._onScroll}
                    onRefresh={()=>this._onRefresh()}
                    onEndReached={this._loadMore}
                    refreshing={this.state.refreshing}
                    renderItem={this.renderCommentItem}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                    style={{flex: 2}}
                />
                <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={()=>{this.setState({modalVisible:false})}}>
                    <ImageViewer imageUrls={this.state.images}/>
                </Modal>
                <Flex direction='column'>
                    <Flex style={styles.inputContainer}>
                        <TextInput
                        style={styles.newInput}
                        value={this.state.text}
                        multiline={true}
                        numberOfLines={1}
                        blurOnSubmit={true}
                        placeholder="说说你的看法..."
                        returnKeyType="send" 
                        ref="newComment"
                        onFocus={()=>{}}
                        onBlur={()=>{}}
                        onChangeText={(text) => this.setState({text})}
                        />
                        <TouchableNativeFeedback onPress={() => this.props.navigation.push('NewCommentPage', {barId: this.state.barId,postId: this.state.postId})}>
                            <View style={{flex:1,minHeight:px2dp(50),justifyContent:'center'}}>
                                <Icon name="picture"/>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback onPress={this.state.text.length > 1 ? this._sendMessage:()=>{}}>
                        <View style={{flex:1,minHeight:px2dp(50),justifyContent:'center'}}>
                            <Text style={this.state.text.length > 1 ? styles.inputSubmitYes:styles.inputSubmitNo}
                            >发布</Text>
                        </View>
                        </TouchableNativeFeedback>
                    </Flex>
                    <TouchableNativeFeedback onPress={() => this.props.navigation.push('NewCommentPage', {barId: this.state.barId,postId: this.state.postId})}>
                        { // Todo Bug
                            this.state.picBtnVisible ? 
                            <Flex 
                            onFocus={()=>{alert("fo")}}
                            style={{width:width,direction:'row',paddingLeft:px2dp(16),justifyContent:'flex-start'}}>
                                <Icon name="picture" style={{padding:px2dp(10)}} />
                            </Flex>:<View></View>
                        }
                    </TouchableNativeFeedback>
                </Flex>
            </ScrollView>
        );
    }
    

    //onSubmitEditing={this._sendMessage}

    renderCommentItem = ({ item,index }) => {
        return (
            <View>
                <TouchableNativeFeedback 
                    onPress={() => this.props.navigation.navigate('Post')}
                    >
                    <View style={{padding:px2dp(14)/*(14)*/}}>
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
                            <View style={{flex:70,marginLeft: px2dp(10)}}>
                                <Flex>
                                    <Text style={styles.infoDownText}>{item.user.name}</Text>
                                </Flex>
                                <Flex>
                                    <Text style={styles.infoUpText}>第{index+1}楼</Text>
                                    <Text>  |  </Text>
                                    <Text style={styles.infoUpText}>{moment(item.created_time).fromNow()}</Text>
                                </Flex>
                            </View>
                            <View 
                            style={{flex:10,flexDirection:"row",justifyContent:'flex-end',alignItems:'center'}}
                            >
                                <Image width={px2dp(16)} source={require('../image/icon_card_like_n.png')} onPress={()=>{alert("点赞")}}/>
                                <Text style={{marginLeft:px2dp(6),fontSize: px2dp(12)}}>0</Text>
                            </View>
                            <View style={{flex:10,alignItems:'flex-end'}}>
                                <Icon name="ellipsis"  onPress={this.showActionSheet}/>
                            </View>
                        </View>
                        <WhiteSpace size="lg" />
                        <View style={{flexDirection:"row",alignItems:'center'}}>
                            <View style={{flex:10}}/>
                            <Text style={{flex:90,marginLeft: px2dp(10),color:'black'}}>{item.content}</Text>
                        </View>
                        <WhiteSpace size="sm" />
                        <View style={{flexDirection:"row",alignItems:'center'}}>
                            <View style={{flex:10}}/>
                            <View style={{flex:90,marginLeft: px2dp(10)}}>
                                {this.renderCommentImage(index)}
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        )
    }

    _onScroll = () => {
        this.setState({hasScrolled: true})
    }

    _onRefresh() {
        this.setState({refreshing: true});
        this.props.navigation.setParams({ pending: true });
        this.setState({
            images:[]
        });
        this._fetchUserFocused();
        this._fetchPostData();
        this._fetchCommentList();
    }

    _loadMore = () => {
        if(!this.state.hasScrolled){ return null; }
      
        if(this.state.isCommentLoadEnd){
            //ToastAndroid.show('已到底部', ToastAndroid.SHORT);
            return null;
        }

        this.props.navigation.setParams({ pending: true });

        this.setState({
            loading:true,
        });

        let url = baseUrl+'/bar/'+this.state.barId+'/post/'+this.state.postId+'/comment'+'?page='+(this.state.commentPage + 1)+'&size=20';

        //here load data from your backend
        fetch(url)
            .then(response => response.json())
            .then(responseData => {
                if(responseData.data.content.length<20){
                    this.setState({
                        isCommentLoadEnd:true,
                    });
                    //ToastAndroid.show('已到底部', ToastAndroid.SHORT);
                }
                this._setCommentImageListData(responseData.data.content)
                this.setState({
                    commentList: [
                        ...this.state.commentList,
                        ...responseData.data.content
                    ],
                    commentPage: this.state.commentPage + 1,
                    loading:false,
                });
                this.props.navigation.setParams({ pending: false });
            })
            .catch(error => {
                this.setState({
                    loading:false,
                });
                this.props.navigation.setParams({ pending: false });
                alert(error);
            });
        
    }

    _fetchPostData() {
        let url = baseUrl+'/bar/'+this.state.barId+'/post/'+this.state.postId+'';
        //alert(url)
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    postData:responseData.data,
                    refreshing: false,
                });
                //alert("fetch success"+moment(responseData.created_time).fromNow());
                this._setPostImageListData(responseData.data);
            })
            .catch(error => {
                alert(error);
            });
    }

    _fetchCommentList() {
        let url = baseUrl+'/bar/'+this.state.barId+'/post/'+this.state.postId+'/comment';
        //alert(url)
        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {
                this._setCommentImageListData(responseData.data.content)
                this.setState({
                    commentList: responseData.data.content,
                    refreshing: false,
                    commentPage: 0,
                    isCommentLoadEnd: false,
                });
                //alert(JSON.stringify(responseData.data.content));
                //ToastAndroid.show('刷新成功', ToastAndroid.SHORT);
                this.props.navigation.setParams({ pending: false });
            })
            .catch(error => {
                alert(error);
                this.setState({
                    refreshing: false,
                });
                this.props.navigation.setParams({ pending: false });
            });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:px2dp(0),
        marginBottom:px2dp(0),
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        fontSize: px2dp(16),
        paddingLeft:px2dp(6),
        paddingRight:px2dp(6),
    },
    newInput: {
        flex:7,
        borderColor: '#eee',
        fontSize: px2dp(16),
        padding:px2dp(10),
        minHeight:px2dp(50),
        maxHeight:px2dp(100),
        height: 'auto'
    },
    inputSubmitNo: {
        fontSize: px2dp(16),
        textAlignVertical:'center',
        color: '#ddd'
    },
    inputSubmitYes: {
        fontSize: px2dp(16),
        textAlignVertical:'center',
        color: '#1890ff'
    },
    tabs:{
        color: 'black',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        backgroundColor: '#fff',
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
    barDownText: {
        fontSize: px2dp(14),
        textAlignVertical:'center',
        color:'#000',
    },
    barUpHeaderText: {
        fontSize: px2dp(12),
        textAlign:'left',
        textAlignVertical:'center',
        color:'#999',
    },
    /*
    barHistory: {
        width: width,
        alignItems:'center',
        backgroundColor: '#fff',
        paddingBottom:10,
        marginBottom:10,
    },
    barHistoryHead:{
        fontSize:16,
        color:'#666',
        padding:15,
    },
    barHistoryItem: {
        width: width*0.7,
        marginLeft:15,
    },
    barHistoryContainer:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop:10,
        margin: px2dp(10),
    },
    barHistoryName:{
        fontSize: px2dp(12),
        textAlignVertical:'center',
        textAlign:'center',
        color:'black',
    },*/
});