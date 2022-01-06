import React, { useEffect, useState } from 'react';

import axios from 'axios';
import OpenViduSession from 'openvidu-react';
import { OpenVidu } from 'openvidu-browser';

import { AreaChartOutlined } from '@ant-design/icons';

const OPENVIDU_SERVER_URL = 'https://192.168.99.100:4443';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

let OV;

const Sharing = (props) => {



    const [mySessionID, setmySessionID] = useState("EQ0vMvWlTNQcqDYEe73E8mU9AIAOpXka");
    const [myUserName, setmyUserName] = useState(props.location.state.Id);
    const [token, settoken] = useState();
    const [session, setsession] = useState();
    const [mainStreamManager, setmainStreamManager] = useState();
    const [Publisher, setpublisher] = useState();
    const [subscriber, setsubscriber] = useState([]);

    

    useEffect(() => {
        console.log(myUserName);
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

    const OnClickBtn = () => {
        joinSession();
    }

    return (

        <>

            <div>
                <div id="check" >
                    <button onClick={OnClickBtn}>click</button>
                </div>
                {Publisher !== undefined ? (
                    <div className="stream-container col-md-6 col-xs-6" onClick={() => this.handleMainVideoStream(Publisher)}>
                        {/* <UserVideoComponent
                            streamManager={Publisher} /> */}
                    </div>
                ) : null}

            </div>


        </>

    );

}

export default Sharing;