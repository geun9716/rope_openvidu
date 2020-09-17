import React, { useState, memo, useEffect } from 'react';
import { Form, Button, PageHeader, Input, Row, Col, Menu } from 'antd'
import axios from 'axios';
import { HomeOutlined, VideoCameraAddOutlined, FileAddOutlined, VideoCameraOutlined,CheckOutlined } from '@ant-design/icons';


import {

    Link,
    useLocation,
} from 'react-router-dom';


const SideMenu = memo(() => {

    const location = useLocation();
    const MenuName = ["홈", "시험 등록", "시험장 입장","시험결과 확인"];
    const icons = [<HomeOutlined />, <FileAddOutlined />, <VideoCameraOutlined />,<CheckOutlined />];
    const Links = ["/Main", "/Main/1", "/Main/2","/Main/3"];
    const [selectedKey, setselectedKey] = useState("0");
   


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

                 {
                    MenuName.map((v, i) => {
                        return <Menu.Item key={i} icon={icons[i]} id={v} > <Link to={Links[i]}>{v}</Link></Menu.Item>;
                    })
                }
 
                {/* <Menu.Item key={0} icon={icons[0]}> 
                    <Link to={Links[0]}>{MenuName[0]}</Link>
                </Menu.Item>
                <Menu.Item key={1} icon={icons[1]}> 
                    <Link to={Links[1]}>{MenuName[1]}</Link>
                </Menu.Item>
                <Menu.Item key={2} icon={icons[2]} > 
                    <Link to={Links[2]}>{MenuName[2]}</Link>
                </Menu.Item> */}


            </Menu>


        </>
    );
});

export default SideMenu;