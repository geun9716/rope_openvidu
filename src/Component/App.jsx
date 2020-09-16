import React, { useState } from 'react';
import { useEffect } from 'react';

import {
  BrowserRouter,
  Route,
  Link,
  Switch,
  useLocation,
  HashRouter
} from 'react-router-dom';


import EnterExam_Student from './EnterExam_Student';
import Examing from './Examing';
import LoginComp from './LoginComponent';
import Main from './Main';
import RegisterComp from './RegisterComponent';
import Sharing from './Sharing';
import Test from './Test';

const App = () => {


  useEffect(() => {

    /*  fetch('http://localhost:5000/users')
     .then(res => res.json())
     // json형식으로 받아온 값을 setState를 이용해 값을 재설정해줌
     .then(users => setdata(users)); */



  }, []);

  return (
    <>
      <BrowserRouter>
          <Switch>
            <Route exact path="/" component={LoginComp}></Route>
            <Route path="/Main" component={Main}></Route>
            <Route path="/Register" component={RegisterComp}></Route>
            <Route path="/Test" component={Test}></Route>
            <Route path="/Examing" component={Examing}></Route>
            <Route path="/EnterExam_Student" component={EnterExam_Student}></Route>
            <Route path="/Sharing" component={Sharing}></Route>
          </Switch>
          
       
      </BrowserRouter>
    </>


  );
}

export default App;
