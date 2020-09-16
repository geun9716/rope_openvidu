import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';


const UserVideoComponent =(props)=>{

    const getNicknameTag=()=> {
        // Gets the nickName of the user
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
    }

    
        return (
            <>
            <div>
                {props.streamManager !== undefined ? (
                    <div className="streamcomponent">
                        <OpenViduVideoComponent streamManager={props.streamManager} />
                        <div><p>{getNicknameTag}</p></div>
                    </div>
                ) : null}
            </div>
            </>
        );
    
}

export default UserVideoComponent;
