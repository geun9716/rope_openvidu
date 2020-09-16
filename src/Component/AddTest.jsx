import React, { useState, memo, useEffect } from 'react';
import { Form, Input, Button,  Typography, Divider,  TimePicker, Upload,message } from 'antd';
import { UploadOutlined, InboxOutlined, AlertFilled } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import OpenViduSession from 'openvidu-react';

const AddTest = (prop) => {
    const { Dragger } = Upload;
    const { Text } = Typography;
    const { TextArea } = Input;
    const { RangePicker } = TimePicker;

    const [fileList, setFileList] = useState([]);

    const [fileName, setfileName] = useState('');
    const [fileWarn, setfileWarn] = useState('');
    const [fileTime, setfileTime] = useState(0);
    const [Times, setTimes] = useState();

    

    const OPENVIDU_SERVER_URL='https://192.168.99.100:4443';
    const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

    const meta = {
        fileName: fileName,
        contents: fileWarn,
        time : fileTime,
        userID : sessionStorage.getItem("userID"),
        sessionID : sessionStorage.getItem("sessionID"),
        isLogged : sessionStorage.getItem("isLogged"),
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 10 },
    }


    const Buttonlayout = {
        wrapperCol: { offset: 8, span: 4 },
    }

    const UploadFile = async() => {

        let data=JSON.stringify(sessionStorage.getItem("sessionID"));

        const formData = new FormData();
        fileList.forEach(file => formData.append('files', file));

        for (let key in meta) {
            formData.append(key, meta[key]);
        }

        await axios.post('http://localhost:5000/api-session/create', formData, {
            header: { 'Content-Type': 'multipart/form-data' }
        }).then((res)=>{
             if(res.data.message==='success'){
                prop.history.push("/Main/2");
             }   
         
        }).catch((err)=> alert(err));

       /*  await axios.post(OPENVIDU_SERVER_URL + '/api/sessions',data,{
            headers: {
                Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                'Content-Type': 'application/json',
            },
        }).then((res)=>{
            console.log('CREATE SESION', res.data.id);
        }).catch((response) => {
            var error = Object.assign({}, response);
            if (error.response && error.response.status === 409) {
                console.log(error.response);
            } else {
                console.log(error);
 
            }
        }); */
    }

    const OnClickBtn=()=>{
        if(fileName && fileWarn && fileTime!=0 && fileList.length!=0){
            UploadFile();
        }else{
            alert("양식을 입력해주세요!");
        }
    }


    const props = {
        name: "file",
        multiple: true,
        action: "http://localhost:5000/api-session/create/",
        beforeUpload: file => {

            setFileList(fileList.concat(file));
            return false;

        }, 
        fileList,
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
 
    const OnRemoveFile=(file)=>{
        console.log(file);
        let tempList=[];
        fileList.forEach((v)=>{
            tempList.push(v);
        });
        tempList.splice(tempList.indexOf(file),1)
        setFileList(tempList);
    }

    const OnChangeFileName=(e)=>{
        setfileName(e.target.value);
    }
    const OnChangeFileWarn=(e)=>{
        setfileWarn(e.target.value);
    }
    const OnChangeFileTime=(time,timeString)=>{
        setTimes(time);
        setfileTime(Math.round(moment.duration(time[1].diff(time[0])).asMinutes()));
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
                            <Button htmlType="submit" style={{
                                width: "100%",
                                marginBottom: 30,
                            }} onClick={OnClickBtn}>게시</Button>
                        </Form.Item>
                    </Form>
                </div>

            </div>
        </>
    );
}

export default AddTest;