import React, { useState } from 'react';
import questionService from "../../../Services/questionService";

const CreateQuestion = ({ onCreateQuestion, onCloseModal }) => {
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        type: '',
        choices: [],
    });

    const handleInputChange = (e) => {
        setNewQuestion({ ...newQuestion, text: e.target.value });
    };

    const handleTypeChange = (e) => {
        setNewQuestion({ ...newQuestion, type: e.target.value });
    };

    const handleChoiceChange = (index, value) => {
        const updatedChoices = [...newQuestion.choices];
        updatedChoices[index] = value;
        setNewQuestion({ ...newQuestion, choices: updatedChoices });
    };

    const handleAddChoice = () => {
        setNewQuestion({ ...newQuestion, choices: [...newQuestion.choices, ''] });
    };

    const handleRemoveChoice = (index) => {
        const updatedChoices = [...newQuestion.choices];
        updatedChoices.splice(index, 1);
        setNewQuestion({ ...newQuestion, choices: updatedChoices });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await questionService.createQuestion(newQuestion);
            setNewQuestion({
                text: '',
                type: '',
                choices: [],
            });
            onCreateQuestion();
        } catch (error) {
            console.error('Error creating question:', error);
        }
    };

    const handleClose = () => {
        onCloseModal();
    };

    return (
        <div>
            <button className="close-button" onClick={handleClose}>
                X
            </button>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={newQuestion.text}
                onChange={handleInputChange}
                placeholder="Текст запитання"
            />

            <select value={newQuestion.type} onChange={handleTypeChange}>
                <option value="">Тип запитання</option>
                <option value="rating">Rating</option>
                <option value="choice">Choice</option>
                <option value="open">Open</option>
            </select>

            {newQuestion.type === 'choice' && (
                <div>
                    {newQuestion.choices.map((choice, index) => (
                        <div key={index} className="choice-input">
                            <input
                                type="text"
                                value={choice}
                                onChange={(e) => handleChoiceChange(index, e.target.value)}
                                placeholder={`Choice ${index + 1}`}
                            />
                            <button type="button" onClick={() => handleRemoveChoice(index)}>
                                Вилучити
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddChoice}>
                        Додати
                    </button>
                </div>
            )}

            <button type="submit">Створити</button>
        </form>
        </div>
    );
};

export default CreateQuestion;
