import React, { useState, useEffect,useRef } from 'react';
import UserVideoComponent from './Video/UserVideoComponent'
import { OpenVidu } from 'openvidu-browser';



let OV;


const Sharing = () => {


    const [mainStreamManager, setmainStreamManager] = useState();
    const [Publisher, setPublisher] = useState();
    OV = new OpenVidu();



   

    const OnClickBtn=()=>{ 
        
        let publisher = OV.initPublisher(undefined, {
        audioSource: undefined, // The source of audio. If undefined default microphone
        videoSource: 'screen', // The source of video. If undefined default webcam
        publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
        publishVideo: true, // Whether you want to start publishing with your video enabled or not
        resolution: '640x480', // The resolution of your video
        frameRate: 30, // The frame rate of your video
        insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
        mirror: false, // Whether to mirror your local video or not
    });

        setmainStreamManager(publisher);
        setPublisher(publisher);
    }

    return (
        <>  
            <div>
                    <div>
                        <button onClick={OnClickBtn}>join</button>
                    </div>

                     <div id="main-video" >
                                <UserVideoComponent streamManager={mainStreamManager} />
                            </div>
            </div>
            
        </>
    );
}

export default Sharing;