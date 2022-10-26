import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function ChooseQuestions({ numberOfQuestions, maxQuestions, setNumberOfQuestions }: ChooseQuestionsProps) {
    const [numberOfQuestionsAnswer, setNumberOfQuestionsAnswer] = useState<string>('')
    const [isValid, setIsValid] = useState<boolean>(true);
    const updateNumberOfQuestionsAnswer = (num: number) => {
        setIsValid(true);
        if (num > maxQuestions) {
            setIsValid(false);
        }
        setNumberOfQuestions(num);
        setNumberOfQuestionsAnswer(num.toString());
    }

    useEffect(() => {
        setNumberOfQuestionsAnswer(numberOfQuestions <= 0 ? '' : numberOfQuestions.toString());
    }, [numberOfQuestions]);

    return (
        <Container>
            <Row>
                <Col></Col>
                <Col className='d-grid' xs={12} sm={6} md={4}>
                    <h2>Number of Questions</h2>
                    <Form>
                        <div className="mb3">
                            <Form.Control
                                autoFocus
                                type='number'
                                id='number-of-questions'
                                value={numberOfQuestionsAnswer}
                                onChange={(e) => updateNumberOfQuestionsAnswer(parseInt(e.target.value))}
                                isValid={isValid}
                            />
                            {!isValid &&
                                <Alert variant='danger'>
                                    Maximum number of Questions is {maxQuestions}
                                </Alert>
                            }
                        </div>
                    </Form>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}

export default ChooseQuestions;

interface ChooseQuestionsProps {
    numberOfQuestions: number;
    maxQuestions: number;
    setNumberOfQuestions: Function;
}