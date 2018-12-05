
export const  phoneVerify=(str)=>{
    let myreg = /^1[3-9]{1}\d{9}$/;
    if(myreg.test(str)){
        return true
    }
    return false
}

export const codeVerify=(str)=>{
    let myreg = /^\d{6}$/;
    if(myreg.test(str)){
        return true
    }
}

export const getQueryString=(name)=> {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return (r[2]);
    return null;
}
export const saveCookie = (key,value,expires_in) => {
        let exp = new Date();
        // exp.setTime(exp.getTime() + expires_in * 1000)
        exp.setTime(exp.getTime() + expires_in * 24 * 60 * 60 * 1000) //天

    document.cookie = key + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

export const deleteCookie = (name) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    document.cookie= name + "=''"+";expires="+exp.toGMTString();
}

export const getCookie = (key) => {
    var aCookie = document.cookie.split("; ");
    // console.log(aCookie);
    for (var i = 0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (key == aCrumb[0])
            return unescape(aCrumb[1]);
    }
    return null;
}

export const sendEvent = (key, value) => {
    var event = new Event(key);
    event.newValue = value;
    window.dispatchEvent(event);
}

// sendEvent("messages", { msg: "审核失败", status: 203 });