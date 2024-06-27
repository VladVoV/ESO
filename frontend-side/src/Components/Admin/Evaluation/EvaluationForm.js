import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import questionService from '../../../Services/questionService';
import evaluationService from '../../../Services/evaluationService';
import Header from "../../Header";

const EvaluationForm = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [openEndedResponse, setOpenEndedResponse] = useState('');
    const [hasSubmittedEvaluation, setHasSubmittedEvaluation] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const teacherId = location.state?.teacherId;
    const groupId = 'group-id';

    useEffect(() => {
        fetchQuestions();
        checkEvaluationStatus();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await questionService.getAllQuestions();
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const checkEvaluationStatus = async () => {
        try {
            const response = await evaluationService.getEvaluationStatus(teacherId);
            setHasSubmittedEvaluation(response.hasSubmitted);
        } catch (error) {
            console.error('Error checking evaluation status:', error);
        }
    };

    if (hasSubmittedEvaluation) {
        return <div>Ви уже відправили дану форму для цього викладача</div>;
    }

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const evaluationData = {
                teacherId,
                groupId,
                answers: Object.entries(answers).map(([questionId, answer]) => ({
                    question: questionId,
                    answer,
                })),
                openEndedResponse,
            };
            await evaluationService.submitEvaluation(evaluationData);
            navigate('/confirmation');
        } catch (error) {
            setErrorMessage((error.response.data.message))
            console.error('Error submitting evaluation:', error);
        }
    };

    return (
        <div>
            <Header/>
        <div className="container">
            <h2>Форма</h2>
            <form onSubmit={handleSubmit}>
                {questions.map((question) => (
                    <div key={question._id} className="mb-3">
                        <p>{question.text}</p>
                        {question.type === 'rating' && (
                            <div className="form-check">
                                {[1, 2, 3, 4, 5].map((ratingValue) => (
                                    <div key={ratingValue} className="form-check form-check-inline">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`${question._id}-${ratingValue}`}
                                            name={question._id}
                                            value={ratingValue}
                                            checked={answers[question._id] === ratingValue.toString()}
                                            onChange={(e) => handleAnswerChange(question._id, e.target.checked ? e.target.value : '')}
                                        />
                                        <label className="form-check-label" htmlFor={`${question._id}-${ratingValue}`}>
                                            {ratingValue}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {question.type === 'choice' && (
                            <div className="form-check">
                                {question.choices.map((choice, index) => (
                                    <div key={index} className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id={`${question._id}-${index}`}
                                            name={question._id}
                                            value={choice}
                                            checked={answers[question._id] === choice}
                                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor={`${question._id}-${index}`}>
                                            {choice}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {question.type === 'open' && (
                            <textarea
                                className="form-control"
                                placeholder="Відкрита відповідь"
                                value={answers[question._id] || ''}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            />
                        )}
                    </div>
                ))}
                <textarea
                    className="form-control mb-3"
                    placeholder="Відкрита відповідь"
                    value={openEndedResponse}
                    onChange={(e) => setOpenEndedResponse(e.target.value)}
                />
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <button type="submit" className="btn btn-primary">
                    Відправити
                </button>
            </form>
        </div>
        </div>
    );
};

export default EvaluationForm;
