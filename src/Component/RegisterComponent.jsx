import React, { useState, memo, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Typography, Divider, Space} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import {
    Link,
} from 'react-router-dom';
import axios from 'axios';

const RegisterComp = memo((props) => {
    const { Text } = Typography;

    const [Passwrd, setPasswrd] = useState('');
    const [PasswrdCheck, setPasswrdCheck] = useState('');
    const [Correct, setCorrect] = useState('');
    const [CheckedList, setCheckedList] = useState([]);

    const [Id, setId] = useState('');
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');

    const [IdIn, setIdIn] = useState('');
    const [passIn, setpassIn] = useState('');
    const [NameIn, setNameIn] = useState('');
    const [EmailIn, setEmailIn] = useState('');
    //const [CheckIn, setCheckIn] = useState();

    const layout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 6 },
    }

    const Buttonlayout = {
        wrapperCol: { offset: 10, span: 6 },
    }


    const options = [
        { label: '학생', value: 0 },
        { label: '조교', value: 1 },
        { label: '교수', value: 2 },
    ];



    const onChangePasswd = (e) => {
        setPasswrd(e.target.value);
    }

    const onChangePasswdCheck = (e) => {

        setPasswrdCheck(e.target.value);
    }

   /*  const onChangeCheckedList = (checkedlist) => {
        if (checkedlist.length < 2) {
            setCheckedList(checkedlist);
        }

    } */

    const OnchangeId = (e) => {
        setId(e.target.value);
    }
    const OnchangeName = (e) => {
        setName(e.target.value);
    }
    const OnchangeEmail = (e) => {
        setEmail(e.target.value);
    }


    const OnClickBtn = () => {
        if (Id === '') {
            setIdIn('아이디를 입력하세요!');
        }else{
            setIdIn('');
        }      
        if (Passwrd === '') {
            setpassIn('비밀번호를 입력하세요!');
        }else{
            setpassIn('');
        }
  
        if (Name === '') {
            setNameIn('이름 입력하세요!');
        }else{
            setNameIn('');
        }
        if (Email === '') {
            setEmailIn('이메일을 입력하세요!');
        }else{
            setEmailIn('');
        }

        axios.post('http://localhost:5000/user/join', {
            userId : Id,
            pass : Passwrd,
            email : Email,
            name : Name
          }).then(res => {
            if(res.data.message==='join fail'){
                alert("이미 등록된 사용자입니다");
            }
            if(res.data.message==='join success'){
                alert("가입성공!");
                props.history.push("/");
            }

            
            
          });

    }


    useEffect(() => {
        if (Passwrd != '' && PasswrdCheck != '') {
            if (PasswrdCheck === Passwrd) {
                setCorrect('위와 일치합니다');
            } else {
                console.log(Passwrd);
                console.log(PasswrdCheck);
                setCorrect('위와 일치하지 않습니다');
            }
        }

    }, [Passwrd, PasswrdCheck]);



    return (
        <>
            <div>
                <div style={{
                    padding: 20,
                }}>
                    <Text style={{
                        fontSize: 25,
                        color: "#120338",
                    }}>
                    <Link to="/" style={{
                        color:"black"
                    }}><LeftOutlined></LeftOutlined></Link>
                    &nbsp;
                        회원가입
                    </Text>
                    <Divider />
                </div>

                <div className="SignupForm">
                    <Form style={{

                    }}>
                        <Form.Item {...layout} label="아이디">
                            <Space>
                                <Input placeholder="아이디를 입력하세요" value={Id} onChange={OnchangeId}></Input>
                            </Space>
                            <div style={{
                                color: "red",
                            }}>
                                {IdIn}
                            </div>

                        </Form.Item>
                        <Form.Item {...layout} label="패스워드">
                            <Input.Password placeholder="패스워드를 입력하세요" onChange={onChangePasswd} value={Passwrd} />
                            <div style={{
                                color: "red",
                            }}>
                                {passIn}
                            </div>

                        </Form.Item>
                        <Form.Item {...layout} label="패스워드 확인">
                            <Input.Password placeholder="위에 작성한 패스워드를 입력하세요" onChange={onChangePasswdCheck} value={PasswrdCheck} />
                            {Correct}
                        </Form.Item>
                        {/* <Form.Item {...layout} label="계정 종류" style={{
                            marginBottom: 0,
                        }}>
                            <Form.Item valuePropName="checked">
                                <Checkbox.Group options={options} onChange={onChangeCheckedList} value={CheckedList}></Checkbox.Group>
                                <div style={{
                                    color: "red",
                                }}>
                                    {CheckIn}
                                </div>
                            </Form.Item>


                        </Form.Item> */}

                        <Form.Item {...layout} label="이름">
                            <Input placeholder="이름을 입력하세요" value={Name} onChange={OnchangeName}></Input>
                            <div style={{
                                color: "red",
                            }}>
                                {NameIn}
                            </div>

                        </Form.Item>

                        <Form.Item {...layout} label="이메일">
                            <Input placeholder="이메일을 입력하세요" value={Email} onChange={OnchangeEmail}></Input>
                            <div style={{
                                color: "red",
                            }}>
                                {EmailIn}
                            </div>

                        </Form.Item>


                        <Form.Item {...Buttonlayout}>
                            <Button size="large" type="secondary" htmlType="submit" className="LoginBtn" onClick={OnClickBtn} style={{
                                marginBottom :30
                            }}>가입</Button>
                        </Form.Item>



                    </Form>
                </div>

            </div>

        </>
    );
});

export default RegisterComp;