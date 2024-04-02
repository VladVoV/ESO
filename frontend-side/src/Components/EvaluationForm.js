import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questionService from '../Services/questionService';
import evaluationService from '../Services/evaluationService';

const EvaluationForm = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [openEndedResponse, setOpenEndedResponse] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await questionService.getAllQuestions();
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const teacherId = 'teacher-id';
            const groupId = 'group-id';
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
        <div>
            <h2>Evaluation Form</h2>
            <form onSubmit={handleSubmit}>
                {questions.map((question) => (
                    <div key={question._id}>
                        <p>{question.text}</p>
                        {question.type === 'rating' && (
                            <div>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={answers[question._id] || ''}
                                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                />
                                <span>{answers[question._id] || 'N/A'}</span>
                            </div>
                        )}
                        {question.type === 'choice' && (
                            <div>
                                {question.choices.map((choice, index) => (
                                    <div key={index}>
                                        <input
                                            type="radio"
                                            id={`${question._id}-${index}`}
                                            name={question._id}
                                            value={choice}
                                            checked={answers[question._id] === choice}
                                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                                        />
                                        <label htmlFor={`${question._id}-${index}`}>{choice}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {question.type === 'open' && (
                            <textarea
                                value={answers[question._id] || ''}
                                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            />
                        )}
                    </div>
                ))}
                <textarea
                    placeholder="Open-ended Response"
                    value={openEndedResponse}
                    onChange={(e) => setOpenEndedResponse(e.target.value)}
                />
                <button type="submit">Submit Evaluation</button>
            </form>
        </div>
    );
};

export default EvaluationForm;
