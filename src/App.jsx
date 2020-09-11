import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter,
  Route,
  Link,
} from 'react-router-dom';
import App2 from './App2';
import App3 from './App3';
const App = () => {

  const [data, setdata] = useState([]);

  useEffect(() => {

    /*  fetch('http://localhost:9000/users')
     .then(res => res.json())
     // json형식으로 받아온 값을 setState를 이용해 값을 재설정해줌
     .then(users => setdata(users)); */



  }, []);

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <h1>Users</h1>
          1
          <Link to="/App2">app2</Link>
          <Link to="/App3">app3</Link>

          <div>
              <Route path="/App2" component={App2}></Route>
              <Route path="/App3" component={App3}></Route>
          </div>

        </div>
      </BrowserRouter>

    </>
  );
}

export default App;
