import React, { useRef,useEffect } from 'react';


const OpenViduVideoComponent=(props)=>{
    
    const videoRef=useRef();



    useEffect(()=>{
        if(props && videoRef){
            props.streamManager.addVideoElement(videoRef.current);
        }
    });

    return(

        <>

        <video autoPlay={true} ref={videoRef} />

        </>

    );

}

export default OpenViduVideoComponent;