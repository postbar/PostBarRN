/**
 * Created by liaowm5 on 1/21/18.
 */
import React, {Component} from 'react';
import {Text, View, StyleSheet,PixelRatio, TouchableNativeFeedback,Alert, ScrollView} from 'react-native';
import px2dp from '../utils/px2dp';
import theme from '../config/theme';
import PropTypes from 'prop-types';
import { 
    ActivityIndicator,
    Button,
    Flex,
    Grid,
    Icon,
    List,
    SearchBar,
    WhiteSpace,
    WingBlank,
 } from '@ant-design/react-native';

export default class MyFragment extends Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }

    /*
    
                    <Flex justify="between">
                    <TouchableNativeFeedback>
                    <Flex.Item>
                        <View>
                            <Text style={styles.downText}>0</Text>
                            <Text style={styles.upText}>关注</Text>
                        </View>
                    </Flex.Item>
                    </TouchableNativeFeedback>
                    <Flex.Item>
                        <Text style={styles.downText}>9</Text>
                        <Text style={styles.upText}>粉丝</Text>
                    </Flex.Item>
                    <Flex.Item>
                        <Text style={styles.downText}>30</Text>
                        <Text style={styles.upText}>关注的吧</Text>
                    </Flex.Item>
                    <Flex.Item>
                        <Text style={styles.downText}>3</Text>
                        <Text style={styles.upText}>帖子</Text>
                    </Flex.Item>
                </Flex>
    */

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

    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.list}>
                        <Item icon="heart" text="我的收藏" subText="300" iconColor="#32cd32" />
                        <Item icon="eye" text="浏览历史" subText="15" />
                        <Item icon="team" text="我的群组" subText="9" />
                    </View>
                    <View style={styles.list}>
                        <Item icon="crown" text="会员中心" iconColor="#ff4500" />
                        <Item icon="setting" text="设置" />
                    </View>
                </ScrollView>
            </View>
        );
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
                        <Icon name="right" style={{fontSize: px2dp(16),color: "#ccc"}} />
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
        borderBottomColor: '#c4c4c4',
        borderBottomWidth: 1/PixelRatio.get()
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