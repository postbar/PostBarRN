/**
 * Created by liaowm5 on 1/21/18.
 */

import React, {Component} from 'react';
import {StyleSheet,Text, View} from 'react-native';
import { Tabs } from '@ant-design/react-native';

export default class MessageFragment extends Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }

    render() {
        const tabs = [
            { title: '消息' },
            { title: '聊天' },
            { title: '通知' },
        ];
        return (
            <View style={{ flex: 1 }}>
                <Tabs tabs={tabs} 
                tabBarActiveTextColor="black"
                tabBarUnderlineStyle={{backgroundColor: 'black'}}
                >
                    <View style={styles.tabItem}>
                        <Text>消息</Text>
                    </View>
                    <View style={styles.tabItem}>
                        <Text>聊天</Text>
                    </View>
                    <View style={styles.tabItem}>
                        <Text>通知</Text>
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
        height: 150,
        backgroundColor: '#fff',
    }
});