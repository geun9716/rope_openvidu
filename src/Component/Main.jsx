import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import {

  Route,
  Link,

  
} from 'react-router-dom';


import "../../node_modules/antd/dist/antd.css"
import { Button, Menu } from 'antd';

import {SafetyOutlined} from '@ant-design/icons';
import { Layout, Typography } from 'antd';
import '../css/App.css'
import SideMenu from './SideMenu';
import Home from './Home';
import AddTest from './AddTest';

import Make_Session from './Make_Session';
import Result from './Result';

const Main = ({match, location, history}) => {

  const [data, setdata] = useState([]);

  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  const { Title, Text } = Typography;


  const [collapsed, setcollapsed] = useState(false);


  const onCollapse = () => {
    console.log(collapsed);
    if (collapsed === true) {
      setcollapsed(false);
    } else {
      setcollapsed(true);
    }
  }

  const OnClickLogout = async() => {
    /* axios.get('/api-login/login')
    .then(res => {
      setdata(res.data);
    }) */
/*     await axios.delete('/api/sessions/'+sessionStorage.getItem('sessionID'), {},
    { withCredentials: true }
    ).then(res => {
      
    }); */


      await axios.post('http://localhost:5000/user/logout', {},
      { withCredentials: true }
      ).then(res => {
        sessionStorage.setItem('sessionID',undefined);
        sessionStorage.setItem('userID',undefined);
        sessionStorage.setItem('isLogged',false);
        history.push("/");
      });
         

  }


  return (
    <>
 
        <Layout style={{ minHeight: '100vh' }}>

          <Header>
            <Text className="Logo">
              <Link to="/Main" style={{
                color: "white"
              }}><SafetyOutlined />ThrowOrNot</Link>
            </Text>
            <Text className="subLogo">
              &nbsp; @Rude_zoo @hyowii
                    </Text>
              
              <Button id="logoutbtn" type="primary" onClick={OnClickLogout}>Logout</Button>


          </Header>



          <Layout>

            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <SideMenu match={match} ></SideMenu>
            </Sider>
            <Layout>


              <Content className="Site-Content">

                <div className="site-layout-content">
                
                      <Route exact path={match.path} component={Home}></Route>
                      <Route path={`${match.path}/1`} component={AddTest}></Route>
                      <Route path={`${match.path}/2`} component={Make_Session}></Route>
                      <Route path={`${match.path}/3`} component={Result}></Route>
                


                </div>

              </Content>
              <Footer style={
                {
                  textAlign: "center"
                }
              }>Web Design ©2020 Created by Rude zoo</Footer>
            </Layout>

          </Layout>

        </Layout>

  
    </>


  );
}

export default Main;
