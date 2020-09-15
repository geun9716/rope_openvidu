import React, { useState } from 'react';
import { Modal, Button, Input, Form, Card,Typography } from 'antd';
import "../css/EnterExam-Student.css"
import { WarningOutlined } from '@ant-design/icons';

let docV=document.documentElement;

const EnterExam_Student = (props) => {

    const {Text}=Typography;
    
    const [Visible, setVisible] = useState(true);
    const [StudentId, setStudentId] = useState('');
    const [Name, setName] = useState('');

    const [visibleContext, setvisibleContext] = useState(false);



    const OnCancle = () => {
        setVisible(false);
    }
    const OnFinish = (values) => {
        if (values.sid != '' && values.sname != '') {
            setStudentId(values.sid);
            setName(values.sname);
            setVisible(false);
            setvisibleContext(true);
        }

    };
    const OnClickExamBtn=()=>{
        docV.requestFullscreen();
        props.history.push("/Examing");

    }

    const OnClickSharingBtn=()=>{
        props.history.push("/Sharing");

    }
   

    /*     const OnChangeStudentId=(e)=>{
            setStudentId(e.target.value);
        }
    
        const OnChangeName=(e)=>{
            setName(e.target.value);
        } */

    return (
        <>
            <div>
                <Modal visible={Visible}

                    title="정보 입력"
                    footer={[

                    ]}

                >
                    <Form onFinish={OnFinish} >
                        <Form.Item>
                             <Text style={{
                                 color:"gray"
                             }}>제출 전 반드시 인적사항을 확인해주세요!</Text>
                        </Form.Item>
                       

                        <Form.Item name="sid" label="학번" rules={[{ required: true, message: '학번을 입력하세요!' }]}>
                            <Input></Input>
                        </Form.Item>
                        <Form.Item name="sname" label="이름" rules={[{ required: true, message: '이름을 입력하세요!' }]}>
                            <Input ></Input>
                        </Form.Item>
                        <Form.Item>
                            <Button key="back" onClick={OnCancle}>취소</Button>
                            <Button key="submit" htmlType="submit">제출</Button>
                        </Form.Item>
                    </Form>
                </Modal>


                {visibleContext===true?
                <div className="enterexam-background">
                    <Card title="※주의사항※" bordered="false" style={{
                        top: "30%",
                        left: "35%",
                        width: 500,
                        height: 400,

                    }}>
                        
                        <p>
                            인적사항
                        </p>
                        <p>
                            학번 : {StudentId}
                        </p>
                        <p>
                            이름 : {Name}
                        </p>
                        <p> {/* 여기서 서버에서 주의사항을 받아온다 */}
                            시험 시간은 60분이며, 유형은 객관식 10문항입니다. 각 배점은 문제 옆에 표기되있습니다
                    </p>
                    <Button onClick={OnClickSharingBtn}>화면 공유하기</Button>
                    <Button onClick={OnClickExamBtn}>시험 시작</Button>
                    </Card>

                </div> : ' '}
                

            </div>



        </>
    );
}

export default EnterExam_Student;