import React, { useState, memo, useEffect } from 'react';
import { Form, Button, PageHeader, Input, Row, Col, Menu } from 'antd'
import axios from 'axios';
import { HomeOutlined, VideoCameraAddOutlined, FileAddOutlined, SafetyOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Layout, Typography } from 'antd';

import {
    BrowserRouter,
    Route,
    Link,
    Switch,
    useLocation,
} from 'react-router-dom';


const SideMenu = memo((props) => {

    const location = useLocation();
    const MenuName = ["홈", "시험 등록-관리", "시험장 입장-관리"];
    const icons = [<HomeOutlined />, <FileAddOutlined />, <VideoCameraOutlined />, <VideoCameraAddOutlined />];
    const Links = ["/Main", "/Main/1", "/Main/2"];
    const [selectedKey, setselectedKey] = useState("0");
    const [disabled, setdisabled] = useState(false);


    /*    useEffect(()=>{
           document.getElementById("시험장 입장-관리").className="ant-menu-item ant-menu-item-disabled";
       },[]); */

    useEffect(() => {
        console.log(location);
        let index = Links.findIndex((v) => {
            return (v === location.pathname);
        });
        setselectedKey(String(index));
    }, [location]);




    return (
        <>
            {/* <div className="logo"/> */}

            <Menu mode="inline" theme="dark" selectedKeys={[selectedKey]} >

                {/* {
                    MenuName.map((v, i) => {
                        return <Menu.Item key={i} icon={icons[i]} id={v} > <Link to={Links[i]}>{v}</Link></Menu.Item>;
                    })
                }
 */}
                <Menu.Item key={0} icon={icons[0]}> 
                    <Link to={Links[0]}>{MenuName[0]}</Link>
                </Menu.Item>
                <Menu.Item key={1} icon={icons[1]}> 
                    <Link to={Links[1]}>{MenuName[1]}</Link>
                </Menu.Item>
                <Menu.Item key={2} icon={icons[2]} > 
                    <Link to={Links[2]}>{MenuName[2]}</Link>
                </Menu.Item>


            </Menu>


        </>
    );
});

export default SideMenu;