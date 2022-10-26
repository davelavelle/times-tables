import React, { useState, useEffect, FormEvent, useRef, useCallback } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import QuestionSet from '../../types/questionSet';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Question from '../../types/question';
import './index.css';

function TimesTablesTest({ questionSet, updateQuestionSet: saveQuestionSet, completeTest }: TimesTablesTestProps) {

    const [questionNumber, setQuestionNumber] = useState<number>(1)
    const [questionAnswer, setQuestionAnswer] = useState<string>('')
    const answerInput = useRef<HTMLInputElement>(null);
    const [timeGone, setTimeGone] = useState<string>('')

    const getTimeTaken = useCallback(() => {

        if (!questionSet) return '';

        const now = new Date();

        const diffTime: number = (now.getTime() - questionSet.started.getTime()) / 60000;
        const minutes = parseInt(diffTime.toString());
        const seconds = parseInt(((diffTime - minutes) * 60).toString());
        return `${minutes} minutes ${seconds} seconds`;
    }, [questionSet]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateQuestionSet(parseInt(questionAnswer));
    };

    const updateQuestionSet = (answer: number | undefined) => {
        const newQuestions: Question[] = [];

        questionSet?.questions.forEach(question => {
            newQuestions.push(question);
        });
        if (answer) {
            newQuestions[questionNumber - 1].givenAnswer = answer;
        }

        const newQuestionSet = {
            questions: newQuestions,
            timer: questionSet?.timer,
            showTimer: questionSet?.showTimer,
            started: questionSet?.started,
            timeTaken: getTimeTaken(),
            totalQuestions: newQuestions.length,
            totalCorrect: newQuestions.filter(x => x.correctAnswer === x.givenAnswer).length
        } as QuestionSet;

        saveQuestionSet(newQuestionSet);

        if (questionNumber >= newQuestions.length) {
            completeTest();
            return;
        }
        setQuestionNumber(questionNumber + 1);
        setQuestionAnswer('');

        if (null !== answerInput.current) {
            answerInput.current.focus();
        }

    }

    const updateTimeGone = useCallback(
        () => {
            setTimeGone(getTimeTaken());

        }, [getTimeTaken]);

    const timesUp = useCallback(() => {
        if (!questionSet) return '';
        const now = new Date();
        const diffTime: number = (now.getTime() - questionSet.started.getTime()) / 1000;
        return diffTime > questionSet.questions.length * 6;
    }, [questionSet]);

    useEffect(() => {
        if (questionSet?.timer && timesUp()) {
            updateQuestionSet(undefined);
            completeTest();
            return;
        }
        setTimeout(updateTimeGone, 1000);
    }, [updateTimeGone, timeGone, completeTest, timesUp, questionSet?.timer]);

    return (
        <div>
            <h2>Test</h2>
            {questionSet?.showTimer &&
                <p>Time: {timeGone}</p>
            }
            <Form onSubmit={handleSubmit}>
                <Form.Label>Question {questionNumber}</Form.Label>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label column xs="6">
                        {questionSet?.questions[questionNumber - 1].base} x {questionSet?.questions[questionNumber - 1].times} =
                    </Form.Label>
                    <Col>
                        <InputGroup>
                            <Form.Control
                                autoFocus
                                ref={answerInput}
                                type='number'
                                value={questionAnswer.toString()}
                                onChange={(e) => setQuestionAnswer(e.target.value)} />
                            <Button variant="success" type="submit">
                                ENTER
                            </Button>
                        </InputGroup>
                    </Col>
                </Form.Group>

            </Form>
        </div>
    )
}

export default TimesTablesTest;

interface TimesTablesTestProps {
    questionSet: QuestionSet | undefined;
    updateQuestionSet: Function;
    completeTest: Function;
}