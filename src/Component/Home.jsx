import React from 'react';
import { Typography, Divider, Skeleton, Title, Avatar, Space, Card } from 'antd'
import { NotificationOutlined } from '@ant-design/icons';
const Home = () => {
    const { Title, Text } = Typography;

    return (
        <>
            <Space style={{
                paddingTop: 20,
                paddingLeft: 20,
            }}>
                <Text style={{
                    fontWeight: "bold",
                    fontSize: 20,
                }}>ThrowOrNot에 오신걸 환영합니다!</Text>
                <Text keyboard>In out Site, No one can do cheat in Exam!</Text>
            </Space>
            <Divider></Divider>

            <div className="Content" style={{margin : 20}}>
               <Skeleton></Skeleton>
            </div>
            <Divider></Divider>
            <div style={{paddingLeft : 5}} className="space-align-container">
                <Text code>제공자</Text>
                <Avatar src="https://lh3.googleusercontent.com/ogw/ADGmqu8uPjReaS9H1M_C5UabkgioDOBDcDFM0E2MGa8H=s83-c-mo"></Avatar>
                <Avatar src="https://scontent-gmp1-1.xx.fbcdn.net/v/t1.0-9/117035716_3183548191766547_183287540202193355_n.jpg?_nc_cat=104&_nc_sid=09cbfe&_nc_ohc=tT2IyCRyMHAAX-81589&_nc_ht=scontent-gmp1-1.xx&oh=54ec351277fb364144c3ae023eac6673&oe=5F733C8E"></Avatar>
            </div>


        </>
    );
}

export default Home;