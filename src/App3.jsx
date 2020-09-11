import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import {
  BrowserRouter,
  Route,
  Link,
  Switch,
  useLocation,
} from 'react-router-dom';
const App3 = () => {

  const [data, setdata] = useState([]);

  useEffect(() => {

    /*  fetch('http://localhost:9000/users')
     .then(res => res.json())
     // json형식으로 받아온 값을 setState를 이용해 값을 재설정해줌
     .then(users => setdata(users)); */



  }, []);

  return (
    <>

        <div className="App">
          3
          <h1>Users3</h1>
          {data.map(data =>
            <div key={data.id}>{data.username}</div>
          )}
        </div>


    </>
  );
}

export default App3;
