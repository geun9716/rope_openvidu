import React, { useState ,useEffect} from 'react';
import { Modal, Button, Input, Form, Card, Typography, Dropdown, Menu } from 'antd';
import "../css/EnterExam-Student.css"
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import {ip} from './App';
import { OpenVidu } from 'openvidu-browser';




const OPENVIDU_SERVER_URL = 'https://172.17.0.2:4443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

let docV = document.documentElement;
let OV;


const EnterExam_Student = (props) => {

    const { Text } = Typography;

    const [Visible, setVisible] = useState(true);
    const [StudentId, setStudentId] = useState('');
    const [Name, setName] = useState('');

    const [visibleContext, setvisibleContext] = useState(false);
    const [visibleTest, setvisibleTest] = useState(false);

    const [selectedTest, setselectedTest] = useState('시험을 선택하세요');
    const [eid, seteid] = useState(0);

    
    const [SessionIds, setSessionIds] = useState([]);
    const [Tests, setTests] = useState([]);

    const [visibleBtn, setvisibleBtn] = useState(true);

    const [Content, setContent] = useState('');
    const [Time, setTime] = useState(0);

    const [mySessionID, setmySessionID] = useState("");
    const [myUserName, setmyUserName] = useState("");
    const [fileName, setFileName] = useState();

    const [session, setsession] = useState();
    const [mainStreamManager, setmainStreamManager] = useState();
    const [Publisher, setpublisher] = useState();
    const [subscriber, setsubscriber] = useState([]);
    const [CanTestNow, setCanTestNow] = useState(true);

    const OnCancle = () => {
        setVisible(false);
    }

    const getExamData = async () => {
        await axios.get(ip+'/exam/lists', {})
            .then((res) => {
                let temp=[];
                   for(let i=0;i<res.data.length;i++){
                    temp.push(res.data[i].title);
                } 
                setTests(temp);
                temp=[];  
                for(let i=0;i<res.data.length;i++){
                    temp.push(res.data[i].sessionID);
                } 
                setSessionIds(temp);
                
            }).catch((err) => alert(err));
    }

    const OnFinish = (values) => {
        if (values.sid !== '' && values.sname !== '' && values.sid.length<11) {
            setStudentId(values.sid);
            setName(values.sname);
            setVisible(false);
            setvisibleTest(true);
            getExamData();
        }else{
            alert("제대로 된 값을 입력하세요!")
        }

    };

    const OnClickExamBtn = () => {
        docV.requestFullscreen();
        props.history.push({
            pathname : "/Examing",
            search : '',
            state : {fileName : fileName, time : Time, TestName:selectedTest, sName : Name, sid :StudentId, eid:eid}
        });

    }

    const getUserData=async()=>{
        await axios.get(ip+'/exam/get/'+mySessionID, {})
        .then((res) => {
           console.log(res.data[0].content);
            setContent(res.data[0].content);
            setTime(res.data[0].time)
            setFileName(res.data[0].file);
            seteid(res.data[0].eid);
            
        }).catch((err) => alert(err));
    }



    const onClickMenu = ({key}) => { 
        setvisibleBtn(false);
        setselectedTest(Tests[key]);
        setmySessionID(SessionIds[key]);          
    }

    let menu = (
        <Menu onClick={onClickMenu}>
            {
                Tests.map((v, i) => 

                    <Menu.Item key={i}>{v}</Menu.Item> 
                             
                )
            }
        </Menu>

    );

 

    const OnSelectTest=()=>{
        getUserData();
        setvisibleTest(false);
        setvisibleContext(true);
    }

    useEffect(() => {

        window.addEventListener('beforeunload', onbeforeunload);
        return (window.removeEventListener('beforeunload', onbeforeunload));
        
    });

    useEffect(() => {
        if (session) {
            var mySession = session;
            console.log(session);
            // --- 3) Specify the actions when events take place in the session ---
           
            // On every new Stream received...
            mySession.on('streamCreated', (event) => {

        
                // Subscribe to the Stream to receive it. Second parameter is undefined
                // so OpenVidu doesn't create an HTML video by its own
     /*            let sub = mySession.subscribe(event.stream, undefined);
                let subscribers = subscriber;
                subscribers.push(sub);

                // Update the state with the new subscribers
                setsubscriber(subscribers); */
            });

            // On every Stream destroyed...
            mySession.on('streamDestroyed', (event) => {

                // Remove the stream from 'subscribers' array
                deleteSubscriber(event.stream.streamManager);
            });
 
            // --- 4) Connect to the session with a valid user token ---

            // 'getToken' method is simulating what your server-side should do.
            // 'token' parameter should be retrieved and returned by your own backend
            getToken().then((token) => {
                // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
                // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
                mySession
                    .connect(
                        token,
                        { clientData: myUserName },
                    )
                    .then(() => {

                        // --- 5) Get your own camera stream ---

                        // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
                        // element: we will manage it on our own) and with the desired properties
                        let publisher = OV.initPublisher(undefined, {
                            audioSource: undefined, // The source of audio. If undefined default microphone
                            videoSource: "screen", // The source of video. If undefined default webcam
                            publishAudio: false, // Whether you want to start publishing with your audio unmuted or not
                            publishVideo: true, // Whether you want to start publishing with your video enabled or not
                            resolution: '640x480', // The resolution of your video
                            frameRate: 30, // The frame rate of your video
                            insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                            mirror: false, // Whether to mirror your local video or not
                        });

                        // --- 6) Publish your stream ---

                        mySession.publish(publisher);

                        // Set the main video in the page to display our webcam and store our Publisher
                        setmainStreamManager(publisher);
                        setpublisher(publisher);

                    })
                    .catch((error) => {
                        console.log('There was an error connecting to the session:', error.code, error.message);
                    });
            }); 
        }

    }, [session]);

    const onbeforeunload = (event) => {
        leaveSession();
    }

    const handlerJoinSessionEvent = () => {
        console.log('Join session');
    }

    const handlerLeaveSessionEvent = () => {
        console.log('Leave session');
        /* this.setState({
            session: undefined,
        }); */
    }
    const handlerErrorEvent = () => {
        console.log('Leave session');
    }

    const handleMainVideoStream = (stream) => {
        if (mainStreamManager !== stream) {
            setmainStreamManager(stream);
        }
    }

    const deleteSubscriber = (streamManager) => {
        let subscribers = subscriber;
        let index = subscribers.indexOf(streamManager, 0);
        if (index > -1) {
            subscribers.splice(index, 1);
            setsubscriber(subscribers);
        }
    }

    /*   const check = () => {
          document.getElementById("check").style.display = "none";
      } */

    const joinSession = (event) => {
        OV = new OpenVidu();

    

        axios
        .get(OPENVIDU_SERVER_URL + '/api/sessions/'+mySessionID, {
            headers: {
                Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {

            setsession(OV.initSession());
            setCanTestNow(false);
                
        }).catch((err)=> alert("Not yet"));
 
    

    }
    const leaveSession = () => {

        // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

        const mySession = session;

        if (mySession) {
            mySession.disconnect();
        }

        // Empty all properties...
        OV = null;
        setsession();
        setsubscriber([]);
        setmySessionID(sessionStorage.getItem("sessionID"));
        setmyUserName('Professor');
        setmainStreamManager(undefined);
        setpublisher(undefined);

    }


    const createSession = (sessionId) => {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ customSessionId: sessionId });
            axios
                .post(OPENVIDU_SERVER_URL + '/api/sessions', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('CREATE SESION', response);
                    resolve(response.data.id);
                })
                .catch((response) => {
                    var error = Object.assign({}, response);
                    if (error.response && error.response.status === 409) {
                        resolve(sessionId);
                    } else {
                        console.log(error);
                        console.warn(
                            'No connection to OpenVidu Server. This may be a certificate error at ' + OPENVIDU_SERVER_URL,
                        );
                        if (
                            window.confirm(
                                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                OPENVIDU_SERVER_URL +
                                '"\n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                OPENVIDU_SERVER_URL +
                                '"',
                            )
                        ) {
                            window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                        }
                    }
                });
        });
    }

    const createToken = (sessionId) => {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ session: sessionId });
            axios
                .post(OPENVIDU_SERVER_URL + '/api/tokens', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('TOKEN', response);
                    resolve(response.data.token);
                })
                .catch((error) => reject(error));
        });
    }

    const getToken = () => {
        return createSession(mySessionID).then((sessionId) => createToken(sessionId));
    }

    const OnClickSharingBtn = () => {
        setmyUserName(StudentId+"/"+Name);
        joinSession();

    }
    return (
        <>
            <div style={{

backgroundColor: "gray",
width: "100vw",
height: "100vh",
display: "flex",
flexDirection:'column',
alignContent:"center",
justifyContent: "center"
}}>
                <Modal visible={Visible}

                    title="정보 입력"
                    footer={[

                    ]}
                    centered

                >
                    <Form onFinish={OnFinish} >
                        <Form.Item>
                            <Text style={{
                                color: "gray"
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

                {visibleTest === true ?
                    <div className="enterexam-background">
                        <Card title="*시험 선택*" bordered="false" style={{
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

                            <div>
                                <Dropdown.Button icon={<DownOutlined/>} overlay={menu}>
                                    {selectedTest}
                                </Dropdown.Button>
                            </div>
                            <div style={{
                                marginTop:20
                            }}>
                                <Button disabled={visibleBtn} onClick={OnSelectTest}>선택</Button>
                            </div>

                                
                            

                        </Card>

                    </div> : ' '}

                {visibleContext === true ?
                    <div className="enterexam-background">
                        <Card title="※주의사항※" bordered="false" style={{
                            top: "30%",
                            left: "35%",
                            width: 500,
                            height: 400,

                        }}>

                            <p>
                            {selectedTest}
                        </p>
                        <p>
                            시험 시간 : {Math.round(Time/60) } 분
                        </p>
                            <p>
                                학번 : {StudentId}
                            </p>
                            <p>
                                이름 : {Name}
                            </p>
                            <p> {/* 여기서 서버에서 주의사항을 받아온다 */}
                            {Content}
                    </p>
                            <Button onClick={OnClickSharingBtn}>화면 공유하기</Button>
                            <br>
                            </br>
                            <br>
                            </br>
                            <Button onClick={OnClickExamBtn} disabled={CanTestNow}>시험 시작</Button>
                        </Card>

                    </div> : ' '}


            </div>



        </>
    );
}

export default EnterExam_Student;