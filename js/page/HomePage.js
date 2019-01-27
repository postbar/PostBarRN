/**
 * Created by liaowm5 on 1/21/18.
 */

import React, {Component} from 'react';
import {StatusBar,StyleSheet, Text, View} from 'react-native';
import { Icon, SearchBar, TabBar } from '@ant-design/react-native';
import SplashScreen from 'react-native-splash-screen'
import HomeFragment from './HomeFragment';
import BarEntryFragment from './BarEntryFragment';
import MessageFragment from './MessageFragment';
import MyFragment from './MyFragment';
import auth from '../services/auth';

import px2dp from '../utils/px2dp';

export default class HomePage extends Component{
    constructor(props){
        super(props)
        this.state = {
          selectedTab: 'blueTab',
        }
    }

    componentDidMount() {
        SplashScreen.hide();
        auth.isSignIn().then((isSigned)=>{
            //alert(isSigned)
            isSigned ? '':this.props.navigation.navigate('SignInPage');
        })
        .catch((error)=>{
            alert(error);
            auth.signOut().then(()=>{
                this.props.navigation.navigate('SignInPage');
            });
        });
        //BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    }

    renderContent(pageText) {
      return (
        <View style={{ flex: 1,backgroundColor:'#d30000', alignItems: 'center', backgroundColor: 'white' }}>
          <Text style={{ margin: 50 }}>{pageText}</Text>
        </View>
      );
    }

    _JumpToSignIn(){
        this.props.navigation.navigate('SignInPage');
    }

    onChangeTab(tabName) {
      this.setState({
        selectedTab: tabName,
      });
    }
    render() {
      return (
        <View style={{flex: 1,flexDirection: 'column'}}>
            <StatusBar
            backgroundColor="white"
            barStyle="dark-content"/>
            <TabBar
            unselectedTintColor="#949494"
            tintColor="black"
            barTintColor="#f5f5f5"
            style={{alignSelf:'flex-end',height: px2dp(66)}}
            >
            <TabBar.Item
                title="首页"
                icon={<Icon name="home" />}
                selected={this.state.selectedTab === 'blueTab'}
                onPress={() => this.onChangeTab('blueTab')}
            >
                {<HomeFragment/>}
            </TabBar.Item>
            <TabBar.Item
                icon={<Icon name="export" />}
                title="进吧"
                selected={this.state.selectedTab === 'redTab'}
                onPress={() => this.onChangeTab('redTab')}
            >
                {<BarEntryFragment/>}
            </TabBar.Item>
            <TabBar.Item
                icon={<Icon name="bell" />}
                title="消息"
                badge={2}
                selected={this.state.selectedTab === 'greenTab'}
                onPress={() => this.onChangeTab('greenTab')}
            >
                {<MessageFragment/>}
            </TabBar.Item>
            <TabBar.Item
                icon={<Icon name="user" />}
                title="我的"
                selected={this.state.selectedTab === 'yellowTab'}
                onPress={() => this.onChangeTab('yellowTab')}
            >
                {<MyFragment navigation={this.props.navigation} _JumpSignIn={this._JumpToSignIn.bind(this)}/>}
            </TabBar.Item>
            </TabBar>
        </View>
      );
    }
}
