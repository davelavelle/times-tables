import Question from "./question";

export default interface QuestionSet {
    started: Date,
    timer: boolean,
    showTimer: boolean,
    timeTaken: string,
    questions: Question[],
    totalQuestions: number,
    totalCorrect: number
}