import React, { useRef,useEffect } from 'react';


const OpenViduVideoComponent=(props)=>{
    
    const videoRef=useRef();



    useEffect(()=>{
        if(props.streamManager && props.index){
            
            if(props.index>0){
                props.streamManager[props.index-1].addVideoElement(videoRef.current); 
            }
            
         
        }
    },[]);

    return(

        <>
        {props.index>0 ? <video autoPlay ref={videoRef} /> : null}
        

        </>

    );

}

export default OpenViduVideoComponent;