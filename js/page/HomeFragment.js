/**
 * Created by liaowm5 on 1/21/18.
 */

import React, {Component} from 'react';
import {Dimensions,StyleSheet,Text, View} from 'react-native';
import { Tabs } from '@ant-design/react-native';

import TabHomeFragment from './TabHomeFragment';


// 取得屏幕的宽高Dimensions
const { width, height } = Dimensions.get('window');
export default class HomeFragment extends Component{
    constructor(props){
        super(props)
        this.state = {
            
        }
    }

    render() {
        const tabs = [
            { title: '关注' },
            { title: '首页' },
            { title: '视频' },
        ];
        return (
            <View style={{ flex: 1 }}>
                <Tabs tabs={tabs} 
                initialPage={1}
                tabBarActiveTextColor="black"
                tabBarUnderlineStyle={{backgroundColor: 'black'}}
                >
                    <View style={styles.tabItem}>
                        <Text>关注</Text>
                    </View>
                    <View style={styles.tabItem}>
                        <TabHomeFragment/>
                    </View>
                    <View style={styles.tabItem}>
                        <Text>视频</Text>
                    </View>
                </Tabs>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    tabs:{
        color: 'black',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    }
});