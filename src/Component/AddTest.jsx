import React, { useState, memo } from 'react';
import { Form, Input, Button, Typography, Divider, TimePicker, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import {
    Link,

} from 'react-router-dom';
import {ip} from './App';

const AddTest = memo((prop) => {
    const { Dragger } = Upload;
    const { Text } = Typography;
    const { TextArea } = Input;
    const { RangePicker } = TimePicker;

    const [fileList, setFileList] = useState([]);

    const [fileName, setfileName] = useState('');
    const [fileWarn, setfileWarn] = useState('');
    const [fileTime, setfileTime] = useState(0);
    const [Times, setTimes] = useState();
    const [disabledBtn, setdisabledBtn] = useState(true);

    const [timestring, settimestring] = useState([]);


    const meta = {
        fileName: fileName,
        contents: fileWarn,
        time: fileTime,
        userID: sessionStorage.getItem("userID"),
        sessionID: sessionStorage.getItem("sessionID"),
        isLogged: sessionStorage.getItem("isLogged"),
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 10 },
    }


    const Buttonlayout = {
        wrapperCol: { offset: 8, span: 4 },
    }

    const Open = (e) => {
        e.preventDefault();
        setfileName('');
        setfileWarn('');
        setTimes('');
        setFileList([]);
        setdisabledBtn(false);
    }

    const UploadFile =async(e) => {
        e.preventDefault();
        const formData = new FormData();
        fileList.forEach(file => formData.append('files', file));

        for (let key in meta) {
            formData.append(key, meta[key]);
        }

        await axios.post(ip+'/api-session/create', formData, {
            header: { 'Content-Type': 'multipart/form-data' }
        },
        ).then((res) => {
   
            if (res.data.message === 'create_success') {
                alert("파일 업로드 성공!");
                Open(e);
                
            }if (res.data.message === 'create exam fail') {
                alert("이미 존재하는 파일입니다!");
            }


        }).catch((err) => alert(err));
    }

    const OnClickBtn = (e) => {
        /* if (fileName && fileWarn && fileTime !== 0 && fileList.length !== 0) {
            UploadFile();
        } else {
            alert("양식을 입력해주세요!");
        } */
        UploadFile(e);
    }


    const props = {
        name: "file",
        multiple: true,
        action: ip+"/api-session/create/",
        beforeUpload: file => {

            setFileList(fileList.concat(file));
            return false;

        },
     
        onChange(info) {
            const { status } = info.file;
            /*             if (status !== 'uploading') {
                          console.log(info.file, info.fileList);
            
                        } */
            /*             if(status==='removed'){
                            setFileList(fileList.splice(fileList.indexOf(info.file),1))
                        } */
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    }

    const OnRemoveFile = (file) => {
        console.log(file);
        let tempList = [];
        fileList.forEach((v) => {
            tempList.push(v);
        });
        tempList.splice(tempList.indexOf(file), 1)
        setFileList(tempList);
    }

    const OnChangeFileName = (e) => {
        setfileName(e.target.value);
    }
    const OnChangeFileWarn = (e) => {
        setfileWarn(e.target.value);
    }
    const OnChangeFileTime = (time, timeString) => {
        setTimes(time);
        settimestring(timeString);
        setfileTime(Math.round(moment.duration(time[1].diff(time[0])).asSeconds()));
        console.log(timeString)
        //console.log(Math.ceil(moment.duration(time[1].diff(time[0])).asMinutes()));
    }


    return (
        <>
            <div>
                <div style={{
                    padding: 20
                }}>
                    <Text strong style={{
                        fontSize: 20,
                    }}>
                        시험 등록
                        </Text>
                    <Divider></Divider>
                </div>
                <div>
                    <Form>

                        <Form.Item {...layout} label="시험 제목">
                            <Input placeholder="등록할 시험의 제목을 입력하세요" value={fileName} onChange={OnChangeFileName}></Input>
                        </Form.Item>
                        <Form.Item {...layout} label="시험 주의사항">
                            <TextArea rows={4} placeholder="시험시 주의 사항을 입력해 주세요" value={fileWarn} onChange={OnChangeFileWarn}></TextArea>
                        </Form.Item>
                        <Form.Item {...layout} label="시험 시간">
                            <RangePicker order="true" onChange={OnChangeFileTime} value={Times}></RangePicker>
                        </Form.Item>
                        <Form.Item {...layout} label="문제 파일">
                            <Dragger {...props} onRemove={OnRemoveFile}>
                                <p>
                                    <InboxOutlined />
                                </p>
                                <p>
                                    이곳에 파일을 드래그하여 등록하세요
                                </p>
                            </Dragger>
                        </Form.Item>
                        <Form.Item {...Buttonlayout}>
                            <Button  onClick={OnClickBtn} disabled={!disabledBtn}>등록</Button>

                        </Form.Item>
                        <Form.Item {...Buttonlayout}>
                            <Button style={{

                                marginBottom: 30,
                            }} onClick={Open} disabled={disabledBtn}><Link to="/Main/2">시험 시작</Link></Button>

                        </Form.Item>

                    </Form>
                </div>

            </div>
        </>
    );
});

export default AddTest;