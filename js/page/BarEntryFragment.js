/**
 * Created by liaowm5 on 1/21/18.
 */

import React, {Component} from 'react';
import {AsyncStorage,Dimensions,FlatList,ScrollView,StyleSheet,Text,TouchableNativeFeedback, View} from 'react-native';
import { 
    ActivityIndicator,
    Button,
    Flex,
    Grid,
    List,
    Icon,
    SearchBar,
    WhiteSpace,
    WingBlank,
 } from '@ant-design/react-native';

 import { Avatar } from 'react-native-elements'
 import Image from 'react-native-scalable-image';
 import px2dp from '../utils/px2dp';

 import { withNavigation } from 'react-navigation';
import a from '@ant-design/react-native/lib/modal/alert';

/*
const data =  Array.from(new Array(9)).map((_val, i) => ({
    text: `Name${i}`,
}));
*/

// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');

import base from '../config/config';
const baseUrl = base.baseUrl;
class BarEntryFragment extends Component{
    constructor(props){
        super(props)
        this.state = {
            barFocusList:[],
            barHistoryList:[],
            pending:true,
        }
        AsyncStorage.getItem('token').then((value)=>{
            this.setState({
                token:value
            });
            this._fetchBarFocusData();
            this._fetchBarHistoryData();
        });
    }

    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.setState({
                    pending: true
                });
                AsyncStorage.getItem('token').then((value)=>{
                    this.setState({
                        token:value
                    });
                    this._fetchBarFocusData();
                    this._fetchBarHistoryData();
                });
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    // 浏览记录（flatList）
    renderBarHistory() {
        return (
            <View style={styles.barHistory}>
                <FlatList
                    data={this.state.barHistoryList}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderBarHistoryItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    renderBarHistoryItem = ({ item }) => {
        return (
            <TouchableNativeFeedback style={styles.barHistoryItem} 
            onPress={() => this.props.navigation.navigate('BarPage', {barId: item.bar.id})}
            >
                <View style={styles.barHistoryContainer}>
                    <View>
                        <Image source={{uri:item.bar.avatar}} width={px2dp(100)}
                        style={{backgroundColor:'grey',marginBottom:px2dp(10)}} />
                        <Text style={styles.barHistoryName}>{item.bar.name+"吧"}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }

    renderMyBar() {
        return (
            <FlatList
                data={this.state.barFocusList}
                numColumns={2}
                renderItem={this.renderMyBarItem}/>
        );
    }
 
    renderMyBarItem = ({item}) => {
        return (
            <View style={{paddingLeft:px2dp(12),paddingRight:px2dp(12),}}>
                <TouchableNativeFeedback style={styles.myBarItem} 
                onPress={() => this.props.navigation.push('BarPage', {barId: item.bar.id})}
                >
                    <View style={styles.myBarContainer}>
                        <Text style={{color:'black'}}>{item === undefined ? 'undefined':item.bar.name}</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
            
        );
    }

    //this.props.navigation.push('SearchPage', {})
    render() {
        return (
            <View>
                <Flex justify="between">
                    <Flex.Item>
                    <View style={styles.item}>
                        <Text></Text>
                    </View>
                    </Flex.Item>
                    <Flex.Item>
                    <View style={styles.item}>
                        <Text style={{textAlignVertical:'center',fontSize: px2dp(16),color:'black',textAlign:'center',}}>进吧</Text>
                    </View>
                    </Flex.Item>
                    <Flex.Item>
                        <Flex justify='end'>
                            <Flex.Item>
                            <View style={styles.itemLeft}>
                                <Button size="small" style={{width: px2dp(25), marginRight: px2dp(14)}}>签</Button>
                            </View>
                            </Flex.Item>
                            <Flex.Item>
                                <ActivityIndicator animating={this.state.pending} text=" " />
                            </Flex.Item>
                        </Flex>
                    </Flex.Item>
                </Flex>
                <ScrollView>
                    <TouchableNativeFeedback onPress={()=>this.props.navigation.push('SearchPage')}>
                    <View style={{backgroundColor:'#eee',padding:px2dp(12)}}>
                        <Flex direction='row' style={{backgroundColor:'#fff',padding:px2dp(12)}}>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Icon name='search' style={{fontSize:px2dp(24)}} />
                            </View>
                            <View style={{flex:9}}>
                                <Text style={{fontSize:px2dp(16),color:'#ccc'}}>大家都在搜：</Text>
                            </View>
                        </Flex>
                    </View>
                    </TouchableNativeFeedback>
                    <View style={[{ margin: 10 }]}>
                        <Text>最近逛的吧</Text>
                    </View>
                    {this.renderBarHistory()}
                    <View style={[{ margin: 10 }]}>
                        <Text>我关注的吧</Text>
                    </View>
                    {this.renderMyBar()}
                    <View style={{height:px2dp(420)}}></View>
                </ScrollView>
            </View>
        );
    }

    _fetchBarFocusData() {
        let url = baseUrl+'/bar/focus';
        fetch(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                barFocusList:responseData.data.content,
            });
            this.setState({
                pending: false
            });
        })
        .catch(error => {
            alert.error(error);
            this.setState({
                pending: false
            });
        });
    }

    _fetchBarHistoryData() {
        let url = baseUrl+'/bar/history';
        fetch(url,{
            headers: {
                "Authorization":this.state.token
            },
        })
        .then((response) => response.json())
        .then((responseData) => {
            //alert(JSON.stringify(responseData.data.content))
            this.setState({
                barHistoryList:responseData.data.content,
            });
            this.setState({
                pending: false
            });
        })
        .catch(error => {
            alert.error(error);
            this.setState({
                pending: false
            });
        });
    }
}

const styles = StyleSheet.create({
    tabs:{
        color: 'black',
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
    },
    myBarItem: {
        width: width/2,
    },
    myBarContainer:{
        borderTopColor: '#eee',
        borderRightColor: '#fff',
        borderBottomColor: '#fff',
        borderLeftColor: '#fff',
        borderWidth: px2dp(1),
        borderStyle: 'solid',
        flexDirection: 'row',
        justifyContent:'space-between',
        paddingTop:px2dp(14),
        paddingBottom:px2dp(14),
        width: width/2-px2dp(12*2),
    },
});
export default withNavigation(BarEntryFragment);