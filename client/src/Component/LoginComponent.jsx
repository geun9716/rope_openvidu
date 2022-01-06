import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'url-search-params-polyfill';
import "../../node_modules/antd/dist/antd.css"
import { Layout, Typography } from 'antd';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {ip} from './App';
const LoginComp = (props) => {


  const { Text } = Typography;


  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');




  /*   var params = new URLSearchParams();
    params.append('user', username);
    params.append('pass', password); */

  const OnClick = async () => {
    /* axios.get('/api-login/login')
    .then(res => {
      setdata(res.data);
    }) */
    if (username && password) {
      await axios.post(ip+'/user/login', {
        user: username,
        pass: password
      },
        { withCredentials: true }
      ).then((res) => {
        console.log(res.data);

        sessionStorage.setItem('sessionID', res.data.sessionID);
        sessionStorage.setItem('userID', res.data.userId);
        sessionStorage.setItem('isLogged', res.data.isLogged);

        if (res.data.message === 'login success') {
          props.history.push("/Main");
        }
        console.log(res);

        // if(res.data.message==='login success'){
        //     props.history.push("/Main");
        // }     
      }).catch((err) => alert(err));

    } else {
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
      <div style={{

        backgroundColor: "gray",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        alignSelf:"center",
        justifyContent: "center"
      }}>
        <div style={{
          textAlign: "center"
        }}>
          <Card>

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

          </Card>

        </div>

        
          <Link to='/EnterExam_Student'>Goto Exam</Link>
        
      </div>






    </>
  );
}

export default LoginComp;
