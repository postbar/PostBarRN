
import axios from 'axios';
import deviceStorage from './deviceStorage';
import { AsyncStorage,ToastAndroid} from 'react-native'

const baseUrl = 'http://172.18.59.61:8088'
const auth = {
    async signOut() {
        try{
            await AsyncStorage.setItem('token', 'null');
        } catch (error) {
            alert('clearToken Error: ' + error.message);
        }
    },

    async isSignIn(){
        return AsyncStorage.getItem("token").then((value) => {
            return value;
            //alert(res.value)
        }).then((value) => {
            if(value=='null'){
                ToastAndroid.show("尚未登录.", ToastAndroid.SHORT);
                return false;
            }
            
            async function isTokenValid(){
            try{
            
                const response = await axios.get(baseUrl+'/user/info',{
                    headers: {
                        "Authorization":value
                    },
                });

                if(response.data.code == 0){
                    ToastAndroid.show("登录成功，正在跳转至首页...", ToastAndroid.SHORT);
                    return true;
                }

            }catch (error){
                alert('checkToken Error: ' + error.message);
                AsyncStorage.setItem('token', 'null');
                
            }
            return false;
            }
            return isTokenValid();

            
            /*
            .then((response) => {
                //alert(JSON.stringify(response.data))
                if(response.data.code == 0){
                    ToastAndroid.show("登录成功，正在跳转至首页...", ToastAndroid.SHORT);
                    return true;
                }
            })
            .catch((error) => {
                alert('checkToken Error: ' + error.message);
            });*/
        });
    },
};

export default auth;