/**
 * Created by wangdi on 4/11/16.
 */
import React, {Component} from 'react';
import {Alert,AsyncStorage,BackHandler,Button,Dimensions,FlatList, View, StyleSheet,StatusBar , PixelRatio, Platform, TouchableOpacity,Text,TextInput,ToastAndroid,TouchableNativeFeedback} from 'react-native';
import { 
    ActivityIndicator, 
    Flex,
    Icon,
} from '@ant-design/react-native';
import px2dp from '../utils/px2dp';
import { Avatar } from 'react-native-elements'
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import SplashScreen from 'react-native-splash-screen'

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');

const options = {
    title: '选择图片',
    quality: 0.1,
    customButtons: [],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
};
import base from '../config/config';
const baseUrl = base.baseUrl;
export default class NewPostPage extends Component{
    static navigationOptions = ({ navigation }) => {
        return {
          headerRight: (
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator animating={navigation.getParam('pending')} text=" " /></View>
          ),
        };
    };
    constructor(props){
        super(props);
        const { navigation } = this.props;
        this.state = {
            text:'',
            barId:navigation.getParam('barId', '1'), //动态获取barId
            pictureList:[],
        };

    }

    componentDidMount() {
        this.props.navigation.setParams({ pending: false });
        SplashScreen.hide();
        AsyncStorage.getItem('token').then((value)=>{
            this.setState({
                token:value
            });
        });
    }

    onPictureClick (index) {
        Alert.alert(
            '',
            '是否移除图片？',
            [
              {text: '否', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '是', onPress: () => this.setState({pictureList:this.state.pictureList.filter((_, i) => i !== index)}) },
            ],
            { cancelable: false }
          )
    };

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
                pictureList:[
                    ...this.state.pictureList,
                    ...[source]
                ]
            });
            }
        });
    }

    renderFooter() {
        return (
            <TouchableNativeFeedback style={styles.barHistoryItem} 
            onPress={() => this._pickImage()}
            >
                <View style={styles.pictureListContainer}>
                    <Icon name="plus" style={{fontSize:px2dp(20),borderWidth:px2dp(0.5),borderColor:'#eee',padding:px2dp(30)}} />
                </View>
            </TouchableNativeFeedback>
        )
    }

    renderPictureList() {
        return (
            <View style={styles.pictureListContainer}>
                <FlatList
                    data={this.state.pictureList}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderPictureItem}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{marginLeft:px2dp(12),marginRight:px2dp(12),marginTop:px2dp(20),marginBottom:px2dp(20)}}
                />
            </View>
        )
    }

    renderPictureItem = ({ item,index }) => {
        return (
            <View style={styles.barHistoryItem} >
                <View style={styles.pictureListContainer}>
                    <View>
                        <Avatar
                        size="large"
                        source={item}
                        onPress={()=>this.onPictureClick(index)}
                        activeOpacity={0.7}
                        />
                    </View>
                </View>
            </View>
        )
    }




    render () {
        return(
            <View>
                <StatusBar
                backgroundColor="white"
                barStyle="dark-content"/>
                <Flex style={styles.inputContainer}>
                    <TextInput
                    style={styles.newInput}
                    value={this.state.text}
                    multiline={true}
                    numberOfLines={1}
                    blurOnSubmit={false}
                    placeholder="来吧，尽情发挥吧..."
                    returnKeyType="send" 
                    ref="newComment"
                    onChangeText={(text) => this.setState({text})}
                    />
                    <Text style={this.state.text.length > 1 ? styles.inputSubmitYes:styles.inputSubmitNo}
                        onPress={this.state.text.length > 1 ? this._sendMessage:()=>{}}
                    >发布</Text>
                </Flex>
                <View>
                    {this.renderPictureList()}
                </View>
            </View>
        );
    }

    _sendMessage =() => {
        this.props.navigation.setParams({ pending: true });
        const { text } = this.state
        // Send your message via Flux
        //alert("Sending: "+text);
        let url = baseUrl+'/bar/'+this.state.barId+'/post';
        //alert(this.state.token)

        pictureUriList = [];

        this.state.pictureList.forEach((item,index)=>{
            pictureUriList.push(item.uri);
        });

        //alert(JSON.stringify(pictureUriList));
        //return null;

        axios.put(url,
            {
                "content": text,
                "ordre": 0,
	            "images":pictureUriList
            }
            ,{
            headers: {
                "Authorization":this.state.token
            }
        }).then((response)=>{
            if(response.data.code == 0){
                ToastAndroid.show("发表成功" , ToastAndroid.SHORT);
                //this._onRefresh();
                this.props.navigation.navigate('BarPage', {barId: this.state.barId})
            }else{
                ToastAndroid.show("发表失败，请检查网络" , ToastAndroid.SHORT);
            }
        }).catch((error)=>{
            ToastAndroid.show(error.message , ToastAndroid.SHORT);
            this.props.navigation.setParams({ pending: false });
        });

    }
}

const styles = StyleSheet.create({
    pictureList: {
        width: width,
        alignItems:'center',
        backgroundColor: '#fff',
        paddingBottom:10,
        marginBottom:10,
    },
    pictureListContainer:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginTop:10,
        margin: px2dp(10),
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        fontSize: px2dp(16),
        paddingLeft:px2dp(10),
        paddingRight:px2dp(10),
    },
    newInput: {
        flex:9,
        borderColor: '#ccc',
        fontSize: px2dp(16),
        padding:px2dp(10),
        minHeight:px2dp(50),
        height: 'auto'
    },
    inputSubmitNo: {
        flex:1,
        fontSize: px2dp(16),
        minHeight:px2dp(50),
        textAlignVertical:'center',
        color: '#ddd'
    },
    inputSubmitYes: {
        flex:1,
        fontSize: px2dp(16),
        minHeight:px2dp(50),
        textAlignVertical:'center',
        color: '#1890ff'
    },
});