import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'url-search-params-polyfill';
import "../../node_modules/antd/dist/antd.css"
import { Layout, Typography } from 'antd';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import storage from '../lib/storage';

const LoginComp = (props) => {


  const { Header, Footer, Sider, Content } = Layout;
  const { Text } = Typography;

  const [data, setdata] = useState([]);
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');




  useEffect(() => {

    /*  fetch('http://localhost:5000/users')
     .then(res => res.json())
     // json형식으로 받아온 값을 setState를 이용해 값을 재설정해줌
     .then(users => setdata(users)); */

    /*   axios.get('/users')
        .then(res => {
          setdata(res.data);
        }) */

  }, []);
/*   var params = new URLSearchParams();
  params.append('user', username);
  params.append('pass', password); */

  const OnClick = async() => {
    /* axios.get('/api-login/login')
    .then(res => {
      setdata(res.data);
    }) */
    if(username && password){
      await axios.post('http://localhost:5000/user/login', {
        user: username,
        pass: password
      },
      { withCredentials: true }
      ).then((res) => {
        if(res.data.message==='login success'){
          props.history.push("/Main");
      }      
        console.log(res);
        
        // if(res.data.message==='login success'){
        //     props.history.push("/Main");
        // }     
      }).catch((err) => alert(err));

    }else{
      alert("input please")
    }
        
    

  }

  const OnChangeUserName = (e) => {
    setusername(e.target.value);
  }

  const OnChangePassWord = (e) => {
    setpassword(e.target.value);
  }

  return (
    <>
      {/*         <div className="App">
          <h1>Users2</h1>
          <form>
              <input value={username} onChange={OnChangeUserName}></input>
              <input value={password} onChange={OnChangePassWord}></input>
              <button onClick={OnClick} type="submit">button</button>
          </form>
         
        </div>
 */}
      <div style={{
        textAlign :"center"
      }}>
        <div>
          <Text style={{
            fontSize: 30,
            fontWeight: 700,
          }}><LockOutlined />Login</Text>
        </div>
        <div className="LoginScreen">
          <Form>
            <Form.Item name="username" rules={[{ required: true, message: '아이디를 입력하세요!' }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="아이디" value={username} onChange={OnChangeUserName}></Input>
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '비밀번호를 입력하세요!' }]}>
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="비밀번호" value={password} onChange={OnChangePassWord}></Input.Password>
            </Form.Item>

            <Form.Item>
              <Button type="secondary" htmlType="submit" className="LoginBtn" onClick={OnClick}>로그인</Button>
            </Form.Item>
            <Text style={{
              float: "left",
            }}>or <Link to="./Register">회원가입</Link></Text>
          </Form>
        </div>
      </div>
          <br>
          </br>
       <Layout>
         <Link to='/Test'>Goto Test</Link>
       </Layout>
       <br>
          </br>
       <Layout>
         <Link to='/Main'>Goto Main</Link>
       </Layout>
       <Layout>
         <Link to='/EnterExam_Student'>Goto Exam</Link>
       </Layout>
          
        
     


    </>
  );
}

export default LoginComp;
