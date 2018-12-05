import React,{Component} from 'react';
import CSSModules from 'react-css-modules'
import styles from './index.css'
import {API_PATH,IMG_PATH} from '../../../constants/OriginName';
import AuthProvider from "../../../funStore/AuthProvider";
import promiseXHR from '../../../funStore/ServerFun'
import {verifyPhone,verifyCode,getQueryString} from '../../../funStore/UtilsFunc';
import {APP_ID} from '../../../constants/Constant';
import AccountInfo from '../../../funStore/AccountInfo';
import LoadingAnimationA from '../../shareComponent/LoadingAnimationA'

class AddFriend extends Component{
    constructor(props){
        super(props);
        this.state={
            loading:true,
            robotQrCode:'',
            accountInfo:""

        }
    }

    componentDidMount(){
        document.title='添加好友';
        this.weChatHandle()
    }

    weChatHandle=()=>{
        const {history} =this.props
        //1.微信授权 获取unionId 并保存
        let sharingUserId=getQueryString('sharingUserId')?getQueryString('sharingUserId'):''
        let channel=getQueryString('channel')?getQueryString('channel'):''
        let productChannel=getQueryString('productChannel')?getQueryString('productChannel'):''
        AccountInfo.requestUnionId().then(res=>{
            const accountInfo = res;//用户信息
            this.setState({accountInfo:res})
            // 2.获取unionid之后判断是否注册，成功直接登录跳转
            const url = `${API_PATH}/activity-api/noauth/chatpet/isregister?_unionId=${accountInfo.unionid}&_productChannel=CHATPET`
            promiseXHR(url,null,null,'GET').then(res=>{
                const resData = JSON.parse(res)
                if(resData.resultCode==100){//
                    if(resData.resultContent){//已经注册
                       history.push('/chatpet/howadopt')
                    }else{
                        //获取二维码url
                        this.getRobot(accountInfo.openid,accountInfo.unionid,sharingUserId,channel,productChannel);
                    }
                }
            }).catch(err => {
                history.push('/chatpet/errorbear')
            })
        }).catch(err => {
            console.log(err)
            history.push('/chatpet/errorbear')
        })
    }
    //获取机器人二维码url
    getRobot=(openId,unionId,sharingUserId,channel,productChannel)=>{
        let self=this;
        const {history} =self.props
        let url =API_PATH + '/activity-api/noauth/chatpet/robot'
            + '?_channel='+channel+'&_openId='+openId
            + '&_unionId='+unionId+'&_sharingUserId='+sharingUserId
            + '&_productChannel='+ productChannel;
        promiseXHR(url, null, null, 'GET').then(response => {
            let result = JSON.parse(response)
            self.setState({
                loading:false
            })
            if (result.resultCode === '100') {
                self.setState({
                    robotQrCode:result.resultContent.qrCode
                })
            }else if(result.resultCode == '02536009'||result.resultCode == '02536008'){
                //获取机器人失败的返回码
                history.push('/chatpet/errorbear')
            }else{
                history.push('/chatpet/error')
            }
        })
    }
    render(){
        const {robotQrCode,loading} =this.state
        return <div style={{height:'100%'}}>
            {
                loading? <LoadingAnimationA/> :<div styleName='addFriend-containter'>
                    <div styleName='friend-content'>
                        <div styleName="qrCode-box">
                            <img styleName='qrCode' alt="" src={robotQrCode}/>
                        </div>
                        <div styleName="info-box">
                            <div>扫码加我为好友</div>
                            <div>就可以在群内调戏我啦</div>
                        </div>
                    </div>
                </div>

            }
        </div>
    }
}
export default CSSModules(AddFriend,styles,{allowMultiple:true})