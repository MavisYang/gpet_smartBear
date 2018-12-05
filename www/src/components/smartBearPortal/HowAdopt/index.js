import React,{Component} from 'react';
import CSSModules from 'react-css-modules'
import styles from './index.css';
import {API_PATH,IMG_PATH} from '../../../constants/OriginName';
import AuthProvider from "../../../funStore/AuthProvider";
import promiseXHR from '../../../funStore/ServerFun';
import {getQueryString} from "../../../funStore/UtilsFunc";
import {APP_ID} from "../../../constants/Constant";
import AccountInfo from "../../../funStore/AccountInfo";
const Title=({styles,num,text})=>{
    return <div className={styles.title}>
        <span>第<img src={IMG_PATH+`/images/icon/step${num}.png`} alt=""/>步:</span>
        <span>{text}</span>
    </div>
}
class HowAdopt extends Component{
    constructor(props){
        super(props);
        this.state={
            qrCodeUrl:''
        }
    }

    componentDidMount(){
        document.title='如何领养';
        this.weChatHandle()
    }


    weChatHandle=()=>{
        const {history} =this.props
        let self=this;
        //1.微信授权 获取unionId 并保存
        let  identCode=getQueryString('identCode')
        AccountInfo.requestUnionId().then(res=>{
            const accountInfo = res;//用户信息
            // console.log(res)
            self.setState({
                params:{
                    appId:APP_ID,
                    unionId:res.unionid,
                    openId:res.openid,
                    headUrl:res.headUrl,
                    nickName:res.nickName,
                    identCode:identCode
                }
            })
            // 2.获取unionid之后判断是否注册，成功直接登录跳转
            const url = `${API_PATH}/activity-api/noauth/chatpet/isregister?_unionId=${accountInfo.unionid}&_productChannel=CHATPET`
            promiseXHR(url,null,null,'GET').then(res=>{
                const resData = JSON.parse(res)
                if(resData.resultContent){//已经注册 登录 登录成功跳转
                    self.getToken(accountInfo.unionid)
                }else{//没有注册
                    history.push('/chatpet/addfriend') //添加好友
                }
            }).catch(err => {
                history.push('/chatpet/errorbear')
            })

        }).catch(err => {
            history.push('/chatpet/errorbear')
        })
    }

    //获取token
    getToken=(unionId)=>{
        let self=this;
        //判断是否有token
        var accessToken = AuthProvider.getCookie('access_token_bear')
        var refreshToken = AuthProvider.getCookie('refresh_token_bear')
        if(accessToken==null||refreshToken==null) {
            var username = 'unionid_' + unionId + '_type_9'
            AuthProvider.onLogin({username:username,password: ''}).then(res=>{
                if(res=='error'){
                    // 登录失败
                    console.log('登录失败')
                }else{
                    self.getRobot()
                    AccountInfo.refreshUserInfo()//刷新用户信息
                }
            })
        }else{
            self.getRobot()
            AccountInfo.refreshUserInfo()//刷新用户信息
        }

    }
    //获取当前绑定的机器人
    getRobot=()=>{
        let url =API_PATH + '/activity-api/authsec/chatpet/robot/now?_productChannel=CHATPET';
        AuthProvider.getAccessToken().then(resolve=>{
            return promiseXHR(url, {type: 'Bearer', value: resolve}, null, 'GET')
        }).then(response => {
            let result = JSON.parse(response);
            if (result.resultCode === '100') {
                this.setState({
                    qrCodeUrl:result.resultContent.qrCode
                });
            }
        });
    }

    render(){
        const {qrCodeUrl}=this.state
        return <div styleName='adopt-containter'>
            <div styleName="title-one"/>
            <div styleName="content content-one">
                <Title styles={this.props.styles} text={'添加小白熊为好友'} num={1}/>
                <div styleName='qrCode'>
                    <img src={qrCodeUrl} alt=""/>
                </div>
                <Title styles={this.props.styles} text={'拉入群并激活'} num={2}/>
                <div styleName="info">
                    <div>将小宠物拉入群，</div>
                    <div>在群内发送<img src={IMG_PATH+"/images/icon/smile_1.png"} alt=""/>即可完成激活</div>
                </div>
                <div styleName="wechart">
                    <img src={IMG_PATH+"/images/icon/adopt1.png"} alt=""/>
                </div>
            </div>
            <div styleName="title-two">
                <img src={IMG_PATH+"/images/icon/adopt-title2.png"} alt=""/>
            </div>
            <div styleName='content'>
                <Title styles={this.props.styles} text={'获得海报'} num={1}/>
                <div styleName="wechart-one">
                    <img src={IMG_PATH+'/images/icon/adopt2.png'} alt=""/>
                </div>
                <Title styles={this.props.styles} text={'把海报发到其他群里'} num={2}/>
                <div styleName="wechart-two">
                    <img src={IMG_PATH+'/images/icon/adopt3.png'} alt=""/>
                </div>
                <div styleName="wechart-three">
                    <img src={IMG_PATH+'/images/icon/adopt4.png'} alt=""/>
                </div>
            </div>
        </div>
    }
}
export default CSSModules(HowAdopt,styles,{allowMultiple:true})