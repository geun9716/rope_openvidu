import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Row, Col, Card, Carousel, Statistic } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { pdfjs, Document, Page } from 'react-pdf'



pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/' + pdfjs.version + '/pdf.worker.js';

const Examing = (props) => {

    const { Countdown } = Statistic;

    const deadline = Date.now() + props.location.state.time * 1000; // 

    const [modalvisible, setmodalvisible] = useState(false);

    const OnFinish = () => {

        console.log("fin");


        props.history.push({
            pathname: '/Examing_fin',
            state: { sName: props.location.state.sName, sid: props.location.state.sid, eid: props.location.state.eid }
        });

    }

    const OnExitEarly = () => {
        setmodalvisible(true);
    }


    const Onquit=()=>{
        setmodalvisible(false);
    }

    return (
        <>
            <div style={{

                backgroundColor: "gray",
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: "center"
            }}>

                <div>
                    <Modal title="시험 조기 종료"
                        visible={modalvisible}
                        onOk={OnFinish}
                        onCancel={Onquit}>

                        <p>
                            시험을 지금 종료합니까?
                        </p>

                        </Modal>
                </div>



                <div>
                    <Card title={props.location.state.TestName} bordered={true} style={{
                        textAlign: "center"
                    }}>
                        <Button style={{
                            height: 100
                        }} type="ghost"><Countdown title="Countdown" value={deadline} onFinish={OnFinish} /></Button>
                        <div style={{
                            float:"right"
                        }}>

                            <Button onClick={OnExitEarly}>시험 조기 종료</Button>
                        </div>

                        
                        <PdfComponent location={props.location} />
                    </Card>

                </div>

            </div>








        </>
    );
}

const PdfComponent = (props) => {
    const [numPages, setnumPages] = useState(null);
    const [pageNumber, setpageNumber] = useState(0);
    const [selectedImagePath, setselectedImagePath] = useState();

    useEffect(()=>{
        import('../uploads/pdfs/'+props.location.state.fileName).then((pdf)=>{
            console.log(pdf.default);
            setselectedImagePath(pdf.default);
        });
        
    });
    const onDocumentLoadSucess = ({ numPages }) => {
        setnumPages(numPages);
        console.log("sucess")
    }

    const OnPageback = () => {
        if (pageNumber - 1 >= 0) {
            setpageNumber(pageNumber - 1);
        }

    }

    const OnPagenext = () => {
        if (pageNumber + 1 < numPages) {
            setpageNumber(pageNumber + 1);
        }

    }


    return (
        <div>
            <Document
                file={selectedImagePath}
                onLoadSuccess={onDocumentLoadSucess}
            >
                <Page pageIndex={pageNumber} width={props.wrapperDivSize} scale={1} />
            </Document>
            <Row>
                <Col span={12}>
                    <div className="site-button-ghost-wrapper">
                        <Button onClick={OnPageback} block><LeftOutlined />{pageNumber}</Button>
                    </div>
                </Col>
                <Col span={12}>
                    <div>
                        <Button onClick={OnPagenext} block>{pageNumber + 1}<RightOutlined /></Button>
                    </div>
                </Col>


            </Row>
        </div>
    );

}

export default Examing;