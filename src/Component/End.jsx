import React, { useState } from 'react';

import { Result,Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const End = () => {


    const OnClick=()=>{
        window.close();
    }

    return (
        <>
            <Result
                icon={<SmileOutlined />}
                title="수고하셨습니다!"
                extra={<Button type="primary" onClick={OnClick}>End</Button>}
            >   
            
            </Result>

        </>


    );
}

export default End;
