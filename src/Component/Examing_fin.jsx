import React, { useState, } from 'react';
import { Alert, Button, Card, Space, Statistic, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import {ip} from './App';
const Examing_fin = (props) => {


    const { Countdown } = Statistic
    const { Dragger } = Upload;
    const [fileList, setfileList] = useState([]);
    const [fileList2, setfileList2] = useState([]);

    const deadline = Date.now() + 5 * 60 * 1000; //

    const OnFinish = () => {

        console.log("fin");

    }

    const prop1 = {
        name: "file",
        multiple: true,
        action: ip+"/exam/student/",
        fileList,
        beforeUpload: file => {

            setfileList(fileList.concat(file));
            return false;

        },

    }

    const prop2 = {
        name: "file",
        multiple: true,
        action: ip+"/exam/student/",
        fileList2,
        beforeUpload: file => {

            setfileList2(fileList2.concat(file));
            return false;

        },

    }

    const meta = {
        eid: props.location.state.eid,
        sid: props.location.state.sid,
        sName: props.location.state.sName,

    }

    const OnRemoveFile1 = (file) => {

        let tempList = [];
        fileList.forEach((v) => {
            tempList.push(v);
        });
        tempList.splice(tempList.indexOf(file), 1)
        setfileList(tempList);
    }
    const OnRemoveFile2 = (file) => {

        let tempList = [];
        fileList2.forEach((v) => {
            tempList.push(v);
        });
        tempList.splice(tempList.indexOf(file), 1)
        setfileList2(tempList);
    }


    const UploadFile = async (e) => {
        e.preventDefault();
        if (fileList.length > 0 && fileList2.length > 0) {
            const formData = new FormData();

            fileList.forEach(file => formData.append('answer', file));
            fileList2.forEach(file => formData.append('answer', file));


            for (let key in meta) {
                formData.append(key, meta[key]);

            }

            await axios.post(ip+'/exam/student', formData, {
                header: { 'Content-Type': 'multipart/form-data' }
            },
            ).then((res) => {
                if (res.data.message === 'Create_success') {

                    props.history.push("/Ending");
                } else if (res.data.message === 'already sibmit') {
                    alert("이미 제출 했습니다!");
                }

            }).catch((err) => alert(err));
        } else {
            alert("파일을 등록해주세요!");
        }



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
                justifyContent: "center"
            }}>





                <div>
                    <Card title="시험 종료" style={{
                        textAlign: "center",
                        width: "100%"
                    }}
                        actions={[
                            <Button onClick={UploadFile}>제출</Button>
                        ]}>
                        <Countdown value={deadline} onFinish={OnFinish} />
                        <p>
                            <br></br>
                            수고하셨습니다
                        </p>
                        <p>
                            작성한 답안지와 타임랩스 파일을 제출해주세요
                        </p>
                        <Space>
                            <Dragger {...prop1} onRemove={OnRemoveFile1}>
                                <p>
                                    <InboxOutlined />
                                </p>
                                <p>
                                    타임랩스 파일을 드래그하여 등록하세요
                                </p>
                            </Dragger>
                            <Dragger {...prop2} onRemove={OnRemoveFile2}>
                                <p>
                                    <InboxOutlined />
                                </p>
                                <p>
                                    답안 파일을 드래그하여 등록하세요
                                </p>
                            </Dragger>

                        </Space>


                    </Card>
                </div>










            </div>


        </>
    );
}



export default Examing_fin;