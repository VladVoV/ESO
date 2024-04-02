import React, { useState, useEffect } from 'react';
import questionService from '../Services/questionService';

const QuestionManagement = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        type: '',
        choices: [],
    });

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

    const handleCreateQuestion = async () => {
        try {
            await questionService.createQuestion(newQuestion);
            setNewQuestion({
                text: '',
                type: '',
                choices: [],
            });
            fetchQuestions();
        } catch (error) {
            console.error('Error creating question:', error);
        }
    };

    const handleUpdateQuestion = async (id, updatedQuestion) => {
        try {
            await questionService.updateQuestion(id, updatedQuestion);
            fetchQuestions();
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await questionService.deleteQuestion(id);
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <div className="container my-5">
            <h2 className="mb-4">Question Management</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Create Question</h5>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            value={newQuestion.text}
                            onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                            placeholder="Question Text"
                        />
                    </div>
                    <div className="form-group">
                        <select
                            className="form-control"
                            value={newQuestion.type}
                            onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                        >
                            <option value="">Select Question Type</option>
                            <option value="rating">Rating</option>
                            <option value="choice">Choice</option>
                            <option value="open">Open</option>
                        </select>
                    </div>
                    {newQuestion.type === 'choice' && (
                        <div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Choice 1"
                                    value={newQuestion.choices[0] || ''}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, choices: [e.target.value] })}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Choice 2"
                                    value={newQuestion.choices[1] || ''}
                                    onChange={(e) =>
                                        setNewQuestion({ ...newQuestion, choices: [newQuestion.choices[0] || '', e.target.value] })
                                    }
                                />
                            </div>
                            {/* Add more choice inputs if needed */}
                        </div>
                    )}
                    <button className="btn btn-primary" onClick={handleCreateQuestion}>
                        Create Question
                    </button>
                </div>
            </div>
            <ul className="list-group">
                {questions.map((question) => (
                    <li key={question._id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5>{question.text}</h5>
                                <p className="mb-0">Type: {question.type}</p>
                            </div>
                            <div>
                                <button
                                    className="btn btn-primary mr-2"
                                    onClick={() =>
                                        handleUpdateQuestion(question._id, {
                                            text: 'Updated Question Text',
                                            type: question.type,
                                            choices: question.choices,
                                        })
                                    }
                                >
                                    Update Question
                                </button>
                                <button className="btn btn-danger" onClick={() => handleDeleteQuestion(question._id)}>
                                    Delete Question
                                </button>
                            </div>
                        </div>
                        {question.type === 'choice' && (
                            <div>
                                <h6>Choices:</h6>
                                <ul className="list-group list-group-flush">
                                    {question.choices.map((choice, index) => (
                                        <li key={index} className="list-group-item">
                                            {choice}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionManagement;
