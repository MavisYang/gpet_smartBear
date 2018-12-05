import  axios from 'axios';

const promiseFile = (url,token,formData) => {

    return axios.post(url, formData)
      .then(function (response) {
        console.log(response);
        return response
      })
}

export default promiseFile
