import React,{Component} from 'react';
import CSSModules from 'react-css-modules'
import styles from './index.css'
import {API_PATH,IMG_PATH} from '../../../constants/OriginName';
import promiseXHR from '../../../funStore/ServerFun'
class Error extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    componentDidMount(){
        document.title='小窝';
    }


    render(){
        return <div styleName='error-containter'>
            <div styleName='content'>
                <div styleName="text">
                    <div>小窝还在建设中</div>
                    <div>晚点再来哦~</div>
                </div>
                <div styleName='errorIcon'>
                    <img src={IMG_PATH+"/images/icon/error-group.png"} alt=""/>
                </div>
            </div>
        </div>
    }
}
export default CSSModules(Error,styles,{allowMultiple:true})