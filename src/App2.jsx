import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import 'url-search-params-polyfill';

const App2 = () => {

  const [data, setdata] = useState([]);
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');

  useEffect(() => {

    /*  fetch('http://localhost:9000/users')
     .then(res => res.json())
     // json형식으로 받아온 값을 setState를 이용해 값을 재설정해줌
     .then(users => setdata(users)); */

  /*   axios.get('/users')
      .then(res => {
        setdata(res.data);
      }) */

  }, []);
  var params = new URLSearchParams();
  params.append('user', username);
  params.append('pass', password);
  const OnClick=()=>{
    /* axios.get('/api-login/login')
    .then(res => {
      setdata(res.data);
    }) */
    axios.post('http://localhost:9000/api-login/login',{
        user : username,
        pass : password
    }).then(res=>{
        console.log(res);
    });
    
  }

  const OnChangeUserName=(e)=>{
    setusername(e.target.value);
  }

  const OnChangePassWord=(e)=>{
    setpassword(e.target.value);
  }

  return (
    <>
        <div className="App">
          <h1>Users2</h1>
          <form>
              <input value={username} onChange={OnChangeUserName}></input>
              <input value={password} onChange={OnChangePassWord}></input>
              <button onClick={OnClick} type="submit">button</button>
          </form>
         
        </div>
        {data.map(data =>
            <div key={data.id}>{data.username}</div>
          )}
    </>
  );
}

export default App2;
