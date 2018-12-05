import { Base64 } from 'js-base64';

const promiseXHR = (url,token,data,type) => {
  return  new Promise((resolve, reject) => {
    var xhr=new XMLHttpRequest();
    xhr.open(type,url,true);
    if(typeof data === 'object'){
      xhr.setRequestHeader('Content-Type','application/json')
      data = JSON.stringify(data)
    }else {
      xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    }
    if(token!=null){
      token.value = token.type == 'Basic' ? Base64.encode("liz-service:secret") : token.value
      xhr.setRequestHeader('Authorization',token.type+' '+token.value)
    }
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if (xhr.status>=200&&xhr.status<300||xhr.status==304) {
                resolve(xhr.responseText)
            }else{
                reject(xhr.responseText)
            }
        }
    }
    xhr.send(data);
  })
}
export default promiseXHR
