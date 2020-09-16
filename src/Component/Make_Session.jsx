import React, { useEffect,useState } from 'react';


const Make_Session=(props)=>{
    
    

    const [mySessionID, setmySessionID] = useState(sessionStorage.getItem("sessionID"));
    const [myUserName, setmyUserName] = useState("Professor");
    const [token, settoken] = useState();
 


    const handlerJoinSessionEvent=()=> {
        console.log('Join session');
    }

    const handlerLeaveSessionEvent=()=> {
        console.log('Leave session');
        this.setState({
            session: undefined,
        });
    }

    const check=()=>{
        document.getElementById("check").style.display="none";
    }


    return(

        <>

        

        </>

    );

}

export default Make_Session;