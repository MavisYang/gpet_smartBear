import React from 'react';
import ReactDOM from 'react-dom';
import {Switch,Route,Router} from 'react-router';
import Error from './containers/Error'
import RegisterScope from './containers/RegisterScope';
import ProtocalScore from './components/smartBearPortal/ProtocalScore'
import AddFriend from './components/smartBearPortal/AddFriend';
import ErrorScore from './components/smartBearPortal/ErrorScore';
import HowAdoptScore from './components/smartBearPortal/HowAdopt'
import Offline from './containers/Offline'
import createBrowserHistory from 'history/createBrowserHistory';
import './index.css'
const history = createBrowserHistory();

// 系统状态判断
// $.ajax({
//     type:'get',
//     async: false,
//     url:API_PATH+'/basis-api/noauth/appStatus?appCode=chatPet',
//     success: function(res){
//         if(res.resultCode=='100'&&res.resultContent.status==2){
//             history.push('/chatpet/offline?time='+encodeURI(res.resultContent.upGradeEndTime))
//         }
//     }
// })

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route path="/chatpet/error" component={Error} />
            <Route path='/chatpet/register' component={RegisterScope}/>
            <Route path='/chatpet/protocal' component={ProtocalScore}/>
            <Route path='/chatpet/addfriend' component={AddFriend}/>
            <Route path='/chatpet/howadopt' component={HowAdoptScore}/>
            <Route path='/grouppet/offline' component={Offline}/>
            <Route path='/chatpet/errorbear' component={ErrorScore}/>
        </Switch>
    </Router>
    , document.getElementById('root'));
