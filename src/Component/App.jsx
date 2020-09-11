import React, { useState } from 'react';
import { useEffect } from 'react';

import {
  BrowserRouter,
  Route,
  Link,
  Switch,
  useLocation,
} from 'react-router-dom';
import LoginComp from './LoginComponent';
import Main from './Main';

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
          </Switch>
          
       
      </BrowserRouter>
    </>


  );
}

export default App;
