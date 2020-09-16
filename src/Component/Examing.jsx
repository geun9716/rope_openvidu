import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Form, Card, Typography, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { pdfjs, Document, Page } from 'react-pdf'



pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/' + pdfjs.version + '/pdf.worker.js';

const Examing = () => {

    const [numPages, setnumPages] = useState(null);
    const [pageNumber, setpageNumber] = useState(1);
    const [selectedImagePath, setselectedImagePath] = useState('../uploads/Example_pdf.pdf');


    const onDocumentLoadSucess = ({ numPages }) => {
        setnumPages(numPages);
        console.log("sucess")
    }

    const OnPageback = () => {
        if (pageNumber - 1 != 0) {
            setpageNumber(pageNumber - 1);
        }

    }

    const OnPagenext = () => {
        if (pageNumber + 1 != numPages) {
            setpageNumber(pageNumber + 1);
        }

    }

    return (
        <>
            <div style={{
                height:"100%",
                width:"100%",
              
               
            }}>
                <div>
                    <Document
                        file={selectedImagePath}
                        onLoadSuccess={onDocumentLoadSucess}
                    >
                        <Row>
                            <Col style={{
                                textAlign: "center"
                            }}>
                                <Page pageNumber={pageNumber} scale="1.2"></Page> <Button onClick={OnPageback}><LeftOutlined />{pageNumber}</Button>
                            </Col>

                            <Col style={{
                                textAlign: "center"
                            }}>
                                <Page pageNumber={pageNumber + 1} scale="1.2"></Page>
                                <Button onClick={OnPagenext}>{pageNumber + 1}<RightOutlined /></Button>
                            </Col>

                        </Row>

                    </Document>



                </div>


            </div>


        </>
    );
}

export default Examing;