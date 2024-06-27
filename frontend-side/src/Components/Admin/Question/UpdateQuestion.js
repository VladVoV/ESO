import React, { useState } from 'react';
import questionService from "../../../Services/questionService";

const UpdateQuestion = ({ questionId, initialQuestion, onUpdate, onCloseModal }) => {
    const [question, setQuestion] = useState(initialQuestion);

    const handleInputChange = (e) => {
        setQuestion({ ...question, text: e.target.value });
    };

    const handleTypeChange = (e) => {
        setQuestion({ ...question, type: e.target.value });
    };

    const handleChoiceChange = (index, value) => {
        const updatedChoices = [...question.choices];
        updatedChoices[index] = value;
        setQuestion({ ...question, choices: updatedChoices });
    };

    const handleAddChoice = () => {
        setQuestion({ ...question, choices: [...question.choices, ''] });
    };

    const handleRemoveChoice = (index) => {
        const updatedChoices = [...question.choices];
        updatedChoices.splice(index, 1);
        setQuestion({ ...question, choices: updatedChoices });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await questionService.updateQuestion(questionId, question);
            onUpdate();
        } catch (error) {
            console.error('Error updating question:', error);
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
                value={question.text}
                onChange={handleInputChange}
                placeholder="Текст запитання"
            />

            <select value={question.type} onChange={handleTypeChange}>
                <option value="">Тип запитання</option>
                <option value="rating">Rating</option>
                <option value="choice">Choice</option>
                <option value="open">Open</option>
            </select>

            {question.type === 'choice' && (
                <div>
                    {question.choices.map((choice, index) => (
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

            <button type="submit">Оновити</button>
        </form>
        </div>
    );
};

export default UpdateQuestion;
