import React, {Component} from 'react';
import CSSModules from 'react-css-modules'
import styles from './index.css'
import {API_PATH} from '../../../constants/OriginName';
import AuthProvider from "../../../funStore/AuthProvider";
import promiseXHR from '../../../funStore/ServerFun';
import {phoneVerify, codeVerify, getQueryString} from '../../../funStore/UtilsFunc';
import {APP_ID} from '../../../constants/Constant';
import AccountInfo from '../../../funStore/AccountInfo';
import LoadingAnimationA from '../../shareComponent/LoadingAnimationA';
import ButtonLoading from '../../shareComponent/ButtonLoading'
import ProtocalBox from '../ProtocalScore'
var timer;

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            params: {
                appId: '',
                openId: '',
                unionId: '',
                headUrl: '',
                nickName: '',
                identCode: '',
                productChannel:'',
                phoneNum:'',
                verifyCode: '',
            },
            verifyTip: '',
            verifyCode: '获取验证码',
            codeDisabled: false,
            radioSelect: true,
            btnLoading: false
        }
    }


    componentDidMount() {
        document.title = '注册';
        this.weChatHandle()
    }

    weChatHandle = () => {
        const {params} =this.state
        const {history} = this.props
        //1.微信授权 获取unionId 并保存
        let identCode = getQueryString('identCode')
        let productChannel = getQueryString('productChannel')
        AccountInfo.requestUnionId().then(res => {
            const accountInfo = res;//用户信息
            // console.log(res)
            let newParams ={
                appId: APP_ID,
                unionId: res.unionid,
                openId: res.openid,
                headUrl: res.headUrl,
                nickName: res.nickName,
                identCode: identCode,
                productChannel:productChannel,
                phoneNum: AuthProvider.getCookie('phone_bear')? AuthProvider.getCookie('phone_bear'):'',
                verifyCode: AuthProvider.getCookie('code_bear')? AuthProvider.getCookie('code_bear'):'',
            }
            this.setState({
                params:newParams
            })
            // 2.获取unionid之后判断是否注册，成功直接登录跳转
            const url = `${API_PATH}/activity-api/noauth/chatpet/isregister?_unionId=${accountInfo.unionid}&_productChannel=CHATPET`
            promiseXHR(url, null, null, 'GET').then(res => {
                const resData = JSON.parse(res)
                if (resData.resultContent) {//已经注册 登录
                    history.push('/chatpet/howadopt')  //登录成功跳转如何领养
                } else {//没有注册
                    this.setState({
                        loading: false
                    })
                }
            })
        }).catch(err => {
            history.push('/chatpet/errorbear')
        })
    }


    handleChangePhone = (e) => {
        const {params, radioSelect} = this.state
        let phoneValue = e.target.value;
        params[e.target.name] = phoneValue
        this.setState({params})
    }

    handleChangeCode = (e) => {
        const {params, radioSelect} = this.state;
        let codeValue = e.target.value;
        params[e.target.name] = e.target.value
        this.setState({params})
    }

    handleClickRadio = () => {
        const {params, radioSelect} = this.state;
        let self = this
        this.setState({
            radioSelect: !this.state.radioSelect
        })

    }
    //获取验证码
    getVerifyCode = () => {
        let phone = this.state.params.phoneNum;
        this.codeCountDown(60)
        let url = API_PATH + '/basis-api/noauth/usermgmt/sendPhoneCode?_templateCode=CHAT_PET_TEMPLATE_VCODE_MSG&_phone=' + phone;
        promiseXHR(url, null, null, 'GET')
            .then((res) => {
                if (JSON.parse(res).resultCode == '100') {
                    this.showVerifyTip('验证码已发出')
                }
            })
    }

    handleRegister = () => {
        const {params} = this.state
        let url = API_PATH + '/activity-api/noauth/chatpet/register'
        console.log(params, 'params')
        this.setState({
            btnLoading: true,
            btnDisabled: true
        })
        AuthProvider.deleteCookie('phone_bear')
        AuthProvider.deleteCookie('code_bear')
        promiseXHR(url, null, params, 'POST')
            .then((res) => {
                console.log(res, '11111')
                const resData = JSON.parse(res)
                this.setState({
                    btnDisabled: false
                })
                switch (resData.resultCode) {
                    case '100':
                        this.showVerifyTip('注册成功')
                        setTimeout(() => {
                            //跳转
                            // this.props.history.push('/chatpet/howadopt')
                            // eslint-disable-next-line
                            wx.closeWindow()  //关闭
                        }, 2000)

                        break;
                    case '02536001'://该手机号已注册
                        this.showVerifyTip('该手机号已注册')
                        break;
                    case '02536002'://验证码已过期
                        this.showVerifyTip('验证码已过期')
                        break;
                    case '02536003'://用户已注册
                        this.showVerifyTip('验证码不正确')
                        break;
                    case '02536004'://注册失败
                        this.showVerifyTip('注册失败')
                        break;
                    default:
                        this.showVerifyTip('注册失败')
                        break;
                }
                this.setState({btnLoading: false})
            })
    }

    codeCountDown(time) {
        let self = this
        timer = setInterval(function () {
            time--;
            if (time < 0) {
                clearInterval(timer)
                self.setState({
                    codeDisabled: false,
                    verifyCode: '获取验证码',
                })

            } else {
                self.setState({
                    codeDisabled: true,
                    verifyCode: time + 's'
                })
            }
        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(timer)
    }

    showVerifyTip = (text) => {
        let self = this;
        self.setState({
            verifyTip: text
        })

        setTimeout(function () {
            self.setState({
                verifyTip: ''
            })
        }, 2000)
    }

    toogleModal=()=>{
        const {params} =this.state
        let exp = new Date();
        exp.setTime(exp.getTime() + 60*1000)
        document.cookie = 'phone_bear' + "=" + escape(params.phoneNum) + ";expires=" + exp.toGMTString();
        document.cookie = 'code_bear' + "=" + escape(params.verifyCode) + ";expires=" + exp.toGMTString();
        this.props.history.push('/chatpet/protocal')

    }

    submitVerifyHandle=()=>{
        const {params,radioSelect} =this.state
        let flag=true
        if(!phoneVerify(params.phoneNum)||!codeVerify(params.verifyCode)||!radioSelect){
            flag=false
        }
        return flag
    }
    render() {
        const {loading, btnLoading,verifyTip,codeDisabled, verifyCode, radioSelect,params} = this.state;
        let codeColor= phoneVerify(params.phoneNum)
        let btnDisabled=this.submitVerifyHandle()
        return <div className='containter'>
            {
                loading ? <LoadingAnimationA/> :

                    <div styleName='register-containter'>
                        <div styleName='title'>
                            <div styleName='login-title'/>
                        </div>
                        <div styleName='register-content'>
                            <div styleName="inputBox">
                                <input type="text" maxLength={11} placeholder='请输入手机号' name='phoneNum' value={params.phoneNum}
                                       onChange={this.handleChangePhone}/>
                            </div>
                            <div styleName='inputBox clearfix'>
                                <div styleName='codeInput'>
                                    <input type="text" maxLength={6} placeholder='请输入验证码' name='verifyCode' value={params.verifyCode}
                                           onChange={this.handleChangeCode}/>
                                </div>
                                <span styleName='codePrompt'/>
                                <button styleName={`getCode ${!codeColor||codeDisabled ? '' : 'getCodeRight'}`}
                                        disabled={!codeColor||codeDisabled} onClick={this.getVerifyCode}>{verifyCode}</button>
                            </div>
                            <div styleName='agreementBox'>
                                <span styleName={`selected ${radioSelect ? '' : 'noSelected'}`}
                                      onClick={this.handleClickRadio}/> 我已同意 <span styleName='agreement' onClick={this.toogleModal}>《领养协议》</span>
                            </div>
                            <div styleName='btnBox'>

                                <button styleName={`joinBtn ${!btnDisabled  ? '' : 'registerBnt'}`} disabled={!btnDisabled} onClick={this.handleRegister}>
                                    {
                                        btnLoading ? <ButtonLoading text={'领养中'} color={'#EA4325'}/> : '确认领养'
                                    }
                                </button>
                            </div>
                        </div>
                        {verifyTip != '' ? <div styleName='verifyTipBox'>{verifyTip}</div> : null}

                    </div>
            }

        </div>
    }
}

export default CSSModules(RegisterForm, styles, {allowMultiple: true})