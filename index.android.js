/**
 * Created by liaowm5 on 1/21/18.
 */

import React from "react";
import { AppRegistry } from "react-native";
import App from './js/config/entry';

import {name as appName} from './app.json';



AppRegistry.registerComponent(appName, () => App);