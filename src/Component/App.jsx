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
import End from './End';


import EnterExam_Student from './EnterExam_Student';
import Examing from './Examing';
import Examing_fin from './Examing_fin';
import LoginComp from './LoginComponent';
import Main from './Main';
import RegisterComp from './RegisterComponent';
import Sharing from './Sharing';

export const ip='http://localhost:5000';

const App = () => {

  return (
    <>
      <BrowserRouter>
          <Switch>
            <Route exact path="/" component={LoginComp}></Route>
            <Route path="/Main" component={Main}></Route>
            <Route path="/Register" component={RegisterComp}></Route>
            <Route path="/Examing" component={Examing}></Route>
            <Route path="/EnterExam_Student" component={EnterExam_Student}></Route>
            <Route path="/Sharing" component={Sharing}></Route>
            <Route path="/Examing_fin" component={Examing_fin}></Route>
            <Route path="/Ending" component={End}></Route>
            
          </Switch>
          
       
      </BrowserRouter>
    </>


  );
}

export default App;
