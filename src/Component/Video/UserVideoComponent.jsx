import React, { useEffect, useState } from 'react';
import {Card} from 'antd';
import OpenViduVideoComponent from './OvVideo';

const UserVideoComponent = (props) => {

    const [NickName, setNickName] = useState();

    const getNicknameTag=()=> {
        // Gets the nickName of the user
         /* setNickName(JSON.parse(props.streamManager[props.index-1].stream.connection.data).clientData);  */
        console.log(props.index);
        if(props.index>0 && props.streamManager[props.index-1]){
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
                        <Card hoverable title={NickName} style={{
                        }}>
                            <OpenViduVideoComponent streamManager={props.streamManager} index={props.index}/>
                        </Card>
                    </div>
                ) : null}
            </div>

        </>

    );
}

export default UserVideoComponent;
