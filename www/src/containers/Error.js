import React from 'react'
import { IMG_PATH } from "../constants/OriginName";
const Error = (props) => {
    return (
        <div className='error-container'>
            <div className="verticalCenter error">
                <p>主人网络有点差哦！<br/>换个网络试试吧!</p>
                <img className='img404' src={IMG_PATH+"/images/icon/pic_404@2x.png"} alt=""/>
                <div className="refreshBtn" onClick={()=>{props.history.goBack()}}>刷新</div>
            </div>
        </div>
    )
}  

export default Error

