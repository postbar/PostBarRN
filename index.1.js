/** @format */

//import {AppRegistry} from 'react-native';
//import Navigation from './js/config/entry';
//import {name as appName} from './app.json';


// 第二个参数，表示要把哪个页面注册为项目的首页
//AppRegistry.registerComponent(appName, () => Navigation);
/** @format 
 * 
 * StackNavigator
 *  Home: { screen: Home },
    Post: { screen: Post }
*/

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Home from './js/page/Home';
import Post from './js/page/Post';

// 第二个参数，表示要把哪个页面注册为项目的首页
//AppRegistry.registerComponent(appName, () => Navigation);

import { StackNavigator } from "react-navigation";

const App = StackNavigator({
    Home: { screen: Home },
});

AppRegistry.registerComponent(appName, () => App);