// import $ from 'jquery'
// import {store} from '../index'
// import { push, replace } from 'react-router-redux'
import promiseXHR from './ServerFun'
import {ORIGIN_NAME, API_PATH} from '../constants/OriginName'
import {Base64} from 'js-base64'

class AuthProvider {
    constructor() {

    }

    onLogin({username, password}) {
        const self = this
        const url = API_PATH + '/uaa/oauth/token'
        return promiseXHR(url, {type: 'Basic', value: null}, 'grant_type=password&username=' + username + '&password=' + password, 'POST')
            .then((res) => {
                const data = eval("(" + res + ")")
                self.saveTokens(data.access_token, data.refresh_token, data.expires_in)
                return data
            }).catch((reject) => {
                return 'error'
            })
    }

    getAccessToken() {
        if (!this.getCookie('access_token_bear')) {
            return this.onRefreshToken()
        } else if (this.getCookie('access_token_bear') == 'wait') {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.getAccessToken().then(res => {
                        resolve(res)
                    })
                }, 1900)
            })
        } else {
            return new Promise((resolve, reject) => {
                resolve(this.getCookie('access_token_bear'))
            })
        }
    }

    setWait() {
        let exp = new Date();
        exp.setTime(exp.getTime() + 1000 * 5)
        document.cookie = 'access_token_bear' + "=" + escape('wait') + ";expires=" + exp.toGMTString();
    }

    saveTokens(access_token, refresh_token, expires_in) {
        let exp = new Date();
        exp.setTime(exp.getTime() + expires_in * 1000 - 30000)
        document.cookie = 'access_token_bear' + "=" + escape(access_token) + ";expires=" + exp.toGMTString();
        document.cookie = 'refresh_token_bear' + "=" + escape(refresh_token)
    }

    encodeClientId() {
        if (this.getCookie('webclient_id') == null) {
            var webclient_id = Base64.encode('lizClient' + Math.random().toString())
            this.saveWebClienId(webclient_id)
        }
    }

    saveWebClienId(webclient_id) {
        let exp = new Date();
        exp.setTime(exp.getTime() + 1000 * 60 * 60 * 24 * 365)
        document.cookie = 'webclient_id' + "=" + escape(webclient_id) + ";expires=" + exp.toGMTString();
    }

    onRefreshToken() {
        const refreshToken = this.getCookie('refresh_token')
        const url = API_PATH+'/uaa/oauth/token'
        this.setWait()
        const self = this
        return promiseXHR(url,{type:'Basic',value:null},'grant_type=refresh_token&refresh_token='+refreshToken,'POST')
            .then(res => {
                const data = eval("("+ res +")")
                this.saveTokens(data.access_token,data.refresh_token,data.expires_in)
                return data.access_token
            }).catch(err => {
                // 刷新失败
                this.deleteCookie('access_token_bear')
                this.deleteCookie('refresh_token_bear')
                this.deleteCookie('webclient_id_bear')
            })
    }

    getCookie(key) {
        var aCookie = document.cookie.split("; ");
        // window.debugger(aCookie);
        for (var i = 0; i < aCookie.length; i++) {
            var aCrumb = aCookie[i].split("=");
            if (key == aCrumb[0])
                return unescape(aCrumb[1]);
        }
        return null;
    }



    deleteCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
}

export default new AuthProvider()
