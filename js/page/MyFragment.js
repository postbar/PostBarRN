/**
 * Created by liaowm5 on 1/21/18.
 */
import React, {Component} from 'react';
import {AsyncStorage,Button,Dimensions,Text, View, StyleSheet,PixelRatio, TouchableNativeFeedback,ToastAndroid,Alert, ScrollView} from 'react-native';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import PropTypes from 'prop-types';
import auth from '../services/auth';
import {
    ActivityIndicator,
    Flex,
    Icon,
    WhiteSpace,
    WingBlank,
} from '@ant-design/react-native';
import { Avatar } from 'react-native-elements'

const Circle = () => {
    const size = px2dp(84);
    const style = {
      borderRadius: size / 2,
      backgroundColor: '#527fe4',
      width: size,
      height: size,
      margin: 1,
    };
    return <View style={style} />;
};

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');

import base from '../config/config';
const baseUrl = base.baseUrl;
export default class MyFragment extends Component{

    constructor(props){
        super(props);
        this.state = {
            token: '',
            user:{
                id:1,
                avatar:'',
                name: '',
                email: ''
            },
            pending:true,
        };
        AsyncStorage.getItem('token').then((value)=>{
            this.setState({
                token:value,
                pending:true,
            });
            this._fetchUserData();
        });
    }

    //错误登录处理
    componentDidCatch() {
        AsyncStorage.signOut()
        .then(()=>{
            this.props.navigation.navigate('SignInPage');
        });
    }

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                AsyncStorage.getItem('token').then((value)=>{
                    this.setState({
                        token:value,
                        pending:true,
                    });
                    this._fetchUserData();
                });
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    _onPressCallback(position){
        switch(position){
            case 0:  //title
                this.props.navigator.push({
                    component: IndividualPage
                });
                break;
 
            case 1:  // add occupation
                this._alert();
                break;
 
            case 2:  //collection
                this._alert();
                break;
 
            case 3:  //read articles
                this._alert();
                break;
 
            case 4:  //tags
                this._alert();
                break;
 
            case 5:  //rank
                this._alert();
                break;
 
            case 6: {  //setting
                this.props.navigator.push({
                    component: SettingPage
                });
                break;
            }
        }
    }
    //<Circle/>
    renderMyInfo(){
        return (
            <View>
                <TouchableNativeFeedback onPress={() => alert("个人主页")}>
                    <Flex style={{backgroundColor: 'white',paddingLeft: px2dp(14),paddingRight: px2dp(14)}}>
                            <Avatar
                            size="large"
                            rounded
                            source={{uri:this.state.user.avatar}}
                            onPress={() => this.props.navigation.push('ProfilePage', {userId: this.state.user.id})}
                            activeOpacity={0.7}
                            />
                        <Flex direction="row" style={styles.infoContainer}>
                            <View>
                                <Flex.Item>
                                    <Text style={styles.infoDownText}>{this.state.user.name}</Text>
                                </Flex.Item>
                                <Flex.Item>
                                    <Text style={styles.infoUpText}>查看个人主页或编辑资料</Text>
                                </Flex.Item>
                            </View>
                        </Flex>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Icon name="right" style={{fontSize: px2dp(22),color: "#999"}} />
                        </View>
                    </Flex>
                </TouchableNativeFeedback>
                <Flex direction="row">
                    <TouchableNativeFeedback onPress={() => alert("关注")}>
                        <View style={{width:width/4}}>
                            <Text style={styles.downText}>0</Text>
                            <Text style={styles.upText}>关注</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => alert("粉丝")}>
                        <View style={{width:width/4}}>
                            <Text style={styles.downText}>9</Text>
                            <Text style={styles.upText}>粉丝</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => alert("关注的吧")}>
                        <View style={{width:width/4}}>
                            <Text style={styles.downText}>30</Text>
                            <Text style={styles.upText}>关注的吧</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => alert("帖子")}>
                        <View style={{width:width/4}}>
                            <Text style={styles.downText}>3</Text>
                            <Text style={styles.upText}>帖子</Text>
                        </View>
                    </TouchableNativeFeedback>
                </Flex>
            </View>
        );
    }

    render(){
        return(
            <View style={styles.container}>
                <Flex justify="between">
                    <Flex.Item>
                        <TouchableNativeFeedback onPress={() => alert("二维码")}>
                            <View style={styles.item}>
                                <Icon name="scan" style={{color:'black'}}/>
                            </View>
                        </TouchableNativeFeedback>
                    </Flex.Item>
                    <Flex.Item>
                        <View style={styles.item}>
                            <Text></Text>
                        </View>
                    </Flex.Item>
                    <Flex.Item>
                        <View style={styles.item}>
                            <Text></Text>
                        </View>
                    </Flex.Item>
                    <Flex.Item>
                        <View style={styles.item}>
                            <Text style={{textAlignVertical:'center',fontSize: px2dp(16),color:'black',textAlign:'center',}}>我的</Text>
                        </View>
                    </Flex.Item>
                    <Flex.Item>
                        <TouchableNativeFeedback onPress={() => alert("装扮中心")}>
                            <View style={styles.item}>
                                <Icon name="shop" style={{color:'black'}}/>
                            </View>
                        </TouchableNativeFeedback>
                    </Flex.Item>
                    <Flex.Item>
                        <TouchableNativeFeedback onPress={() => alert("设置")}>
                            <View style={styles.item}>
                                <Icon name="setting" style={{color:'black'}}/>
                            </View>
                        </TouchableNativeFeedback>
                    </Flex.Item>
                    <Flex.Item>
                        <View style={styles.item}>
                            <ActivityIndicator animating={this.state.pending} text=" " />
                        </View>
                    </Flex.Item>
                </Flex>
                <ScrollView>
                    {this.renderMyInfo()}
                    <View style={styles.list}>
                        <Item icon="heart" text="我的收藏" subText="300" onPress={() => alert("我的收藏")}/>
                        <Item icon="eye" text="浏览历史" subText="15" onPress={() => alert("浏览历史")}/>
                        <Item icon="team" text="我的群组" subText="9" onPress={() => alert("我的群组")}/>
                    </View>
                    <View style={styles.list}>
                        <Item icon="crown" text="会员中心" onPress={() => alert("会员中心")}/>
                        <Item icon="pic-left" text="申请贴吧" onPress={() => this.props.navigation.push('NewBarPage')}/>
                    </View>
                    <View style={{height:px2dp(20)}}></View>
                    <View style={styles.list}>
                        <TouchableNativeFeedback>
                            <Text style={{borderWidth:px2dp(0.1),borderColor:'#f5f5f5',color:'#a8071a',backgroundColor:'white',fontSize: px2dp(16),textAlign:'center',textAlignVertical:'center',height:px2dp(48)}} onPress={() => this._signOut()}>注销</Text>
                        </TouchableNativeFeedback>
                    </View>
                </ScrollView>
            </View>
        );
    }
    //<Item icon="crown" text="注销" onPress={() => this._signOut()}/>

    _fetchUserData() {
        let url = baseUrl+'/user/info';
        fetch(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                user:responseData.data,
                pending:false,
            });
        })
        .catch(error => {
            alert.error(error);
            this.setState({
                pending:false,
            });
        });
    }

    _signOut(){
        auth.signOut();
        ToastAndroid.show("注销成功，正在跳转至登录页面...", ToastAndroid.SHORT);
        //this.props.navigation.navigate('SignInPage');
        this.props._JumpSignIn();
    }

    _alert(){
        Alert.alert(
            'Message',
            "This function currently isn't available",
            [{text: 'OK', onPress: () => {}}]
        );
    }
}

class Item extends Component{
    static propTypes = {
        icon: PropTypes.string.isRequired,
        iconColor: PropTypes.string,
        text: PropTypes.string.isRequired,
        subText: PropTypes.string,
        onPress: PropTypes.func
    }

    static defaultProps = {
        iconColor: 'gray'
    }

    render(){
        const {icon, iconColor, text, subText, onPress} = this.props;

        return(
            <TouchableNativeFeedback onPress={onPress}>
                <View style={styles.listItem}>
                    <Icon name={icon} style={{ fontSize: px2dp(28), color: 'black' }}/>
                    <Text style={{color: 'black', fontSize: px2dp(16), marginLeft: px2dp(20)}}>{text}</Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Icon name="right" style={{fontSize: px2dp(22),color: "#999"}} />
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.pageBackgroundColor
    },
    list: {
        flex: 1,
        borderTopWidth: 1/PixelRatio.get(),
        borderTopColor: '#e4e4e4',
        marginTop: px2dp(16)
    },
    listItem: {
        flex: 1,
        height: px2dp(55),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: px2dp(14),
        paddingRight: px2dp(14),
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 1/PixelRatio.get()
    },
    downText: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: px2dp(24),
        textAlignVertical:'center',
        textAlign:'center',
        height: px2dp(48),
        color:'#000',
        backgroundColor: '#fff',
    },
    upText: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: px2dp(12),
        textAlign:'center',
        height: px2dp(36),
        color:'#999',
        backgroundColor: '#fff',
    },
    infoContainer:{
        width:width*8/15,
        marginLeft:px2dp(16),
        marginRight:px2dp(16),
    },
    infoDownText: {
        fontSize: px2dp(24),
        textAlignVertical:'center',
        height: px2dp(48),
        color:'#000',
        backgroundColor: '#fff',
    },
    infoUpText: {
        fontSize: px2dp(12),
        textAlign:'center',
        height: px2dp(36),
        color:'#999',
        backgroundColor: '#fff',
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        height: px2dp(48),
        backgroundColor: '#fff',
    },
    itemLeft: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: px2dp(48),
        backgroundColor: '#fff',
    },
});