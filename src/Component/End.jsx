import React, { useState } from 'react';
import { useEffect } from 'react';

import { Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

const End = () => {

    return (
        <>
            <Result
                icon={<SmileOutlined />}
                title="수고하셨습니다!"
            >

            </Result>
        </>


    );
}

export default End;
