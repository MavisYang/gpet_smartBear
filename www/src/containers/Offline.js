import React, { PropTypes } from 'react'
import { IMG_PATH } from "../constants/OriginName";
import {getQueryString} from '../funStore/UtilsFunc'

const Error = ({ history }) => {
    return <div className='error-container'>
            <div className="verticalCenter error">
                <p>系统正在维护中<br/>预计将于{decodeURI(getQueryString('time'))}结束!</p>
                {/*<img className='img404' src={IMG_PATH+"/images/icon/pic_offline.png"} alt=""/>*/}
            </div>
        </div>
}
export default Error

