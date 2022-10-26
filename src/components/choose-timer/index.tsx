import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ChooseTimer({ showTimer, setShowTimer, setTimer }: ChooseTimerProps) {


    return (
        <Row>
            <Col></Col>
            <Col className='d-grid gap-2' xs={12} sm={6} md={4}>
                <h2>Choose Timer</h2>
                <Form>
                    <Form.Check
                        type='switch'
                        label='Show Timer during test'
                        checked={showTimer}
                        onChange={(e) => setShowTimer(e.target.checked)} />
                </Form>
                <Button variant='success' size='lg' onClick={() => setTimer(true)}>6s per Question</Button>
                <Button variant='success' size='lg' onClick={() => setTimer(false)}>No Timer</Button>
            </Col>
            <Col></Col>
        </Row>
    )
}

export default ChooseTimer;

interface ChooseTimerProps {
    showTimer: boolean;
    setShowTimer: Function;
    setTimer: Function;
}