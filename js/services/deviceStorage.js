
import React, {Component} from 'react';
import { AsyncStorage } from 'react-native'

const deviceStorage = {
    async saveItem(key, value) {
        try{
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            alert('AsyncStorage Error: ' + error.message);
        }
    },
};

export default deviceStorage;