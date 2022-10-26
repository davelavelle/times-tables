import React, { useState } from 'react';
import './App.css';
import ChooseTables from './components/choose-tables';
import TablesList from './types/tablesList';
import Button from 'react-bootstrap/Button';
import ChooseQuestions from './components/choose-questions';
import OneSetOrder from './components/one-set-order';
import ChooseTimer from './components/choose-timer';
import Question from './types/question';
import QuestionSet from './types/questionSet';
import TimesTableTest from './components/times-table-test';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function App() {
  const tables = () => {
    var lowEnd = 2;
    var highEnd = 12;
    var arr: TablesList[] = [];
    while (lowEnd <= highEnd) {
      arr.push({ table: lowEnd++, selected: false });
    }
    return arr;
  }

  const [pageState, setPageState] = useState<'HOME' | 'CHOOSETABLES' | 'CHOOSEQUESTIONS' | 'ONESETORDER' | 'CHOOSETIMER' | 'TESTPREVIEW' | 'TEST' | 'TESTSUMMARY'>('HOME');
  const [questionOrderRandom, setQuestionOrderRandom] = useState<boolean>(true);
  const [timer, setTimer] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [tablesList, setTablesList] = useState<TablesList[]>(tables())
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(0)
  const [questionSet, updateQuestionSet] = useState<QuestionSet | undefined>(undefined)

  const tablesListCount = () => {
    return tablesListToTest().length;
  }

  const tablesListToTest = () => {
    return tablesList.filter(t => t.selected);
  }

  const setQuestionOrder = (random: boolean) => {
    setQuestionOrderRandom(random);
    setPageState('CHOOSETIMER');
  }

  const tablesSet = () => {
    if (tablesListCount() < 1)
      return;
    if (tablesListCount() > 1) {
      setPageState('CHOOSEQUESTIONS');
      return;
    }

    setPageState('ONESETORDER');
  }

  const setBackFromTimer = () => {
    if (tablesListCount() > 1) {
      setPageState('CHOOSEQUESTIONS')
      return;
    }
    setPageState('ONESETORDER');

  }

  const setQuestionsTimer = (hasTimer: boolean) => {
    setTimer(hasTimer);
    setPageState('TESTPREVIEW');

  }

  const verifyQuestions = () => {
    if (numberOfQuestions > tablesListCount() * 12) {
      return;
    }
    setPageState('CHOOSETIMER')
  }

  const createTest = () => {
    const questionList: Question[] = [];
    if (tablesListCount() === 1) {
      if (questionOrderRandom) {
        //debugger;
        const q: number[] = [];
        for (let i = 1; i <= 12; i++) {
          const qLength = q.length;
          while (q.length === qLength) {
            const nextTimes: number = parseInt((Math.random() * 13).toString()) + 1;
            if (!q.includes(nextTimes) && nextTimes <= 12) {
              q.push(nextTimes);
              questionList.push({
                num: i,
                base: tablesListToTest()[0].table,
                times: nextTimes,
                correctAnswer: tablesListToTest()[0].table * nextTimes,
                givenAnswer: -1
              });
            }
          }
        }

      } else {
        for (let i = 1; i <= 12; i++) {
          questionList.push({
            num: i,
            base: tablesListToTest()[0].table,
            times: i,
            correctAnswer: tablesListToTest()[0].table * i,
            givenAnswer: -1
          });
        }
      }
    } else {
      const q: string[] = [];
      for (let i = 1; i <= numberOfQuestions; i++) {
        const qLength = q.length;
        while (q.length === qLength) {
          const nextBase: number = parseInt((Math.random() * (tablesListToTest().length + 1)).toString());
          const nextTimes: number = parseInt((Math.random() * 13).toString()) + 1;
          const id = `${nextTimes}-${nextBase}`
          if (!q.includes(id) && nextTimes <= 12 && nextBase <= q.length) {
            q.push(id);
            questionList.push({
              num: i,
              base: tablesListToTest()[0].table,
              times: nextTimes,
              correctAnswer: tablesListToTest()[0].table * nextTimes,
              givenAnswer: -1
            });
          }
        }
      }
    }

    updateQuestionSet({
      questions: questionList,
      timer: timer,
      started: new Date(),
      timeTaken: '',
      totalCorrect: 0,
      totalQuestions: questionList.length,
      showTimer: showTimer
    })

    setPageState('TEST')
  }

  const completeTest = () => {
    setPageState('TESTSUMMARY');
  }

  const renderPage = () => {
    switch (pageState) {
      case 'HOME':
        return (
          <section id="home">
            <Row>
              <h2>How to use:</h2>
              <Container>
                <ol>
                  <li>
                    <p>Choose which times-tables you want to test</p>
                  </li>
                  <li>
                    <p>If you choose just one, then you will be asked to test in order, or random order.</p>
                  </li>
                  <li>
                    <p>If you choose multiple tables, you will be asked how many questions.  The order will be random.</p>
                  </li>
                  <li>
                    <p>Choose to show the time, then if you want to have 6 seconds per question, or no timer.</p>
                  </li>
                  <li>
                    <p>Review the test options, then start the test.</p>
                  </li>
                </ol>
                <p>You can go back to change options before starting the test.</p>
                <p>At the end of the test you will be shown the results.</p>
              </Container>
              <Col></Col>
              <Col className='d-grid' xs={12} sm={6} md={4}>
                <Button variant='success' size='lg' onClick={() => setPageState('CHOOSETABLES')}>START TEST</Button>
              </Col>
              <Col></Col>
            </Row>
          </section>
        );
      case 'CHOOSETABLES':
        return (
          <section id="choose-tables">
            <Row className='d-grid gap-2'>
              <ChooseTables tablesList={tablesList} setTablesList={setTablesList} />
              <Button variant='success' size='lg' onClick={() => tablesSet()}>NEXT</Button>
              <Button variant='light' onClick={() => setPageState('HOME')}>CANCEL</Button>
            </Row>
          </section>
        );
      case 'CHOOSEQUESTIONS':
        return (
          <section id="choose-questions">
            <Row className='d-grid gap-2'>
              <ChooseQuestions numberOfQuestions={numberOfQuestions} setNumberOfQuestions={setNumberOfQuestions} maxQuestions={tablesListCount() * 12} />
              <Button variant='success' size='lg' onClick={() => verifyQuestions()}>NEXT</Button>
              <Button variant='secondary' onClick={() => setPageState('CHOOSETABLES')}>BACK</Button>
              <Button variant='light' onClick={() => setPageState('HOME')}>CANCEL</Button>
            </Row>
          </section>
        );
      case 'ONESETORDER':
        return (
          <section id="one-set-order">
            <Row className='d-grid gap-2'>
              <OneSetOrder setQuestionOrderRandom={setQuestionOrder} />
              <Button variant='secondary' onClick={() => setPageState('CHOOSETABLES')}>BACK</Button>
              <Button variant='light' onClick={() => setPageState('HOME')}>CANCEL</Button>
            </Row>
          </section>
        );
      case 'CHOOSETIMER':
        return (
          <section id="choose-timer">
            <Row className='d-grid gap-2'>
              <ChooseTimer setTimer={setQuestionsTimer} showTimer={showTimer} setShowTimer={setShowTimer} />
              <Button variant='secondary' onClick={() => setBackFromTimer()}>BACK</Button>
              <Button variant='light' onClick={() => setPageState('HOME')}>CANCEL</Button>
            </Row>
          </section>
        );
      case 'TESTPREVIEW':
        return (
          <section id="test-preview">
            <Row className='d-grid gap-2'>
              <h2>Test Preview:</h2>
              <h3>Times Tables to Test:</h3>
              <Container>
                <ul>
                  {tablesListToTest().map((tt) => {
                    return (
                      <li key={tt.table}>{tt.table} times tables</li>
                    )
                  })}
                </ul>
              </Container>
              <p>Number Of Questions: <strong>{tablesListCount() === 1 ? '12' : numberOfQuestions}</strong></p>
              {tablesListCount() === 1 &&
                <p>
                  Random Order: <strong> {questionOrderRandom ? 'Yes' : 'No'} </strong>
                </p>
              }
              <p>Timer: <strong>{timer ? '6 secs per Question' : 'None'}</strong></p>
              <Button variant='success' size='lg' onClick={() => createTest()}>START TEST</Button>
              <Button variant='secondary' onClick={() => setPageState('CHOOSETIMER')}>BACK</Button>
              <Button variant='light' onClick={() => setPageState('HOME')}>CANCEL</Button>
            </Row>
          </section>
        );
      case 'TEST':
        return (
          <section id="times-table-test">
            <TimesTableTest questionSet={questionSet} updateQuestionSet={updateQuestionSet} completeTest={completeTest} />
          </section>
        );
      case 'TESTSUMMARY':
        return (
          <section id="test-summary">
            <div className='d-grid gap-2'>

              <h2>Test Summary:</h2>
              <ol>
                {questionSet?.questions.map(question => {
                  return (
                    <li>
                      <Row>
                        <Col xs={1}>
                        </Col>
                        <Col xs={3}>
                          {question.base} x {question.times}
                        </Col>
                        <Col xs={1}>
                          =
                        </Col>
                        <Col xs={2}>
                          {question.givenAnswer === -1 ? 'Not Answered' : question.givenAnswer}
                        </Col>
                        <Col xs={3}>
                          {question.correctAnswer === question.givenAnswer ? <span className='text-success'>&#10004;</span> : <><span className='text-danger'>&#10006;</span> ({question.correctAnswer}) </>}                        </Col>

                      </Row>
                    </li>
                  )
                })}
              </ol>
              <h3>Score: {questionSet?.totalCorrect}/{questionSet?.totalQuestions}</h3>
              <p>Time Taken: {questionSet?.timeTaken}</p>
              <Button variant='success' size='lg' onClick={() => setPageState('HOME')}>FINISH</Button>
            </div>
          </section>
        );

    }
  }

  return (
    <div className="App">
      <Container>
        <header>
          <Row className="d-flex align-items-center p-3 my-3 text-white bg-purple rounded shadow-sm">
            <div className="lh-1">
              <h1><i className=''></i>Adam's Times Tables Test</h1>
            </div>
          </Row>
        </header>
        <section>
          <div>
            {renderPage()}
          </div>
        </section>
      </Container>
    </div>
  );
}

export default App;
