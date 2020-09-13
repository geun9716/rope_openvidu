import React, { useState, memo,useEffect } from 'react';
import { Form, Button, PageHeader, Input, Row, Col, Menu } from 'antd'

import { HomeOutlined, VideoCameraAddOutlined, FileAddOutlined, SafetyOutlined,VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Typography } from 'antd';

import {
    BrowserRouter,
    Route,
    Link,
    Switch,
    useLocation,
} from 'react-router-dom';


const SideMenu = memo((props) => {

    const location=useLocation();
    const MenuName = ["홈", "시험 등록-관리", "시험장 입장-학생","/*시험장 입장-관리*/ Test","제출 화면","시험 완료-답안지 확인","시험 링크" ];
    const icons = [<HomeOutlined />, <FileAddOutlined />, <VideoCameraOutlined />,<VideoCameraAddOutlined />];
    const Links = ["/Main", "/Add-Test", "/EnterExam-Student","/Test","/2","/3","/4"];
    const [selectedKey, setselectedKey] = useState("0");

    useEffect(()=>{
        console.log(location);
        let index=Links.findIndex((v)=>{
            return (v===location.pathname);
        });
        setselectedKey(String(index));
    },[location]);

    return (
        <>
            {/* <div className="logo"/> */}

            <Menu mode="inline" theme="dark" selectedKeys={[selectedKey]} >

                {
                    MenuName.map((v, i) => {
                        return <Menu.Item key={i} icon={icons[i]}> <Link to={Links[i]}>{v}</Link></Menu.Item>;
                    })
                }


            </Menu>


        </>
    );
});

export default SideMenu;