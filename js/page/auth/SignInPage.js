/**
 * Created by wangdi on 4/11/16.
 */
import React, {Component} from 'react';
import {AsyncStorage,BackHandler,Button,Text, View, StyleSheet,StatusBar , PixelRatio, Platform, TouchableOpacity, Image,TextInput,ToastAndroid} from 'react-native';
import { 
    Icon,
    ActivityIndicator, 
} from '@ant-design/react-native';
import { Divider } from 'react-native-elements';
import SplashScreen from 'react-native-splash-screen'
import SignUpPage from './SignUpPage';
import px2dp from '../../utils/px2dp';
import axios from 'axios';
import deviceStorage from '../../services/deviceStorage';
import auth from '../../services/auth';


import base from '../../config/config';
const baseUrl = base.baseUrl;
export default class SignInPage extends Component{
    constructor(props){
        super(props);
        this.handleBack = this._handleBack.bind(this);
        this.state = {
            email: "",
            passwd: "",
            pending: false,
            error: '',
        };

    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        //SplashScreen.hide();
        //auth.isSignIn() ? this.props.navigation.navigate('Home'):'';
        //BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        //BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
    }

    handleBackButton() {
        BackHandler.exitApp();
        //ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        return true;
    }

    _handleBack() {
        const navigator = this.props.navigator;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop()
            return true;
        }
        return false;
    }

    _signupCallback(){
        /*
        this.props.navigator.push({
            component: SignUpPage
        });*/
        this.props.navigation.navigate('SignUpPage');
        //ToastAndroid.show("ForgetPassword", ToastAndroid.SHORT)
    }

    _forgetPassword(){
        ToastAndroid.show("ForgetPassword", ToastAndroid.SHORT)
    }

    _signInCallback() {
        const { email, passwd } = this.state
        // Send your message via Flux
        //alert("Sending: "+text);
        //ToastAndroid.show("Sending: " + this.state.text, ToastAndroid.SHORT);
        //alert("即将登录: "+email+passwd);
        this.setState({ error: '', pending: true });
        // NOTE Post to HTTPS only in production
        axios.post(baseUrl+"/login",{
            email: email,
            passwd: passwd
        })
        .then((response) => {
            if(response.data.data){
                //alert(response.data.data.token)
                deviceStorage.saveItem("token", response.data.data.token);

                //this.props.navigation.goBack('Home')
                this.props.navigation.navigate('HomePage');

                /*
                AsyncStorage.getItem("token").then((value) => {
                    alert(value)
                });*/

            }else{
                alert(response.data.msg);
            }
            this.setState({
                pending: false,
            });
        })
        .catch((error) => {
            alert(error);
            this.setState({
                pending: false,
            });
        });
    }

    renderPending() {
        return this.state.pending ? <View style={{padding:px2dp(30),}}><ActivityIndicator visible={true} animating={true} /></View>:<View></View>
    }

    render(){
        return(
            <View style={styles.view}>
                <StatusBar
                backgroundColor="white"
                barStyle="dark-content"/>
                <View style={styles.logo}>
                    <Image style={{width:px2dp(45), height:px2dp(45)}} source={require('../../image/icon_home_logo.png')}/>
                </View>
                <View style={styles.editGroup}>
                    <View style={styles.editView1}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            value={this.state.email}
                            onChangeText={(email) => this.setState({email})}
                            placeholder="邮箱"
                            placeholderTextColor="#c4c4c4"
                            keyboardType='email-address'
                            />
                    </View>
                    <View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>
                    <View style={styles.editView2}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            value={this.state.passwd}
                            onChangeText={(passwd) => this.setState({passwd})}
                            placeholder="密码"
                            placeholderTextColor="#c4c4c4"
                            secureTextEntry={true}
                            />
                    </View>
                    <View style={{marginTop: px2dp(10), height: px2dp(40)}}>
                        <Button color="#2082ff" onPress={this._signInCallback.bind(this)} title="登录"/>
                        {this.renderPending()}
                    </View>
                    <View style={styles.textButtonLine}>
                        <Text onPress={this._forgetPassword.bind(this)} color="rgba(255,255,255,0.5)">忘记密码?</Text>
                        <Text onPress={this._signupCallback.bind(this)}>注册账号</Text>
                    </View>
                </View>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, justifyContent: 'flex-end', marginLeft: px2dp(20), marginRight: px2dp(20)}}>
                        <Divider text="其他账号登录"/>
                    </View>
                    <View style={styles.thirdPartyView}>
                        <Icon 
                        name="weibo" 
                        onPress={()=>ToastAndroid.show("暂未实现", ToastAndroid.SHORT)} 
                        style={{ fontSize: px2dp(38), color: "rgba(180,180,180,0.7)" }}/>
                        <Icon 
                        name="wechat" 
                        onPress={()=>ToastAndroid.show("暂未实现", ToastAndroid.SHORT)} 
                        style={{ fontSize: px2dp(38), color: "rgba(180,180,180,0.7)"}} />
                        <Icon 
                        name="github" 
                        onPress={()=>ToastAndroid.show("暂未实现", ToastAndroid.SHORT)} 
                        style={{ fontSize: px2dp(38), color: "rgba(180,180,180,0.7)"}} />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        //backgroundColor: 'rgb(22,131,251)'
    },
    actionBar:{
        marginTop: (Platform.OS === 'ios') ? px2dp(10) : 0,
    },
    logo:{
        alignItems: 'center',
        marginTop: px2dp(40+40)
    },
    edit:{
        height: px2dp(40),
        fontSize: px2dp(13),
        backgroundColor: '#fff',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    editView1:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
    },
    editView2:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
    editGroup:{
        margin: px2dp(20),
        marginTop:px2dp(48)
    },
    textButtonLine:{
        marginTop: px2dp(12),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    thirdPartyView:{
        flex: 1,
        marginTop: px2dp(10),
        flexDirection:'row',
        alignItems: 'flex-start',
        justifyContent:'space-around'
    }

});