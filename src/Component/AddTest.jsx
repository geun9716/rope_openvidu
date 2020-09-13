import React, { useState, memo, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Typography, Divider, Space, TimePicker, Upload,message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const AddTest = () => {
    const { Dragger } = Upload;
    const { Text } = Typography;
    const { TextArea } = Input;
    const { RangePicker } = TimePicker;

    const [fileList, setFileList] = useState([]);

    const meta = {
        title: 'Title_1',
        contents: 'Content_1',
    }

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 10 },
    }


    const Buttonlayout = {
        wrapperCol: { offset: 8, span: 4 },
    }

    const UploadFile = () => {
        const formData = new FormData();
        fileList.forEach(file => formData.append('files', file));

        for (let key in meta) {
            formData.append(key, meta[key]);
        }

        axios.post('http://localhost:5000/user/files', formData, {
            header: { 'Content-Type': 'multipart/form-data' }
        });
    }

    const props = {
        name: "file",
        multiple: true,
        action: "http://localhost:5000/user/files/",
        beforeUpload: file => {

            setFileList(fileList.concat(file));
            return false;

        }, fileList,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
              console.log(info.file, info.fileList);
            }
            if (status === 'done') {
              message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          },
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
                            <Input placeholder="등록할 시험의 제목을 입력하세요"></Input>
                        </Form.Item>
                        <Form.Item {...layout} label="시험 주의사항">
                            <TextArea rows={4} placeholder="시험시 주의 사항을 입력해 주세요"></TextArea>
                        </Form.Item>
                        <Form.Item {...layout} label="시험 시간">
                            <RangePicker></RangePicker>
                        </Form.Item>
                        <Form.Item {...layout} label="문제 파일">
                            <Dragger {...props}>
                                <p>
                                    <InboxOutlined />
                                </p>
                                <p>
                                    이곳에 파일을 드래그하여 등록하세요
                                </p>
                            </Dragger>
                            <Button style={{
                                width: "100%",
                            }} onClick={UploadFile}><UploadOutlined /> 업로드</Button>
                        </Form.Item>
                        <Form.Item {...Buttonlayout}>
                            <Button htmlType="submit" style={{
                                width: "100%",
                                marginBottom: 30,
                            }}>게시</Button>
                        </Form.Item>
                    </Form>
                </div>

            </div>
        </>
    );
}

export default AddTest;