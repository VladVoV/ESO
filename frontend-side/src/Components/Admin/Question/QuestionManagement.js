import React, { useState, useEffect } from 'react';
import questionService from '../../../Services/questionService';
import UpdateQuestion from './UpdateQuestion';
import CreateQuestion from './CreateQuestion';
import Header from "../../Header";
import Modal from "../../../Common/Modal";

const QuestionManagement = () => {
    const [questions, setQuestions] = useState([]);
    const [questionToUpdate, setQuestionToUpdate] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

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

    const handleUpdateQuestion = (question) => {
        setQuestionToUpdate(question);
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await questionService.deleteQuestion(id);
            fetchQuestions();
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const toggleCreateModal = () => {
        setShowCreateModal(!showCreateModal);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleCloseUpdateModal = () => {
        setQuestionToUpdate(null);
    };

    return (
        <div>
            <Header />
            <div className="container my-5">
                <h2 className="mb-4">Запитання</h2>
                <div className="card mb-4">
                    <div className="card-body">
                        <button className="btn btn-primary" onClick={toggleCreateModal}>
                            Створити
                        </button>
                    </div>
                </div>
                <ul className="list-group">
                    {questions.map((question) => (
                        <li key={question._id} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5>{question.text}</h5>
                                    <p className="mb-0">Тип: {question.type}</p>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-primary mr-2"
                                        onClick={() => handleUpdateQuestion(question)}
                                    >
                                        Оновити
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteQuestion(question._id)}
                                    >
                                        Видалити
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
                <Modal isOpen={questionToUpdate !== null}>
                    {questionToUpdate && (
                        <UpdateQuestion
                            questionId={questionToUpdate._id}
                            initialQuestion={questionToUpdate}
                            onUpdate={() => {
                                setQuestionToUpdate(null);
                                fetchQuestions();
                            }}
                            onCloseModal={handleCloseUpdateModal}
                        />
                    )}
                </Modal>
                <Modal isOpen={showCreateModal}>
                    <CreateQuestion
                        onCreateQuestion={() => {
                            setShowCreateModal(false);
                            fetchQuestions();
                        }}
                        onCloseModal={handleCloseCreateModal}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default QuestionManagement;
