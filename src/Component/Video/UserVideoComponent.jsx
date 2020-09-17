import React, { useEffect, useState } from 'react';
import OpenViduVideoComponent from './OvVideo';

const UserVideoComponent = (props) => {

    const [NickName, setNickName] = useState();

    const getNicknameTag=()=> {
        // Gets the nickName of the user
         /* setNickName(JSON.parse(props.streamManager[props.index-1].stream.connection.data).clientData);  */
        console.log(props.index);
        if(props.index>0){
            setNickName(JSON.parse(props.streamManager[props.index-1].stream.connection.data).clientData);
        }
         //console.log((props.streamManager[props.index].stream)); 
    }

    useEffect(()=>{
        getNicknameTag();
    },[NickName]);



    return (

        <>

            <div>
                {props.streamManager !== undefined ? (
                    <div className="streamcomponent">
                        <OpenViduVideoComponent streamManager={props.streamManager} index={props.index}/>
                        <div><p>{NickName}</p></div>
                    </div>
                ) : null}
            </div>

        </>

    );
}

export default UserVideoComponent;
