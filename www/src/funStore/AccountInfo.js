import promiseXHR from './ServerFun'
import {API_PATH} from '../constants/OriginName'
import AuthProvider from './AuthProvider'
import {getQueryString} from './UtilsFunc'
import { APP_ID,COMPONENT_APPID,REDIRECT_URI} from '../constants/Constant';
import { Base64 } from 'js-base64'
/* global location */
/* eslint no-restricted-globals: ["off", "location"] */
class AccountInfo {
    requestUnionId(){
        const self = this
        // 判断是否获取到unionId，没有则去拿取
        const unionId = self.getCookie('unionId_bear')
        const openId = self.getCookie('openId_bear')
        const headUrl = self.getCookie('headUrl_bear')
        const nickName = self.getCookie('nickName_bear')
        //1.存在unionId
        if(unionId!=null&&unionId!=='undefined'&&unionId!=='null'){
            return  new Promise((resolve, reject) => {
                resolve({
                    unionid:unionId,
                    openid: openId,
                    headUrl: headUrl,
                    nickName: nickName
                })
            })
        }
        //2.不存在unionId，进行授权登录
        //根据code值判断是否有授权登录
        let code = getQueryString('code')
        let appid= APP_ID;
        let componentappid=COMPONENT_APPID;
        let redirect_uri=REDIRECT_URI
        var url = `https://gp.molimami.com/authsec?redirect=${escape(location.href)}&appid=${appid}&componentappid=${componentappid}`

        //2.1 code不存在
        if(code==undefined||code==''){
            let date = new Date().getTime()
            location.href = url
            // location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${date}&component_appid=${component_appid}&connect_redirect=1#wechat_redirect`
        }else{
            //公众号获取用户信息(非第三方接口)
            const url =API_PATH+'/wechat-center/noauth/authorizationinfo/userInfo?code='+code+'&appId='+appid
            return promiseXHR(url,null,null,'GET').then((res)=>{
                const resData=JSON.parse(res)
                if(resData.resultCode=="100"){
                    // 获取unionid 存储
                    self.saveCookie(resData.resultContent)
                    return resData.resultContent
                }else{
                    throw '获取unionid失败'
                }
            })
        }

    }
    // 每次授权成功后刷新用户信息
    refreshUserInfo(){
        const self = this
        let params = {
            "appId": APP_ID,
            "headUrl": self.getCookie('headUrl_bear'),
            "nickeName": self.getCookie('nickName_bear'),
            "openId": self.getCookie('openId_bear'),
            "unionId": self.getCookie('unionId_bear')
        }
        const url = `${API_PATH}/activity-api/authsec/chatpet/user/refresh`
        AuthProvider.getAccessToken().then((resolve, reject)=> {
            return promiseXHR(url, {type: 'Bearer', value: resolve},params, 'POST')
        }).then(res => {
            const resData = JSON.parse(res)
            if(resData.resultCode=='100'){
                console.log('刷新用户状态成功！')
            }else{
                console.log('刷新用户状态失败！')
            }
        }).catch(err => {
            console.log(err)
        })
    }
    getCookie(key){
        var aCookie = document.cookie.split("; ");
        for (var i=0; i < aCookie.length; i++)
        {
            var aCrumb = aCookie[i].split("=");
            if (key == aCrumb[0])
                return unescape(aCrumb[1]);
        }
        return null;
    }
    saveCookie(data){
        let exp = new Date();
        console.log(data,'get wechat info');
        exp.setTime(exp.getTime() + 90*24*3600*1000)
        document.cookie = 'unionId_bear' + "="+ escape (data.unionid) + ";expires=" + exp.toGMTString()+';path=/';
        document.cookie = 'openId_bear' + "="+ escape (data.openid) + ";expires=" + exp.toGMTString()+';path=/';
        document.cookie = 'headUrl_bear' + "="+ escape (data.headimgurl) + ";expires=" + exp.toGMTString()+';path=/';
        document.cookie = 'nickName_bear' + "="+ escape (data.nickname) + ";expires=" + exp.toGMTString()+';path=/';
    }
}
export default new AccountInfo()
