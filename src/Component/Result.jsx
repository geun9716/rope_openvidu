import React, { useState, memo, useEffect } from 'react';
import { Button, Input, Form, Table } from 'antd'
import axios from 'axios';
import '../css/index.css'
import { ip } from './App';
const Result = () => {

    const [eid, seteid] = useState(0);
    const [mySessionID, setmySessionID] = useState(sessionStorage.getItem("sessionID"));
    const [Visible, setVisible] = useState(false);
    const [data, setdata] = useState([]);
    const [timelabs, settimelabs] = useState();
    const [answer, setanswer] = useState();

    const getData = async () => {
        await axios.get(ip + '/exam/get/' + mySessionID, {})
            .then((res) => {
                console.log(res.data[0].content);

                seteid(res.data[0].eid);


            }).catch((err) => alert(err));
    }

    const Setdata = (data) => {
        let temp = [];
        data.map((v, i) => {
            temp.push({
                key: i,
                sid: v.sid,
                name: v.sName,
                time: v.cam_file,
                answer: v.result_file,
            });
        });
        console.log(temp);
        setdata(temp);
    }

    const getStudentData = async () => {
        console.log(eid);
        await axios.get(ip + '/exam/result/' + eid, {})
            .then((res) => {
                console.log(res.data);
                if (res.data.message === 'there is no student') {
                    alert("학생이 존재하지 않습니다!");
                } else {
                    setVisible(true);
                    Setdata(res.data);
                }

            }).catch((err) => alert(err));
    }


    const OnClickBtn = () => {

        getData();
    }

    const OnClickShowBtn = () => {
        if (eid === 0) {
            alert("시험 데이터와 연동을 먼저해주세요!");
        } else {

            getStudentData();

        }

    }
    const columns = [
        {
            title: '학번',
            dataIndex: 'sid',
            width: 150,
            align: 'center'
        },
        {
            title: '이름',
            dataIndex: 'name',
            width: 150,
            align: 'center'
        },

        {
            title: '타임랩스',
            dataIndex: 'time',
            width: 150,
            align: 'center',
            render: (text) => {
                import('../uploads/answers/' + text).then((pdf) => {
                    settimelabs(pdf.default)
                })

                return (<a href={timelabs} download>{text}</a>);
            }
        },
        {
            title: '답안파일',
            dataIndex: 'answer',
            width: 150,
            align: 'center',
            render: (text) => {
                import('../uploads/answers/' + text).then((pdf) => {
                    setanswer(pdf.default)
                })

                return (<a href={answer} download>{text}</a>);
            }
        },
    ];


    return (

        <>
            <div style={{




                flexDirection: 'column',
                alignItems: "center",
                height: 800

            }}>
                {/* <a href="/uploads/answers/1600341729183.pdf" download>download</a> */}
                <div style={{
                    padding:30
                }}>
                    <Button onClick={OnClickBtn}>데이터 연동</Button>
                    &nbsp;
                    <Button onClick={OnClickShowBtn}>시험 결과 조회</Button>
                </div>



                {Visible ?

                    <div style={{

                        margin: 15
                    }}>
                        <Table columns={columns} pagination={{ pageSize: 50 }} scroll={{ y: 240 }} dataSource={data}></Table>

                    </div> : null}
            </div>
        </>



    );

}

export default Result;