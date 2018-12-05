import React,{Component} from 'react';
import CSSModules from 'react-css-modules'
import styles from './index.css'
import {API_PATH} from '../../../constants/OriginName';
import promiseXHR from '../../../funStore/ServerFun'
 class CustomIndex extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return (<div className='homeContent'></div>)
    }
}
export default CustomIndex(AddFriend,styles,{allowMultiple:true})