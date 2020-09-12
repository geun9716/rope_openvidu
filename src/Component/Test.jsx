import React, { useState, memo, useEffect } from 'react';
import { Button, Input, Form } from 'antd'


const Test = () => {


    return (

        <>
            <div style={{
                textAlign: "center",
                margin: 100
            }}>
                <div style={{
                    textAlign: "center",
                    width: "50%",
                    display: "inline-block"
                }}>
                    <Form>
                        <Form.Item>
                            <Input placeholder="Input Here"></Input>
                        </Form.Item>

                        <Form.Item>
                            <Button htmlType="submit">Click</Button>
                        </Form.Item>
                    </Form>



                </div>
            </div>
        </>



    );

}

export default Test;