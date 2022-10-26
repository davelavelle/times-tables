import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function OneSetOrder({ setQuestionOrderRandom }: OneSetOrderProps) {


    return (
        <Row>
            <Col></Col>
            <Col className='d-grid gap-2' xs={12} sm={6} md={4}>
                <h2>Question Order</h2>
                <Button variant='success' size='lg' onClick={() => setQuestionOrderRandom(true)}>RANDOM</Button>
                <Button variant='success' size='lg' onClick={() => setQuestionOrderRandom(false)}>IN ORDER</Button>
            </Col>
            <Col></Col>
        </Row>
    )
}

export default OneSetOrder;

interface OneSetOrderProps {
    setQuestionOrderRandom: Function;
}