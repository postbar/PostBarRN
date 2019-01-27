/**
 * Created by wangdi on 4/11/16.
 */
'use strict';

import React, {Component} from 'react';
import {BackHandler,Button,Text, View, StyleSheet, PixelRatio, Platform, TouchableOpacity,ToastAndroid, Image, TextInput} from 'react-native';
import { Icon } from '@ant-design/react-native';
import { Divider } from 'react-native-elements';
import px2dp from '../../utils/px2dp';
import { Avatar } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';

// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
    title: '选择头像',
    quality: 0.1,
    customButtons: [],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
import base from '../../config/config';
const baseUrl = base.baseUrl;
export default class SignUpPage extends Component {
    constructor(props){
        super(props);
        //this.handleBack = this._handleBack.bind(this);
        this.state = {
            name: "",
            email: "",
            passwd: "",
            passwdConfirm: "",
            pending: false,
            error: '',
            avatar:require('../../image/icon_mine_camera_avatar.png'),
            avatarBase64:'',
        };
    }

    componentDidMount() {
        //alert(JSON.stringify(base)+JSON.stringify(baseUrl))
        //BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        //BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }

    componentWillUnmount() {
        //BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        //BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
    }

    _pickImage() {
        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
        
            if (response.didCancel) {
            console.log('User cancelled image picker');
            } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
            } else {
            //const source = { uri: response.uri };
        
            // You can also display the image using data:
            const source = { uri: 'data:image/jpeg;base64,' + response.data };
        
            this.setState({
                avatar: source,
            });
            }
        });
    }

    _signupCallback_0(){
        const { name,email, passwd,avatar } = this.state
        alert(JSON.stringify({
            name:name,
            avatar:avatar.uri,
            email: email,
            passwd: passwd
        }))
    }

    _signupCallback(){
        const { name,email, passwd,avatar } = this.state

        if(avatar.uri==undefined){
            alert("请选择头像");
            return null;
        }

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        if(reg.test(email) === false)
        {
            alert("邮箱格式不正确")
            return null;
        }
        else {
            //this.setState({email:text})
            //console.log("Email is Correct");
        }

        if(this.state.name==''||this.state.name.replace(/\s/g, "")!=this.state.name){
            alert("非法用户名")
        }

        if(this.state.passwd==this.state.passwdConfirm&&this.state.passwd.length>=6){
            
        }else{
            alert("密码不一致或小于6位");
            return null;
        }

        
        axios.put(baseUrl+"/register",{
            name:name,
            avatar:avatar.uri,
            email: email,
            password: passwd
        })
        .then((response) => {
            if(response.data.code==0){
                //alert(response.data.data.token)
                //deviceStorage.saveItem("token", response.data.data.token);
                ToastAndroid.show("注册成功", ToastAndroid.SHORT)
                //this.props.navigation.goBack('Home')
                this.props.navigation.navigate('SignInPage');

                /*
                AsyncStorage.getItem("token").then((value) => {
                    alert(value)
                });*/

            }else{
                //alert(response.data.msg);
                ToastAndroid.show(response.data.msg, ToastAndroid.SHORT)
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

    render(){
        return(
            <View style={styles.view}>
                <View style={styles.logo}>
                    <Image style={{width:px2dp(45), height:px2dp(45)}} source={require('../../image/icon_home_logo.png')}/>
                </View>
                <View style={styles.editGroup}>
                    <View style={styles.editView0}>
                        <Avatar
                        size="medium"
                        rounded
                        source={this.state.avatar}
                        onPress={() => this._pickImage()}
                        activeOpacity={0.7}
                        />
                    </View>
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
                            value={this.state.name}
                            onChangeText={(name) => this.setState({name})}
                            placeholder="用户名"
                            placeholderTextColor="#c4c4c4"/>
                    </View>
                    <View style={{height: 1/PixelRatio.get(), backgroundColor:'#c4c4c4'}}/>
                    <View style={styles.editView3}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            value={this.state.passwd}
                            onChangeText={(passwd) => {
                                this.setState({passwd})
                            }}
                            placeholder="密码"
                            placeholderTextColor="#c4c4c4"
                            secureTextEntry={true}
                            />
                    </View>
                    <View style={styles.editView3}>
                        <TextInput
                            style={styles.edit}
                            underlineColorAndroid="transparent"
                            value={this.state.passwdConfirm}
                            onChangeText={(passwdConfirm) => {
                                this.setState({passwdConfirm})
                            }}
                            placeholder="密码确认"
                            placeholderTextColor="#c4c4c4"
                            secureTextEntry={true}
                            />
                    </View>
                    <View style={{marginTop: px2dp(15), height: px2dp(40)}}>
                        <Button color="#2082ff" title="注册" onPress={this._signupCallback.bind(this)}/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    logo:{
        alignItems: 'center',
        marginTop: px2dp(40+40)
    },
    editGroup:{
        padding: px2dp(20)
    },
    edit:{
        height: px2dp(40),
        fontSize: px2dp(13),
        backgroundColor: 'white',
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15)
    },
    editView0:{
        padding: px2dp(15),
        backgroundColor:'white',
        justifyContent: 'center',
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
        justifyContent: 'center'
    },
    editView3:{
        height: px2dp(48),
        backgroundColor:'white',
        justifyContent: 'center',
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3
    },
});