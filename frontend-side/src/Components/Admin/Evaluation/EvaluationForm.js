import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import questionService from '../../../Services/questionService';
import evaluationService from '../../../Services/evaluationService';

const EvaluationForm = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [openEndedResponse, setOpenEndedResponse] = useState('');
    const [hasSubmittedEvaluation, setHasSubmittedEvaluation] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const teacherId = location.state?.teacherId;
    const groupId = 'group-id'; // Replace with the actual group ID

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
        return <div>You have already submitted an evaluation for this teacher.</div>;
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
            console.error('Error submitting evaluation:', error);
        }
    };

    return (
        <div className="container">
            <h2>Evaluation Form</h2>
            <form onSubmit={handleSubmit}>
                {questions.map((question) => (
                    <div key={question._id} className="mb-3">
                        <p>{question.text}</p>
                        {question.type === 'rating' && (
                            <div className="form-group">
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    className="form-control-range"
                                    value={answers[question._id] || ''}
                                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                />
                                <span>{answers[question._id] || 'N/A'}</span>
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
                                placeholder="Open-ended Response"
                                value={answers[question._id] || ''}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            />
                        )}
                    </div>
                ))}
                <textarea
                    className="form-control mb-3"
                    placeholder="Open-ended Response"
                    value={openEndedResponse}
                    onChange={(e) => setOpenEndedResponse(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                    Submit Evaluation
                </button>
            </form>
        </div>
    );
};

export default EvaluationForm;
